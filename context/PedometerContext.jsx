import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

// How notifications appear when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const PedometerContext = createContext();

const STORAGE_KEY = 'savedStepCount';
const JOURNEY_KEY = 'selectedJourney';

export const PedometerProvider = ({ children }) => {
    const [globalSteps, setGlobalSteps] = useState(0);
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [selectedJourney, setSelectedJourney] = useState(null);
    const [dailySteps, setDailySteps] = useState({}); 
    const [stepMultiplier, setStepMultiplier] = useState(0.6);

    const stepMultiplierRef = useRef(0.6);
    const lastSensorReading = useRef(null);
    const fractionalAccumulator = useRef(0);
    const selectedJourneyRef = useRef(null);
    const notifiedLandmarksRef = useRef(new Set()); 

    useEffect(() => {
        const requestNotificationPermission = async () => {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Notification permission not granted');
            }
        };
        requestNotificationPermission();
    }, []);

    const sendLandmarkNotification = async (landmark) => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: `🏁 Landmark Reached!`,
                body: `You've unlocked "${landmark.title}" at ${landmark.unlockedAfterSteps.toLocaleString()} steps!`,
                sound: true,
            },
            trigger: null, // send immediately
        });
    };
    
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
        AsyncStorage.getItem('stepMultiplier').then(saved => {
            if (saved !== null) {
                const val = parseFloat(saved);
                setStepMultiplier(val);
                stepMultiplierRef.current = val;
            }
        });
        // TEMP to manually add steps

        // setTimeout(async () => {
        //     const bonusSteps = 1000000;

        //     const saved = await AsyncStorage.getItem(STORAGE_KEY);
        //     const base = saved ? parseInt(saved, 10) : 0;

        //     const newTotal = base + bonusSteps;

        //     setGlobalSteps(newTotal);
        //     checkLandmarkNotifications(newTotal);
        //     await AsyncStorage.setItem(STORAGE_KEY, newTotal.toString());
        //     saveDailySteps(bonusSteps);
        // }, 300);
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

    const updateStepMultiplier = async (value) => {
        setStepMultiplier(value);
        stepMultiplierRef.current = value;
        await AsyncStorage.setItem('stepMultiplier', value.toString());
    };

    const checkLandmarkNotifications = (totalSteps) => {
        const journey = selectedJourneyRef.current;
        if (!journey) return;

        // Landmark notifications
        journey.bannerItems.forEach(landmark => {
            if (
                totalSteps >= landmark.unlockedAfterSteps &&
                !notifiedLandmarksRef.current.has(landmark.id)
            ) {
                notifiedLandmarksRef.current.add(landmark.id);
                sendLandmarkNotification(landmark);
            }
        });

        // Journey complete notification
        if (
            totalSteps >= journey.totalSteps &&
            !notifiedLandmarksRef.current.has('journey-complete')
        ) {
            notifiedLandmarksRef.current.add('journey-complete');

            Notifications.scheduleNotificationAsync({
                content: {
                    title: '🎉 Journey Complete!',
                    body: `You reached ${journey.goal} after ${journey.totalSteps.toLocaleString()} steps!`,
                    sound: true,
                },
                trigger: null,
            });
        }
    };

    useEffect(() => {
        let subscription = null;

        const setupPedometer = async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved !== null) {
                    const loadedSteps = parseInt(saved, 10);
                    setGlobalSteps(loadedSteps);

                    // Mark already reached landmarks so we don't re-notify for landmarks already passed
                    AsyncStorage.getItem(JOURNEY_KEY).then(j => {
                        if (j) {
                            const journey = JSON.parse(j);
                            const alreadyNotified = new Set(
                                journey.bannerItems
                                    .filter(l => loadedSteps >= l.unlockedAfterSteps)
                                    .map(l => l.id)
                            );
                            notifiedLandmarksRef.current = alreadyNotified;
                        }
                    });
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
                        fractionalAccumulator.current += delta * stepMultiplierRef.current;
                        const wholeSteps = Math.floor(fractionalAccumulator.current);

                        if (wholeSteps > 0) {
                            fractionalAccumulator.current -= wholeSteps; // keep the remainder

                            setGlobalSteps((prevTotal) => {
                                const newTotal = prevTotal + wholeSteps;
                                AsyncStorage.setItem(STORAGE_KEY, newTotal.toString());
                                saveDailySteps(wholeSteps);
                                checkLandmarkNotifications(newTotal);
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
            stepMultiplier,
            updateStepMultiplier,            
        }}>
            {children}
        </PedometerContext.Provider>
    );
};

export const usePedometerContext = () => useContext(PedometerContext);