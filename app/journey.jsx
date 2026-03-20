import { StyleSheet, Text, View, Pressable, ScrollView, Image, Dimensions, Modal } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { JOURNEYS } from '../data/journeys';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CARD_WIDTH = width - CARD_MARGIN * 2;

const Journey = () => {
    const router = useRouter();
    const [pendingJourney, setPendingJourney] = useState(null);

    // First tap shows popup
    const handleCardPress = (journey) => {
        setPendingJourney(journey);
    };

    const handleConfirm = async () => {
        await AsyncStorage.setItem('selectedJourney', JSON.stringify(pendingJourney));
        setPendingJourney(null);
        router.back();
    };

    const formatSteps = (steps) => {
        if (steps >= 1000000) return `${(steps / 1000000).toFixed(1)}M steps`;
        if (steps >= 1000) return `${Math.round(steps / 1000)}k steps`;
        return `${steps} steps`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Select Your Journey</Text>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {JOURNEYS.map((journey) => (
                    <Pressable
                        key={journey.id}
                        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                        onPress={() => handleCardPress(journey)}
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
                    </Pressable>
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
                                    style={[styles.modalBtn, styles.modalBtnConfirm]}
                                    onPress={handleConfirm}
                                >
                                    <Text style={[styles.modalBtnText, { color: 'white' }]}>Start Journey</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#77d8f5',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 60,
        paddingBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: CARD_MARGIN,
        paddingTop: 10,
        paddingBottom: 100, // space for back button
        gap: 20,
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    cardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    thumbnail: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * (9 / 16), // 16:9 aspect ratio
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        padding: 14,
        color: '#222',
    },
    cardSteps: {
        fontSize: 13,
        fontWeight: '500',
        color: '#888',
        marginLeft: 8,
    },
    backButton: {
        position: 'absolute',
        bottom: 70,
        alignSelf: 'center',
        backgroundColor: '#e9d8ab',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
        elevation: 3,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },

    // ── Modal ──
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
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
        height: 180,
    },
    modalBody: {
        padding: 18,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    modalSteps: {
        fontSize: 14,
        color: '#888',
        marginBottom: 12,
        fontWeight: '500',
    },
    modalDescription: {
        fontSize: 15,
        color: '#444',
        lineHeight: 23,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalBtnCancel: {
        backgroundColor: '#f0f0f0',
    },
    modalBtnConfirm: {
        backgroundColor: '#4a9e6b',
    },
    modalBtnText: {
        fontSize: 15,
        fontWeight: '600',
    },
});