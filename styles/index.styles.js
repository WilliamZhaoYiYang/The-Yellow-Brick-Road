import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window');

const BANNER_HEIGHT = 200;
const DOT_SIZE = 8;
const DOT_GAP = 6;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#77d8f5',
    },

    // Banner
    bannerArea: {
        paddingTop: 55,
    },
    bannerWrapper: {
        width: '100%',
    },
    bannerCard: {
        width: width - 32, // account for the gap
        marginHorizontal: 16, // shadow now visible on both sides
    },
    bannerImage: {
        width: '100%',
        height: BANNER_HEIGHT,
        borderRadius: 14,
    },
    bannerTitleOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
    },
    bannerTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 6,
        color: 'white',
    },

    // Modal
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
        textAlign: 'center',
    },
    modalSteps: {
        fontSize: 13,
        color: '#888',
        fontWeight: '500',
        marginHorizontal: 16,
        marginBottom: 8,
    },
    modalDetail: {
        fontSize: 15,
        color: '#555',
        marginHorizontal: 16,
        lineHeight: 22,
        textAlign: 'center',
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

    // Main content
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
    nextLandmark: {
        fontSize: 14,
        color: '#555',
        marginTop: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    // Buttons
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

    // Carousel
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        gap: DOT_GAP,
        height: 12,
    },
    dot: {
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: '#222',
    },
    dotActive: {
        backgroundColor: '#222',
        width: 18,
    },
})

export default styles;