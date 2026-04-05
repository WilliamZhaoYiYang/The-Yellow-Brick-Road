// TODO
// add text next to title of modal pop up displaying the number of steps it took to reach this landmark
// add notification when a landmark is reached
// add a next destination showing how many steps left to next landmark
// see if image loading in general can be improved, still take a bit to load when user reaches a new landmark

import { StyleSheet, Text, View, Pressable, ScrollView, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { VictoryLine, VictoryChart, VictoryAxis, VictoryScatter, VictoryLabel } from 'victory-native'
import Card from '../components/card'
import { usePedometerContext } from '../context/PedometerContext'

const { width } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CHART_WIDTH = width - CARD_MARGIN * 2 - 32;

const Stats = () => {
    const router = useRouter();
    const { globalSteps, selectedJourney: journey, dailySteps: rawDaily, stepMultiplier, updateStepMultiplier } = usePedometerContext();

    const steps = globalSteps;

    const progressFraction = journey ? Math.min(steps / journey.totalSteps, 1) : 0;
    const progressPercent = (progressFraction * 100).toFixed(1);
    const stepsLeft = journey ? Math.max(journey.totalSteps - steps, 0) : 0;

    const kmJourney = (steps * 0.00076).toFixed(2);
    const calories = Math.round(steps * 0.04);

    // All-time = highest value recorded across all days
    const allTimeSteps = Object.values(rawDaily).length > 0
        ? Object.values(rawDaily).reduce((sum, val) => sum + val, 0)
        : 0;
    const kmAllTime = (allTimeSteps * 0.00076).toFixed(2);

    // Build last 7 days from context data
    const last7 = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const key = date.toISOString().split('T')[0];
        const label = date.toLocaleDateString('en', { weekday: 'short' });
        return { day: label, steps: rawDaily[key] || 0 };
    });

    const formatSteps = (n) => {
        if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return n.toLocaleString();
    };

    const chartData = last7.map((d, i) => ({ x: i, y: d.steps }));
    const maxSteps = Math.max(...last7.map(d => d.steps), 1);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Stats</Text>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

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
                        <Text style={styles.statLabel}>Calories This Journey</Text>
                    </Card>
                </View>

                <Card style={styles.chartCard}>
                    <Text style={styles.cardLabel}>Total Steps — Last 7 Days</Text>
                    <VictoryChart
                        width={CHART_WIDTH}
                        height={220}
                        padding={{ top: 30, bottom: 40, left: 10, right: 10 }}
                        domain={{ y: [0, maxSteps * 1.2] }}
                    >
                        <VictoryAxis
                            tickValues={last7.map((_, i) => i)}
                            tickFormat={last7.map(d => d.day)}
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
                            style={{ data: { stroke: '#4a9e6b', strokeWidth: 2.5 } }}
                            interpolation="monotoneX"
                        />
                        <VictoryScatter
                            data={chartData}
                            size={4}
                            style={{ data: { fill: '#4a9e6b' } }}
                            labels={({ datum }) => datum.y > 0 ? formatSteps(datum.y) : ''}
                            labelComponent={
                                <VictoryLabel dy={-12} style={{ fontSize: 9, fill: '#555' }} />
                            }
                        />
                    </VictoryChart>
                </Card>

                {/* Sensitivity setting */}
                <Card style={styles.infoCard}>
                    <Text style={styles.cardLabel}>Step Sensitivity</Text>
                    <Text style={styles.cardSub}>
                        {Math.round(stepMultiplier * 100)}% of detected steps are counted. Adjust if your step count feels too high or too low.
                    </Text>
                    <View style={styles.sensitivityRow}>
                        {[0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
                            <Pressable
                                key={val}
                                style={[
                                    styles.sensitivityBtn,
                                    stepMultiplier === val && styles.sensitivityBtnActive,
                                ]}
                                onPress={() => updateStepMultiplier(val)}
                            >
                                <Text style={[
                                    styles.sensitivityBtnText,
                                    stepMultiplier === val && styles.sensitivityBtnTextActive,
                                ]}>
                                    {Math.round(val * 100)}%
                                </Text>
                            </Pressable>
                        ))}
                    </View>
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
        textAlign: 'center',
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

    sensitivityRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 14,
    },
    sensitivityBtn: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    sensitivityBtnActive: {
        backgroundColor: '#4a9e6b',
    },
    sensitivityBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
    },
    sensitivityBtnTextActive: {
        color: 'white',
    },
});