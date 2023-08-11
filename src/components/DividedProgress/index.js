import React, {useMemo, useCallback} from 'react';
import {View} from 'react-native';

import {styles} from './styles';

const DividedProgress = ({total, progress, style}) => {
  const percents = useMemo(() => {
    let fullPercent = (progress / total) * 100 * 3;
    const percentArr = [];

    if (progress === total) {
      return [100, 100, 100];
    }

    for (let i = 0; i < 3; i++) {
      if (fullPercent > 0) {
        const side = fullPercent % 300;
        if (side >= 100) {
          percentArr.push(100);
          fullPercent -= 100;
        } else {
          percentArr.push(side);
          fullPercent -= side;
        }
      } else {
        percentArr.push(0);
      }
    }

    return percentArr;
  }, [total, progress]);

  const outerStyle = useMemo(() => [styles.main, style], [style]);

  const percentStyle = useCallback(percent => [styles.progress, {width: `${percent}%`}], []);

  return (
    <View style={outerStyle}>
      {percents.map(percent => (
        <View key={percent} style={styles.progressBar}>
          <View style={percentStyle(percent)} />
        </View>
      ))}
    </View>
  );
};

export default DividedProgress;
