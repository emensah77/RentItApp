import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        height: 120,
        padding: 5, 
        
    },

    innerContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        overflow: 'hidden',
        borderRadius: 10,
    },
    image: {
        height : '100%',
        aspectRatio: 1,
        resizeMode: 'cover',
        


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

    }
});

export default styles;