import { StyleSheet, Pressable, Text, View, Alert, Button, Animated } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Pedometer } from 'expo-sensors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useFocusEffect } from 'expo-router';

const STORAGE_KEY = 'savedStepCount';
const JOURNEY_KEY = 'selectedJourney';

const Home = () => {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [selectedJourney, setSelectedJourney] = useState(null);
    const initialStepCount = useRef(null);
    const savedStepOffset = useRef(0);

    const animatedSteps = useRef(new Animated.Value(0)).current;
    const [displayValue, setDisplayValue] = useState(0);
    const [stepsLeft, setStepsLeft] = useState(0);

    const animateToValue = (newValue) => {
        Animated.timing(animatedSteps, {
            toValue: newValue,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }

    // Load selected journey
    useFocusEffect(
        useCallback(() => {
            const loadJourney = async () => {
                const saved = await AsyncStorage.getItem(JOURNEY_KEY);
                if (saved) setSelectedJourney(JSON.parse(saved));
            };
            loadJourney();
        }, [])
    );

    // Update step count with animation
    useEffect(() =>{
        const listener = animatedSteps.addListener(({ value }) => {
            const rounded = Math.round(value);
            if (rounded !== displayValue){
                setDisplayValue(rounded);
            }
        });
        return () => animatedSteps.removeListener(listener);
    }, []);

    useEffect(() => {
        if (selectedJourney) {
            setStepsLeft(selectedJourney.totalSteps - displayValue);
        }
    }, [displayValue, selectedJourney]);

    useEffect(() => {
        let subscription = null;

        const setupPedometer = async () => {
            try {
                // Load saved steps if any exists
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved !== null) {
                    savedStepOffset.current = parseInt(saved, 10);
                    animateToValue(savedStepOffset.current);
                }

                // for testing purposes
                // const testSteps = 1000000;
                // savedStepOffset.current = testSteps;
                // animateToValue(testSteps);

                const isAvailable = await Pedometer.isAvailableAsync();
                setIsPedometerAvailable(isAvailable ? 'Yes' : 'No');

                if (!isAvailable) {
                    Alert.alert('Pedometer not available', 'This device does not support step counting');
                    return;
                }

                const { status } = await Pedometer.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission denied', 'Need permission to access step counter');
                    return;
                }

                // Pedometer detects walking
                subscription = Pedometer.watchStepCount(result => {
                    if (initialStepCount.current === null) {
                        initialStepCount.current = result.steps;
                    }
                    const stepsSinceStart = result.steps - initialStepCount.current;
                    const totalSteps = savedStepOffset.current + stepsSinceStart;
                    animateToValue(totalSteps);
                    AsyncStorage.setItem(STORAGE_KEY, totalSteps.toString());
                });

            } catch (error) {
                console.error('Pedometer error:', error);
                Alert.alert('Error', error.message);
            }
        };

        setupPedometer();
        return () => { subscription && subscription.remove(); };
    }, []);

    const resetSteps = () => {
        initialStepCount.current = null;
        savedStepOffset.current = 0;
        AsyncStorage.removeItem(STORAGE_KEY);
        animatedSteps.stopAnimation();
        animatedSteps.setValue(0);
        setDisplayValue(0);
    };

    return (
        <View style={styles.container}>
            <Text 
                style={styles.title}
                numberOfLines={1}
                adjustsFontSizeToFit
            >
                {selectedJourney ? displayValue.toLocaleString() : '🧭'}
            </Text>
            <Text style={styles.info}>{selectedJourney
                                        ? 'Steps Into Your Journey'
                                        : 'Please pick a journey before starting!'}
            </Text>
            <Text style={styles.instruction}>
                {selectedJourney
                    ? `${stepsLeft.toLocaleString()} steps to ${selectedJourney.goal}`
                    : 'Walk around with your phone to count steps'}
            </Text>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={resetSteps}>
                    <Text style={styles.buttonText}>Reset Counter</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => router.push('/journey')}>
                    <Text style={styles.buttonText}>Select Journey</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 20,
        backgroundColor: '#77d8f5',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 72,
        marginBottom: 10,
        textAlign: 'center',
    },
    info: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    instruction: {
        fontSize: 16,
        marginTop: 30,
        textAlign: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 70,
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        gap: 30, // Space between buttons
    },
    button: {
        flex: 1,
        backgroundColor: '#e9d8ab',
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        color: 'black', 
        fontSize: 16, 
        fontWeight: '600', 
    }
})