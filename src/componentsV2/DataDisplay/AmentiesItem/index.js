import React from 'react';
import {View, Image} from 'react-native-animatable';
import Typography from '../../../componentsV2/DataDisplay/Typography';
import {styles} from './styles';

import BathIcon from '../../../../assets/data/images/icons/bath-icon.svg';
import HairIcon from '../../../../assets/data/images/icons/hair-icon.svg';
import Cleaning from '../../../../assets/data/images/icons/cleaning-icon.svg';
import ShampooIcon from '../../../../assets/data/images/icons/shampoo-icon.svg';
import BodySoap from '../../../../assets/data/images/icons/body-soap.svg';
import HotWater from '../../../../assets/data/images/icons/hot-water-icon.svg';

const AmenitiesItem = ({image, text}) => {
  const amenitiesImage = image => {
    switch (image) {
      case 1:
        return <BathIcon width={24} height={26} />;
      case 2:
        return <HairIcon width={24} height={26} />;
      case 3:
        return <Cleaning width={24} height={26} />;
      case 4:
        return <ShampooIcon width={24} height={26} />;
      case 5:
        return <ShampooIcon width={24} height={26} />;
      case 6:
        return <BodySoap width={24} height={26} />;
      case 7:
        return <HotWater width={24} height={26} />;
    }
  };
  return (
    <View style={styles.amentiesItem}>
      {/* <Image source={image} width={24} height={26} style={styles.image} /> */}
      {amenitiesImage(image)}
      <Typography variant="default" style={{paddingLeft: 10}}>
        {text}
      </Typography>
    </View>
  );
};

export default AmenitiesItem;
