// TODO
// See if loading time of stats page can be improved
// Its a bit laggy

import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter, VictoryLabel } from 'victory-native'
import Card from '../components/card'

const STORAGE_KEY = 'savedStepCount';
const JOURNEY_KEY = 'selectedJourney';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CHART_WIDTH = width - CARD_MARGIN * 2 - 32; // card padding

const Stats = () => {
    const router = useRouter();
    const [steps, setSteps] = useState(0);
    const [journey, setJourney] = useState(null);
    const [dailySteps, setDailySteps] = useState([]);
    const [allTimeSteps, setAllTimeSteps] = useState(0);

    useEffect(() => {
        const load = async () => {
            const savedSteps = await AsyncStorage.getItem(STORAGE_KEY);
            const savedJourney = await AsyncStorage.getItem(JOURNEY_KEY);
            const savedDaily = await AsyncStorage.getItem('dailySteps');

            if (savedSteps) setSteps(parseInt(savedSteps, 10) || 0);
            if (savedJourney) setJourney(JSON.parse(savedJourney));

            const daily = savedDaily ? JSON.parse(savedDaily) : {};

            // Derive all-time total from every day ever recorded
            const allTime = Object.values(daily).length > 0
                ? Math.max(...Object.values(daily))
                : 0;
            setAllTimeSteps(allTime);

            // Build last 7 days
            const last7 = [];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const key = date.toISOString().split('T')[0];
                const label = date.toLocaleDateString('en', { weekday: 'short' });
                last7.push({ day: label, steps: daily[key] || 0, key });
            }
            setDailySteps(last7);
        };
        load();
    }, []);

    const progressFraction = journey ? Math.min(steps / journey.totalSteps, 1) : 0;
    const progressPercent = (progressFraction * 100).toFixed(1);
    const stepsLeft = journey ? Math.max(journey.totalSteps - steps, 0) : 0;

    const kmJourney = (steps * 0.00076).toFixed(2);
    const kmAllTime = (allTimeSteps * 0.00076).toFixed(2);
    const milesAllTime = (allTimeSteps * 0.000473).toFixed(2);
    const calories = Math.round(steps * 0.04);

    const formatSteps = (n) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return n.toLocaleString();
    };

    const chartData = dailySteps.map((d, i) => ({ x: i, y: d.steps }));
    const maxSteps = Math.max(...dailySteps.map(d => d.steps), 1);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Stats</Text>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Journey info */}
                <Card style={styles.infoCard}>
                    {journey ? (
                        <View>
                            <Text style={styles.cardLabel}>Current Journey</Text>
                            <Text style={styles.cardValue}>{journey.title}</Text>
                            <Text style={styles.cardSub}>Destination: {journey.goal}</Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={styles.cardLabel}>No Journey Selected</Text>
                            <Text style={styles.cardSub}>Pick a journey to start tracking progress</Text>
                        </View>
                    )}
                </Card>

                {/* Progress bar */}
                {journey && (
                    <Card style={styles.infoCard}>
                        <Text style={styles.cardLabel}>Journey Progress</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{progressPercent}% complete</Text>
                        <Text style={styles.cardSub}>{formatSteps(steps)} of {formatSteps(journey.totalSteps)} steps</Text>
                        <Text style={styles.cardSub}>{formatSteps(stepsLeft)} steps remaining</Text>
                    </Card>
                )}

                {/* Stats grid */}
                <View style={styles.statsGrid}>
                    <Card style={styles.statBox}>
                        <Text style={styles.statValue}>{formatSteps(allTimeSteps)}</Text>
                        <Text style={styles.statLabel}>All-time Steps</Text>
                    </Card>
                    <Card style={styles.statBox}>
                        <Text style={styles.statValue}>{kmAllTime}</Text>
                        <Text style={styles.statLabel}>All-time km</Text>
                    </Card>
                    <Card style={styles.statBox}>
                        <Text style={styles.statValue}>{kmJourney}</Text>
                        <Text style={styles.statLabel}>Journey km</Text>
                    </Card>
                    <Card style={styles.statBox}>
                        <Text style={styles.statValue}>{calories}</Text>
                        <Text style={styles.statLabel}>Calories</Text>
                    </Card>
                </View>

                {/* 7-day line chart */}
                <Card style={styles.chartCard}>
                    <Text style={styles.cardLabel}>Steps — Last 7 Days</Text>
                    <VictoryChart
                        width={CHART_WIDTH}
                        height={220}
                        padding={{ top: 30, bottom: 40, left: 10, right: 10 }}
                        domain={{ y: [0, maxSteps * 1.2] }}
                    >
                        <VictoryAxis
                            tickValues={dailySteps.map((_, i) => i)}
                            tickFormat={dailySteps.map(d => d.day)}
                            style={{
                                axis: { stroke: '#ccc' },
                                tickLabels: { fontSize: 11, fill: '#888' },
                                grid: { stroke: 'transparent' },
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            style={{ axis: { stroke: 'transparent' }, tickLabels: { fill: 'transparent' } }}
                        />
                        <VictoryLine
                            data={chartData}
                            style={{
                                data: { stroke: '#4a9e6b', strokeWidth: 2.5 },
                            }}
                            interpolation="monotoneX"
                        />
                        <VictoryScatter
                            data={chartData}
                            size={4}
                            style={{ data: { fill: '#4a9e6b' } }}
                            labels={({ datum }) => datum.y > 0 ? formatSteps(datum.y) : ''}
                            labelComponent={
                                <VictoryLabel
                                    dy={-12}
                                    style={{ fontSize: 9, fill: '#555' }}
                                />
                            }
                        />
                    </VictoryChart>
                </Card>

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
        paddingHorizontal: CARD_MARGIN,
        paddingBottom: 120,
        gap: 16,
    },
    infoCard: {
        padding: 18,
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
        padding: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111',
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        fontWeight: '500',
        textAlign: 'center',
    },
    chartCard: {
        padding: 16,
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