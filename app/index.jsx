import { StyleSheet, Text, View, Alert, Button } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Pedometer } from 'expo-sensors'

const Home = () => {
    const [steps, setSteps] = useState(0);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [lastUpdate, setLastUpdate] = useState('Never');
    const initialStepCount = useRef(null);

    useEffect(() => {
        const setupPedometer = async () => {
            try {
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

                const subscription = Pedometer.watchStepCount(result => {
                    console.log('Total steps from sensor:', result.steps);
                    
                    // Set baseline on first update
                    if (initialStepCount.current === null) {
                        initialStepCount.current = result.steps;
                    }
                    
                    // Calculate steps since app opened
                    const stepsSinceStart = result.steps - initialStepCount.current;
                    setSteps(stepsSinceStart);
                    setLastUpdate(new Date().toLocaleTimeString());
                });

                return () => {
                    subscription && subscription.remove();
                };
            } catch (error) {
                console.error('Pedometer error:', error);
                Alert.alert('Error', error.message);
            }
        };

        setupPedometer();
    }, []);

    const resetSteps = () => {
        initialStepCount.current = null;
        setSteps(0);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{steps}</Text>
            <Text style={styles.info}>Steps Since App Opened</Text>
            <Text style={styles.small}>Available: {isPedometerAvailable}</Text>
            <Text style={styles.small}>Last Update: {lastUpdate}</Text>
            <Text style={styles.instruction}>
                Walk around with your phone to count steps
            </Text>
            <Button title="Reset Counter" onPress={resetSteps} />
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
    }
})