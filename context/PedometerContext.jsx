import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PedometerContext = createContext();

const STORAGE_KEY = 'savedStepCount';
const JOURNEY_KEY = 'selectedJourney';
const STEP_MULTIPLIER = 0.6;

export const PedometerProvider = ({ children }) => {
    const [globalSteps, setGlobalSteps] = useState(0);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [selectedJourney, setSelectedJourney] = useState(null);
    const [dailySteps, setDailySteps] = useState({}); 

    
    const lastSensorReading = useRef(null);
    const fractionalAccumulator = useRef(0);
    const selectedJourneyRef = useRef(null);
    
    // Load journey and sync ref — called from context so all screens benefit
    const loadJourney = async () => {
        const saved = await AsyncStorage.getItem(JOURNEY_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setSelectedJourney(parsed);
            selectedJourneyRef.current = parsed;
        } else {
            setSelectedJourney(null);
            selectedJourneyRef.current = null;
        }
    };

    const loadDailySteps = async () => {
        const raw = await AsyncStorage.getItem('dailySteps');
        setDailySteps(raw ? JSON.parse(raw) : {});
    };

    useEffect(() => {
        loadJourney();
        loadDailySteps();
    }, []);

    const resetSteps = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, '0');
            setGlobalSteps(0);
            lastSensorReading.current = null;
            fractionalAccumulator.current = 0;
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
                    if (!selectedJourneyRef.current) return;

                    if (lastSensorReading.current === null) {
                        lastSensorReading.current = result.steps;
                        return;
                    }

                    const delta = result.steps - lastSensorReading.current;

                    if (delta > 0) {
                        // Add fractional steps to accumulator
                        fractionalAccumulator.current += delta * STEP_MULTIPLIER;

                        // Only count whole steps
                        const wholeSteps = Math.floor(fractionalAccumulator.current);

                        if (wholeSteps > 0) {
                            fractionalAccumulator.current -= wholeSteps; // keep the remainder

                            setGlobalSteps((prevTotal) => {
                                const newTotal = prevTotal + wholeSteps;
                                AsyncStorage.setItem(STORAGE_KEY, newTotal.toString());
                                saveDailySteps(wholeSteps);
                                return newTotal;
                            });
                        }
                    }

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
        dailyData[today] = (dailyData[today] || 0) + delta;
        
        await AsyncStorage.setItem('dailySteps', JSON.stringify(dailyData));
        setDailySteps({ ...dailyData });
    };

    return (
        <PedometerContext.Provider value={{
            globalSteps,
            isPedometerAvailable,
            selectedJourney,
            dailySteps,
            resetSteps,
            loadJourney,
        }}>
            {children}
        </PedometerContext.Provider>
    );
};

export const usePedometerContext = () => useContext(PedometerContext);