import React from 'react';
import {View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Typography from '../Typography';
import {styles} from './styles';

const PrivacyItem = ({item}) => {
  return (
    <View style={styles.privacyItem}>
      <View style={styles.leftItem}>
        {item?.date && <Typography bold>{item.date}</Typography>}
        {item?.time && <Typography variant="small">{item.time}</Typography>}
        {item?.checkIn && <Typography variant="small">{item.checkIn}</Typography>}
      </View>

      {item?.text && <Typography style={{width: wp(60)}}>{item.text}</Typography>}
    </View>
  );
};

export default PrivacyItem;
