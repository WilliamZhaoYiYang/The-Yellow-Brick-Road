import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PedometerContext = createContext();

export const PedometerProvider = ({ children }) => {
    const [globalSteps, setGlobalSteps] = useState(0);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    
    const lastSensorReading = useRef(null); 
    const STORAGE_KEY = 'savedStepCount';

    const burstBuffer = useRef(0);
    const isWalking = useRef(false);
    const walkTimeout = useRef(null);
    const THRESHOLD = 10; 

    const resetSteps = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, '0');
            setGlobalSteps(0);
            lastSensorReading.current = null; 
            isWalking.current = false;
            burstBuffer.current = 0;
            if (walkTimeout.current) clearTimeout(walkTimeout.current);
        } catch (e) {
            console.error("Failed to reset steps:", e);
        }
    };

    useEffect(() => {
        let subscription = null;

        const setupPedometer = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved !== null) setGlobalSteps(parseInt(saved, 10));

                const isAvailable = await Pedometer.isAvailableAsync();
                setIsPedometerAvailable(isAvailable ? 'Yes' : 'No');
                if (!isAvailable) return;

                const { status } = await Pedometer.requestPermissionsAsync();
                if (status !== 'granted') return;

                subscription = Pedometer.watchStepCount((result) => {
                    if (lastSensorReading.current === null) {
                        lastSensorReading.current = result.steps;
                        return;
                    }

                    const delta = result.steps - lastSensorReading.current;
                    if (delta <= 0) return;

                    if (!isWalking.current) {
                        burstBuffer.current += delta;
                        // Only start counting steps as real steps once threshold reached
                        if (burstBuffer.current >= THRESHOLD) {
                            isWalking.current = true;
                            updateGlobalSteps(burstBuffer.current);
                            burstBuffer.current = 0;
                        }
                    } else {
                        // Already in walking state, count steps 1 for 1
                        updateGlobalSteps(delta);
                    }

                    // Stop walking state after 5s of inactivity 
                    if (walkTimeout.current) clearTimeout(walkTimeout.current);
                    
                    walkTimeout.current = setTimeout(() => {
                        isWalking.current = false;
                        burstBuffer.current = 0;
                        console.log("Walking session ended due to inactivity.");
                    }, 5000);

                    lastSensorReading.current = result.steps;
                });

            } catch (error) {
                console.error('Pedometer error:', error);
            }
        };

        setupPedometer();
        return () => {
            if (subscription) subscription.remove();
            if (walkTimeout.current) clearTimeout(walkTimeout.current);
        };
    }, []);

    const updateGlobalSteps = (amount) => {
        setGlobalSteps(prev => {
            const next = prev + amount;
            AsyncStorage.setItem(STORAGE_KEY, next.toString());
            saveDailySteps(amount);
            return next;
        });
    };

    const saveDailySteps = async (delta) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const raw = await AsyncStorage.getItem('dailySteps');
            const dailyData = raw ? JSON.parse(raw) : {};
            
            dailyData[today] = (dailyData[today] || 0) + delta;
            await AsyncStorage.setItem('dailySteps', JSON.stringify(dailyData));
        } catch (e) {
            console.error("Error saving daily steps", e);
        }
    };

    return (
        <PedometerContext.Provider value={{ globalSteps, isPedometerAvailable, resetSteps }}>
            {children}
        </PedometerContext.Provider>
    );
};

export const usePedometerContext = () => useContext(PedometerContext);