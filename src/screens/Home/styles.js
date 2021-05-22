import { StyleSheet , Dimensions} from "react-native";

const styles = StyleSheet.create({
        image: {
            width: '100%',
            height: 400,
            resizeMode: 'cover',
            justifyContent: 'center',
            
        },

    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 25,
        top: 10,
        
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