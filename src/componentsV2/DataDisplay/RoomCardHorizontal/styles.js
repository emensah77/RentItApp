import {StyleSheet} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    content: {
        flexDirection: 'row', 
        alignItems: 'flex-start',
    },
    image: {
        width: wp(30),
        marginRight: wp(5)
    },
    textBox: {
        width: wp(50)
    },
    title: {
        fontSize: 16,
        lineHeight: 22,
        color: '#252525',
        marginBottom: 5
    },
    infoDateText: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 14,
        color: '#717171',
        marginBottom: 3
    },
    infoText: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 14,
        color: '#717171'
    }
});


