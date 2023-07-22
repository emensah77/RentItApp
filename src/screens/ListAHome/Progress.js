import React, {useMemo, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';

const Progress = ({total, progress}) => {
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

  const progressStyle = useCallback(width => {
    return [styles.progress, {width}];
  }, []);

  return (
    <View style={styles.main}>
      {percents.map(percent => (
        <View key={percent + Math.random()} style={styles.progressBar}>
          <View style={progressStyle(percent)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: '100%', // marginBottom: 4.1
    height: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressBar: {
    width: '31%',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#DDDDDD',
  },
  progress: {
    height: 2,
    borderRadius: 1,
    backgroundColor: '#194CC3',
  },
});

export default Progress;
