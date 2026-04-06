import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CHART_WIDTH = width - CARD_MARGIN * 2 - 32;

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

export default styles;