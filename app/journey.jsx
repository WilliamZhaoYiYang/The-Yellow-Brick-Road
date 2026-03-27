import { StyleSheet, Text, View, Pressable, ScrollView, Image, Dimensions, Modal } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { JOURNEYS } from '../data/journeys';
import styles from './styles/journey.styles';
import Card from '../components/card';
import { usePedometerContext } from '../context/PedometerContext';

const STORAGE_KEY = 'savedStepCount';
const JOURNEY_KEY = 'selectedJourney';

const Journey = () => {
    const router = useRouter();
    const [pendingJourney, setPendingJourney] = useState(null);
    const [currentJourney, setCurrentJourney] = useState(null);
    const [currentSteps, setCurrentSteps] = useState(0);
    const { resetSteps } = usePedometerContext();

    // Load existing journey and steps on mount
    useEffect(() => {
        const loadCurrent = async () => {
            const savedJourney = await AsyncStorage.getItem(JOURNEY_KEY);
            const savedSteps = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedJourney) setCurrentJourney(JSON.parse(savedJourney));
            if (savedSteps) setCurrentSteps(parseInt(savedSteps, 10));
        };
        loadCurrent();
    }, []);

    const handleCardPress = (journey) => {
        setPendingJourney(journey);
    };

    const handleConfirm = async () => {
        if (currentJourney && currentJourney.id !== pendingJourney.id) {
            await resetSteps(); // clears Storage + Context state
        }
        
        await AsyncStorage.setItem('selectedJourney', JSON.stringify(pendingJourney));
        setPendingJourney(null);
        router.back();
    };

    const formatSteps = (steps) => {
        if (steps >= 1000000) return `${(steps / 1000000).toFixed(1)}M steps`;
        if (steps >= 1000) return `${Math.round(steps / 1000)}k steps`;
        return `${steps} steps`;
    };

    // Check if a journey has already been selected
    const isSwitching = currentJourney
        && currentJourney.id !== pendingJourney?.id
        && currentSteps > 0;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Your Journey</Text>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
            {JOURNEYS.map((journey) => (
                <Card
                    key={journey.id}
                    onPress={() => handleCardPress(journey)}
                    style={styles.journeyCard}
                >
                    <Image
                        source={{ uri: journey.image }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                    <View style={styles.cardFooter}>
                        <Text style={styles.cardTitle}>{journey.title}</Text>
                        <Text style={styles.cardSteps}>{formatSteps(journey.totalSteps)}</Text>
                    </View>
                    {currentJourney?.id === journey.id && (
                        <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>Current</Text>
                        </View>
                    )}
                </Card>
            ))}
            </ScrollView>

            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>

            {/* Confirmation Modal */}
            <Modal
                visible={!!pendingJourney}
                transparent
                animationType="fade"
                onRequestClose={() => setPendingJourney(null)}
            >
                <Pressable style={styles.modalBackdrop} onPress={() => setPendingJourney(null)}>
                    <Pressable style={styles.modalCard} onPress={() => {}}>
                        <Image
                            source={{ uri: pendingJourney?.image }}
                            style={styles.modalImage}
                            resizeMode="cover"
                        />
                        <View style={styles.modalBody}>

                            {/* Warning banner if switching journeys */}
                            {isSwitching && (
                                <View style={styles.warningBanner}>
                                    <Text style={styles.warningText}>
                                        ⚠️ You're currently on{' '}
                                        <Text style={styles.warningBold}>{currentJourney.title}</Text>
                                        {' '}with {currentSteps.toLocaleString()} steps. Starting a new journey will reset your progress to 0.
                                    </Text>
                                </View>
                            )}

                            <Text style={styles.modalTitle}>{pendingJourney?.title}</Text>
                            <Text style={styles.modalSteps}>
                                🥾 {pendingJourney ? formatSteps(pendingJourney.totalSteps) : ''} to {pendingJourney?.goal}
                            </Text>
                            <Text style={styles.modalDescription}>{pendingJourney?.description}</Text>
                            <View style={styles.modalButtons}>
                                <Pressable
                                    style={[styles.modalBtn, styles.modalBtnCancel]}
                                    onPress={() => setPendingJourney(null)}
                                >
                                    <Text style={styles.modalBtnText}>Cancel</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.modalBtn, isSwitching ? styles.modalBtnWarning : styles.modalBtnConfirm]}
                                    onPress={handleConfirm}
                                >
                                    <Text style={[styles.modalBtnText, { color: 'white' }]}>
                                        {isSwitching ? 'Reset & Start' : 'Start Journey'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>            
        </View>
    )
}

export default Journey


