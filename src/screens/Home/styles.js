import { StyleSheet , Dimensions} from "react-native";

const styles = StyleSheet.create({
        image: {
            width: '100%',
            height: 400,
            resizeMode: 'cover',
            justifyContent: 'center',
            
        },

        image1: {
            width: '100%',
            height: 400,
            resizeMode: 'cover',
            justifyContent: 'center',
            borderRadius: 5,
            
        },

    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'blue',
        marginLeft: 25,
        top: 10,
        
    },

    

    imageLocationIcon: {
        position: 'absolute',
        marginTop: 4, 
        left: 5,
        bottom: 10,
        
           
    },
    ImageText: {
        position: 'absolute',
        color: 'white',
        marginTop: 4,
        fontSize: 18,
        fontWeight: 'bold',
        left: 35,
        bottom: 15
    },

    ImageOverlay: {
        width: 250,
        height: 250,
        marginRight: 8,
        borderRadius: 10,
        position: 'absolute',
        backgroundColor: '#000',
        opacity: .5

    },

    ImageOverlay1: {
        width: '100%',
        height: 250,
        alignSelf:"center",
        borderRadius: 20,
        position: 'absolute',
        backgroundColor: '#000',
        opacity: 1,
    },

    button: {
        backgroundColor: '#fff',
        width: 200,
        marginLeft: 25,
        marginTop: 25,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }, 

    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',

    },
    searchButton: {
        backgroundColor: '#fff',
        width: Dimensions.get('screen').width -20,
        marginHorizontal: 10,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        display: "flex",
        flexDirection: "row",
        position: "absolute",
        top: 20,
        zIndex:1,
    }, 

    searchButtonText: {
        fontSize: 16,
        fontWeight: 'bold',

    }
});
export default styles;