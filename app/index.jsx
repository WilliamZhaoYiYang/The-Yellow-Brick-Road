import { StyleSheet, Pressable, Text, View, Alert, Animated, FlatList, Modal, Dimensions, Image } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Pedometer } from 'expo-sensors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useFocusEffect } from 'expo-router';

const STORAGE_KEY = 'savedStepCount';
const JOURNEY_KEY = 'selectedJourney';
const { width } = Dimensions.get('window');

const BANNER_HEIGHT = 200;

const BannerCarousel = ({ items }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
    }
    }).current;     

    if (!items || items.length === 0) return null;

    return (
        <>
            <View style={styles.bannerWrapper}>
                <FlatList
                    ref={flatListRef}
                    data={items}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.bannerCard}
                            onPress={() => setSelectedItem(item)}
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={styles.bannerImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.bannerTitle}>{item.title}</Text>
                        </Pressable>
                    )}
                />
                {items.length > 1 && (
                    <View style={styles.dotsRow}>
                        {items.map((_, i) => (
                            <View
                                key={i}
                                style={[styles.dot, i === activeIndex && styles.dotActive]}
                            />
                        ))}
                    </View>
                )}
            </View>

            {/* Popup Modal */}
            <Modal
                visible={!!selectedItem}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedItem(null)}
            >
                <Pressable style={styles.modalBackdrop} onPress={() => setSelectedItem(null)}>
                    <Pressable style={styles.modalCard} onPress={() => {}}>
                        <Image
                            source={{ uri: selectedItem?.image }}
                            style={styles.modalImage}
                            resizeMode="cover"
                        />
                        <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
                        <Text style={styles.modalDetail}>{selectedItem?.detail}</Text>
                        <Pressable style={styles.modalClose} onPress={() => setSelectedItem(null)}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
};

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

    const unlockedBannerItems = selectedJourney
        ? selectedJourney.bannerItems.filter(item => displayValue >= item.unlockedAfterSteps)
        : [];

    return (
        <View style={styles.container}>
            {/* Banner at top */}
        <View style={styles.bannerArea}>
            <BannerCarousel items={unlockedBannerItems} />
        </View>

            {/* Main content */}
            <View style={styles.mainContent}>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    {selectedJourney ? displayValue.toLocaleString() : '🧭'}
                </Text>
                <Text style={styles.info}>
                    {selectedJourney ? 'Steps Into Your Journey' : 'Please pick a journey before starting!'}
                </Text>
                <Text style={styles.instruction}>
                    {selectedJourney
                        ? `${stepsLeft.toLocaleString()} steps to ${selectedJourney.goal}`
                        : 'Walk around with your phone to count steps'}
                </Text>
            </View>

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
        backgroundColor: '#77d8f5',
    },

    // ── Banner ──
    bannerArea: {
        paddingTop: 55,
    },
    bannerWrapper: {
        width: '100%',
    },
    bannerCard: {
        width: width,
        paddingHorizontal: 16,
    },
    bannerImage: {
        width: '100%',
        height: BANNER_HEIGHT - 36,
        borderRadius: 14,
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 6,
        color: '#222',
    },

    // ── Modal ──
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        width: '100%',
    },
    modalImage: {
        width: '100%',
        height: 200,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        margin: 16,
        marginBottom: 8,
    },
    modalDetail: {
        fontSize: 15,
        color: '#555',
        marginHorizontal: 16,
        lineHeight: 22,
    },
    modalClose: {
        margin: 16,
        backgroundColor: '#e9d8ab',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCloseText: {
        fontWeight: '600',
        fontSize: 15,
    },

    // ── Main content ──
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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

    // ── Buttons ──
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 50,
        gap: 30,
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
    },
})