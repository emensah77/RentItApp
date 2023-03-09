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
        color: 'black',
        fontWeight: '600',
        fontSize:14
    },
    description: {
        fontSize: 18,
        lineHeight: 26,
        fontFamily:'Montserrat-Bold'

    },
    
    hairline:{
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        marginTop: 10,
        marginBottom: 10
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
    },
    sliderContainer: {
        height: 200,
        width: '90%',
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
      },
    
      wrapper: {},
    
      slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
      },
      sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
      },
      amenitiesContainer: {
        marginVertical: 20,
      },
      amenityCard: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#e5e5e5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
      },
      amenityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
      },
      
});

export default styles;