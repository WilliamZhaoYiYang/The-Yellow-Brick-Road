import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CARD_WIDTH = width - CARD_MARGIN * 2;

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
        paddingBottom: 100,
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
        height: CARD_WIDTH * (9 / 16),
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
        color: '#222',
        flex: 1,
    },
    cardSteps: {
        fontSize: 13,
        fontWeight: '500',
        color: '#888',
        marginLeft: 8,
    },
    activeBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#4a9e6b',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    activeBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
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
    warningBanner: {
        backgroundColor: '#fff3cd',
        borderLeftWidth: 4,
        borderLeftColor: '#f0a500',
        borderRadius: 8,
        padding: 12,
        marginBottom: 14,
    },
    warningText: {
        fontSize: 13,
        color: '#7a5000',
        lineHeight: 20,
    },
    warningBold: {
        fontWeight: '700',
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
    modalBtnWarning: {
        backgroundColor: '#e05c2a',
    },
    modalBtnText: {
        fontSize: 15,
        fontWeight: '600',
    },
});

export default styles;