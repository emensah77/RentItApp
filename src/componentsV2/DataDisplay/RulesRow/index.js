import React from 'react';
import {View} from 'react-native-animatable';

import {styles} from './styles';

import Typography from '../Typography';

// import Star from '../../../../assets/data/images/icons/star.svg';
// import Check from '../../../../assets/data/images/icons/listing-small.svg';
// import Cell from '../../../../assets/data/images/icons/cell-icon.svg';
// import HostIcon from '../../../../assets/data/images/icons/host-icon.svg';
// import ClockIcon from '../../../../assets/data/images/icons/clock-icon.svg';
// import DoorCheck from '../../../../assets/data/images/icons/door-check.svg';
// import PetsIcon from '../../../../assets/data/images/icons/pets-icon.svg';
// import NoPartiesIcon from '../../../../assets/data/images/icons/no-parties-icon.svg';
// import CovidIcon from '../../../../assets/data/images/icons/covid.svg';
// import SmokeIcon from '../../../../assets/data/images/icons/smoke.svg';

const RulesRow = ({image, text}) => {
  // const svgImage = image => {
  //   switch (image) {
  //     case 1:
  //       return <Star width={20} height={20} />;
  //     case 2:
  //       return <HostIcon width={20} height={20} />;
  //     case 3:
  //       return <Check width={20} height={20} />;
  //     case 4:
  //       return <Cell width={20} height={20} />;
  //     case 5:
  //       return <ClockIcon width={20} height={20} />;
  //     case 6:
  //       return <DoorCheck width={20} height={20} />;
  //     case 7:
  //       return <PetsIcon width={20} height={20} />;
  //     case 8:
  //       return <NoPartiesIcon width={20} height={20} />;
  //     case 9:
  //       return <CovidIcon width={20} height={20} />;
  //     case 10:
  //       return <SmokeIcon width={20} height={20} />;
  //     case 11:
  //       return <SmokeIcon width={20} height={20} />;
  //   }
  // };

  return (
    <View style={styles.rulesItem}>
      {image}
      <Typography variant="large" style={{paddingLeft: 10}}>
        {text}
      </Typography>
    </View>
  );
};

export default RulesRow;
