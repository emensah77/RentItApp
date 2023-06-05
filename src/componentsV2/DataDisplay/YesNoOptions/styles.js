import {StyleSheet} from 'react-native';

import {offsets} from '../../styles/globalStyles';

export const styles = StyleSheet.create({
    optionsBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionBtn: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        backgroundColor: '#0047B3',
        borderRadius: 8,
        marginHorizontal: 20
    },
    optionBtnText: {
        fontSize: 16,
        lineHeight: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        margin: 0,
        padding: 0,
    },
});
