import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PedometerContext = createContext();

export const PedometerProvider = ({ children }) => {
    const [globalSteps, setGlobalSteps] = useState(0);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    
    // track the change between updates
    const lastSensorReading = useRef(null); 
    const STORAGE_KEY = 'savedStepCount';

    const resetSteps = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, '0');
            setGlobalSteps(0);
            lastSensorReading.current = null; 
        } catch (e) {
            console.error("Failed to reset steps:", e);
        }
    };

    useEffect(() => {
        let subscription = null;

        const setupPedometer = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved !== null) {
                    setGlobalSteps(parseInt(saved, 10));
                }

                const isAvailable = await Pedometer.isAvailableAsync();
                setIsPedometerAvailable(isAvailable ? 'Yes' : 'No');
                if (!isAvailable) return;

                const { status } = await Pedometer.requestPermissionsAsync();
                if (status !== 'granted') return;

                subscription = Pedometer.watchStepCount((result) => {
                    // If we just started or just reset, set the baseline and wait for next update
                    if (lastSensorReading.current === null) {
                        lastSensorReading.current = result.steps;
                        return;
                    }

                    // Calculate how many steps happened since last tick
                    const delta = result.steps - lastSensorReading.current;
                    
                    if (delta > 0) {
                        setGlobalSteps((prevTotal) => {
                            const newTotal = prevTotal + delta;
                            
                            AsyncStorage.setItem(STORAGE_KEY, newTotal.toString());
                            
                            saveDailySteps(delta);
                            
                            return newTotal;
                        });
                    }

                    // Update the reading for the next comparison
                    lastSensorReading.current = result.steps;
                });

            } catch (error) {
                console.error('Pedometer error:', error);
            }
        };

        setupPedometer();
        return () => { subscription && subscription.remove(); };
    }, []);

    const saveDailySteps = async (delta) => {
        const today = new Date().toISOString().split('T')[0];
        const raw = await AsyncStorage.getItem('dailySteps');
        const dailyData = raw ? JSON.parse(raw) : {};
        
        const currentDayTotal = dailyData[today] || 0;
        dailyData[today] = currentDayTotal + delta;
        
        await AsyncStorage.setItem('dailySteps', JSON.stringify(dailyData));
    };

    return (
        <PedometerContext.Provider value={{ globalSteps, isPedometerAvailable, resetSteps }}>
            {children}
        </PedometerContext.Provider>
    );
};

export const usePedometerContext = () => useContext(PedometerContext);