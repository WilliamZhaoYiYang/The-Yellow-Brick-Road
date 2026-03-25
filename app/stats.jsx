import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'savedStepCount';
const JOURNEY_KEY = 'selectedJourney';

const Stats = () => {
    const router = useRouter();
    const [steps, setSteps] = useState(0);
    const [journey, setJourney] = useState(null);

    useEffect(() => {
        const load = async () => {
            const savedSteps = await AsyncStorage.getItem(STORAGE_KEY);
            const savedJourney = await AsyncStorage.getItem(JOURNEY_KEY);
            if (savedSteps) setSteps(parseInt(savedSteps, 10));
            if (savedJourney) setJourney(JSON.parse(savedJourney));
        };
        load();
    }, []);

    const progressFraction = journey ? Math.min(steps / journey.totalSteps, 1) : 0;
    const progressPercent = (progressFraction * 100).toFixed(1);
    const stepsLeft = journey ? Math.max(journey.totalSteps - steps, 0) : 0;

    // Rough conversions
    const km = (steps * 0.00076).toFixed(2);
    const miles = (steps * 0.000473).toFixed(2);
    const calories = Math.round(steps * 0.04);

    const formatSteps = (n) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return n.toLocaleString();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Stats</Text>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Journey info */}
                {journey ? (
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Current Journey</Text>
                        <Text style={styles.cardValue}>{journey.title}</Text>
                        <Text style={styles.cardSub}>Destination: {journey.goal}</Text>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>No Journey Selected</Text>
                        <Text style={styles.cardSub}>Pick a journey to start tracking progress</Text>
                    </View>
                )}

                {/* Progress bar */}
                {journey && (
                    <View style={styles.card}>
                        <Text style={styles.cardLabel}>Journey Progress</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{progressPercent}% complete</Text>
                        <Text style={styles.cardSub}>
                            {formatSteps(steps)} of {formatSteps(journey.totalSteps)} steps
                        </Text>
                        <Text style={styles.cardSub}>
                            {formatSteps(stepsLeft)} steps remaining
                        </Text>
                    </View>
                )}

                {/* Step stats */}
                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{formatSteps(steps)}</Text>
                        <Text style={styles.statLabel}>Total Steps</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{km}</Text>
                        <Text style={styles.statLabel}>Kilometres</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{miles}</Text>
                        <Text style={styles.statLabel}>Miles</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{calories}</Text>
                        <Text style={styles.statLabel}>Calories</Text>
                    </View>
                </View>

            </ScrollView>

            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
        </View>
    );
};

export default Stats;

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
    content: {
        paddingHorizontal: 20,
        paddingBottom: 120,
        gap: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 18,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#999',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    cardValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    cardSub: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    progressBar: {
        height: 12,
        backgroundColor: '#eee',
        borderRadius: 6,
        marginTop: 10,
        marginBottom: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4a9e6b',
        borderRadius: 6,
    },
    progressText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4a9e6b',
        marginBottom: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statBox: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111',
    },
    statLabel: {
        fontSize: 13,
        color: '#888',
        marginTop: 4,
        fontWeight: '500',
    },
    backButton: {
        position: 'absolute',
        bottom: 40,
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
});