import { StyleSheet, Text, View, Pressable, ScrollView, Image, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window');
const CARD_MARGIN = 20;
const CARD_WIDTH = width - CARD_MARGIN * 2;


export const JOURNEYS = [
    {
        id: '1',
        title: 'The Yellow Brick Road',
        image: 'https://picsum.photos/seed/yellowbrick/800/450',
        totalSteps: 250000,
        goal: 'The Emerald City',
    },
    {
        id: '2',
        title: 'The Shire to Mordor',
        image: 'https://picsum.photos/seed/mordor/800/450',
        totalSteps: 4000000,
    },
    {
        id: '3',
        title: 'Route 66',
        image: 'https://picsum.photos/seed/route66/800/450',
        totalSteps: 1400000,
    },
    {
        id: '4',
        title: 'The Camino de Santiago',
        image: 'https://picsum.photos/seed/camino/800/450',
        totalSteps: 900000,
    },
    {
        id: '5',
        title: 'The Appalachian Trail',
        image: 'https://picsum.photos/seed/appalachian/800/450',
        totalSteps: 5000000,
    },
];

const Journey = () => {
    const router = useRouter();

    const handleSelect = async (journey) => {
        await AsyncStorage.setItem('selectedJourney', JSON.stringify(journey));
        router.back();
    }

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
                        style={styles.card}
                        onPress={() => handleSelect(journey)}
                    >
                        <Image
                            source={{ uri: journey.image }}
                            style={styles.thumbnail}
                            resizeMode="cover"
                        />
                        <Text style={styles.cardTitle}>{journey.title}</Text>
                    </Pressable>
                ))}
            </ScrollView>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>
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
    thumbnail: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * (9 / 16), // 16:9 aspect ratio
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        padding: 14,
        color: '#222',
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
    }
})