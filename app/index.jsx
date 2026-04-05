import { StyleSheet, Pressable, Text, View, Alert, Animated, FlatList, Modal, Dimensions, Image } from 'react-native'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router, useFocusEffect } from 'expo-router';
import styles from './styles/index.styles';
import Card from '../components/card';
import { usePedometerContext } from '../context/PedometerContext';

const JOURNEY_KEY = 'selectedJourney';
const { width } = Dimensions.get('window');

const BANNER_HEIGHT = 200;

const DOT_SIZE = 8;
const DOT_GAP = 6;
const DOT_ACTIVE_WIDTH = 20;
const MAX_DOTS = 8;

const BannerCarousel = ({ items }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const flatListRef = useRef(null);

    if (!items || items.length === 0) return null;

    const totalItems = items.length;

    const getWindowStart = (progress) => {
        if (totalItems <= MAX_DOTS) return 0;
        // Only start shifting window once scroll goes past the last visible dot
        return Math.max(0, Math.min(
            Math.floor(Math.max(0, progress - (MAX_DOTS - 1))),
            totalItems - MAX_DOTS
        ));
    };

    const windowStart = getWindowStart(scrollProgress);

    const handleScroll = (e) => {
        const x = e.nativeEvent.contentOffset.x;
        const progress = x / width;
        setScrollProgress(progress);
    };

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
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / width);
                        setActiveIndex(index);
                    }}
                    renderItem={({ item }) => (
                        <Card
                            style={styles.bannerCard}
                            onPress={() => setSelectedItem(item)}
                        >
                            <Image
                                source={
                                    typeof item.image === 'string'
                                    ? { uri: item.image }
                                    : item.image
                                }
                                style={styles.bannerImage}
                                resizeMode="cover"
                            />
                            <View style={styles.bannerTitleOverlay}>
                                <Text style={styles.bannerTitle}>{item.title}</Text>
                            </View>
                        </Card>
                    )}
                />

                {/* Dots */}
                <View style={styles.dotsRow}>
                    {Array.from({ length: Math.min(totalItems, MAX_DOTS) }, (_, dotPos) => {
                        const itemIndex = windowStart + dotPos;

                        const distance = Math.abs(scrollProgress - itemIndex);
                        const activity = Math.max(0, 1 - distance);

                        const dotWidth = DOT_SIZE + (DOT_ACTIVE_WIDTH - DOT_SIZE) * activity;
                        const opacity = 0.25 + 0.75 * activity;

                        return (
                            <View
                                key={itemIndex}
                                style={[styles.dot, { width: dotWidth, opacity }]}
                            />
                        );
                    })}
                </View>
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
                            source={
                                typeof selectedItem?.image === 'number'
                                    ? selectedItem.image
                                    : { uri: selectedItem?.image }
                            }
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
    const { globalSteps } = usePedometerContext();

    const [selectedJourney, setSelectedJourney] = useState(null);
    const selectedJourneyRef = useRef(null);

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

    // Load selected journey when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            const loadJourney = async () => {
                const saved = await AsyncStorage.getItem(JOURNEY_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setSelectedJourney(parsed);
                    selectedJourneyRef.current = parsed;
                }
            };
            loadJourney();
        }, [])
    );

    // Sync UI display value with the animation progress
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
        if (globalSteps === 0) {
            animatedSteps.setValue(0); 
            setDisplayValue(0);
        } else {
            animateToValue(globalSteps);
        }
    }, [globalSteps]);

    // Update steps left for the journey
    useEffect(() => {
        if (selectedJourney) {
            setStepsLeft(Math.max(0, selectedJourney.totalSteps - displayValue));
        }
    }, [displayValue, selectedJourney]);

    const unlockedBannerItems = selectedJourney
        ? selectedJourney.bannerItems.filter(item => displayValue >= item.unlockedAfterSteps)
        : [];
    const journeyComplete = selectedJourney && displayValue >= selectedJourney.totalSteps;

    return (
        <View style={styles.container}>
            {/* Banner at top */}
            <View style={styles.bannerArea}>
                <BannerCarousel items={unlockedBannerItems} />
            </View>

            {/* Main content */}
            <View style={styles.mainContent}>
                {journeyComplete ? (
                    <>
                        <Text style={styles.title}>🎉</Text>
                        <Text style={styles.info}>You completed{'\n'}{selectedJourney.title}!</Text>
                        <Text style={styles.instruction}>
                            You walked {displayValue.toLocaleString()} steps to reach {selectedJourney.goal}
                        </Text>
                    </>
                ) : (
                    <>
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
                    </>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={() => router.push('/stats')}>
                    <Text style={styles.buttonText}>Show Stats</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => router.push('/journey')}>
                    <Text style={styles.buttonText}>Select Journey</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Home;