import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Dimensions} from 'react-native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {faFacebook} from '@fortawesome/free-brands-svg-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SocialButton = ({buttonTitle, btnType, color, backgroundColor, ...rest}) => {
  const bgColor = backgroundColor;
  return (
    <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: bgColor}]} {...rest}>
      <View style={styles.iconWrapper}>
        <FontAwesomeIcon icon={btnType} style={styles.icon} size={22} color={color} />
      </View>
      <View style={styles.btnTxtWrapper}>
        <Text style={[styles.buttonText, {color}]}>{buttonTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    height: windowHeight / 15,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 15,
    borderColor: 'black',
    borderWidth: 0.5,
  },
  iconWrapper: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  btnTxtWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
});
