import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    image: {
        width : '100%',
        aspectRatio: 3 /2,
        resizeMode: 'cover',
        borderRadius: 10, 


    },
    bedrooms: {
        marginVertical: 10,
        color: 'darkgray',
    },
    description: {
        fontSize: 18,
        lineHeight: 26,

    },
    prices: {
        fontSize: 18,
        marginVertical: 10,
    },
    oldPrice: {
        color: 'darkgray',
        textDecorationLine: 'line-through',
        
    },
    newPrice: {
        fontWeight: 'bold',
    },
    totalPrice: {
        color: 'darkgray',
        textDecorationLine: 'underline',

    },
    longDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginVertical: 20,
    }
});

export default styles;