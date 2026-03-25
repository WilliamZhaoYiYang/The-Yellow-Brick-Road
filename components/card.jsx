import { StyleSheet, Pressable, View } from 'react-native'

const Card = ({ onPress, children, style }) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
                style,
            ]}
            onPress={onPress}
        >
            <View>
                {children}
            </View>
        </Pressable>
    );
};

export default Card;

const styles = StyleSheet.create({
    card: {
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
});