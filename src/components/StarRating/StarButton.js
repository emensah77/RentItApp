import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import FoundationIcons from 'react-native-vector-icons/Foundation';
import IoniconsIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIconsIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIconsIcons from 'react-native-vector-icons/MaterialIcons';
import OcticonsIcons from 'react-native-vector-icons/Octicons';
import SimpleLineIconsIcons from 'react-native-vector-icons/SimpleLineIcons';
import ZocialIcons from 'react-native-vector-icons/Zocial';

const iconSets = {
  Entypo: EntypoIcons,
  EvilIcons: EvilIconsIcons,
  Feather: FeatherIcons,
  FontAwesome: FontAwesomeIcons,
  Foundation: FoundationIcons,
  Ionicons: IoniconsIcons,
  MaterialIcons: MaterialIconsIcons,
  MaterialCommunityIcons: MaterialCommunityIconsIcons,
  Octicons: OcticonsIcons,
  Zocial: ZocialIcons,
  SimpleLineIcons: SimpleLineIconsIcons,
};

const defaultProps = {
  buttonStyle: {},
  icoMoonJson: undefined,
  starStyle: {},
};

function StarButton(props) {
  const {
    halfStarEnabled,
    starSize,
    rating,
    onStarButtonPress,
    icoMoonJson,
    iconSet,
    reversed,
    starColor,
    starIconName,
    starStyle,
    activeOpacity,
    buttonStyle,
    disabled,
  } = props;

  const onButtonPress = event => {
    let addition = 0;

    if (halfStarEnabled) {
      const isHalfSelected = event.nativeEvent.locationX < starSize / 2;
      addition = isHalfSelected ? -0.5 : 0;
    }

    onStarButtonPress(rating + addition);
  };

  const iconSetFromProps = () => {
    if (icoMoonJson) {
      return createIconSetFromIcoMoon(icoMoonJson);
    }

    return iconSets[iconSet];
  };

  const renderIcon = () => {
    const Icon = iconSetFromProps();
    let iconElement;

    const newStarStyle = {
      transform: [
        {
          scaleX: reversed ? -1 : 1,
        },
      ],
      ...StyleSheet.flatten(starStyle),
    };

    if (typeof starIconName === 'string') {
      iconElement = (
        <Icon name={starIconName} size={starSize} color={starColor} style={newStarStyle} />
      );
    }

    return iconElement;
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={disabled}
      style={buttonStyle}
      onPress={disabled ? () => {} : onButtonPress}>
      {renderIcon()}
    </TouchableOpacity>
  );
}

StarButton.defaultProps = defaultProps;

export default StarButton;
