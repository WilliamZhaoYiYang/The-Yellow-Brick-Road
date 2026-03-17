import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useRouter } from 'expo-router'

const Journey = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Your Journey</Text>

            {/* Your journey options will go here */}
            <Text style={styles.subtitle}>Choose a path to follow</Text>

            <Pressable style={styles.button} onPress={() => router.back()}>
                <Text style={styles.buttonText}>Go Back</Text>
            </Pressable>
        </View>
    )
}

export default Journey

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#77d8f5',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 40,
    },
    button: {
        position: 'absolute',
        bottom: 70,
        backgroundColor: '#e9d8ab',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    }
})