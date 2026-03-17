import { StyleSheet, Pressable, Text, View, Alert, Button, Animated } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Pedometer } from 'expo-sensors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router';

const STORAGE_KEY = 'savedStepCount';

const Home = () => {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [lastUpdate, setLastUpdate] = useState('Never');
    const initialStepCount = useRef(null);
    const savedStepOffset = useRef(0);

    const animatedSteps = useRef(new Animated.Value(0)).current;
    const displaySteps = useRef(0);
    const [displayValue, setDisplayValue] = useState(0);

    const animateToValue = (newValue) => {
        Animated.timing(animatedSteps, {
            toValue: newValue,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }

    // Update step count with animation
    useEffect(() =>{
        const listener = animatedSteps.addListener(({ value }) => {
            const rounded = Math.round(value);
            if (rounded !== displaySteps.current){
                displaySteps.current = rounded;
                setDisplayValue(rounded);
            }
        });
        return () => animatedSteps.removeListener(listener);
    }, []);

    useEffect(() => {
        let subscription = null;

        const setupPedometer = async () => {
            try {
                // Load saved steps from prev session
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved !== null){
                    savedStepOffset.current = parseInt(saved, 10);
                    animateToValue(savedStepOffset.current);
                    displaySteps.current = savedStepOffset.current;
                }

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

                subscription = Pedometer.watchStepCount(result => {
                    console.log('Total steps from sensor:', result.steps);
                    
                    // Set baseline on first update
                    if (initialStepCount.current === null) {
                        initialStepCount.current = result.steps;
                    }
                    
                    // Steps this session + steps from previous sessions
                    const stepsSinceStart = result.steps - initialStepCount.current;
                    const totalSteps = savedStepOffset.current + stepsSinceStart;

                    animateToValue(totalSteps);
                    setLastUpdate(new Date().toLocaleTimeString());

                    AsyncStorage.setItem(STORAGE_KEY, totalSteps.toString());
                });

            } catch (error) {
                console.error('Pedometer error:', error);
                Alert.alert('Error', error.message);
            }
        };

        setupPedometer();

        return () => {
            subscription && subscription.remove();
        }
    }, []);

    const resetSteps = () => {
        initialStepCount.current = null;
        savedStepOffset.current = 0;
        AsyncStorage.removeItem(STORAGE_KEY);
        animateToValue(0);
    };

    const selectJourney = () => {
        router.push('/journey');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{displayValue}</Text>
            <Text style={styles.info}>Steps Into Your Journey</Text>
            <Text style={styles.small}>Available: {isPedometerAvailable}</Text>
            <Text style={styles.small}>Last Update: {lastUpdate}</Text>
            <Text style={styles.instruction}>
                Walk around with your phone to count steps
            </Text>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={resetSteps}>
                    <Text style={styles.buttonText}>Reset Counter</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={selectJourney}>
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
    },
    info: {
        fontSize: 24,
        marginBottom: 20,
        color: '#666',
    },
    small: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
    },
    instruction: {
        fontSize: 16,
        color: '#666',
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