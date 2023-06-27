import React, {useState} from 'react';
import {View, ScrollView, Text, Image, StatusBar} from 'react-native';

import SkeletonContent from 'react-native-skeleton-content-nonexpo';

const ActivityLoader = props => {
  const [loading, setLoading] = useState(true);

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
      }}
    >
      <SkeletonContent
        containerStyle={{paddingBottom: 100, width: 300}}
        animationDirection="horizontalLeft"
        layout={[
          // long line
          {
            width: 320,
            height: 220,
            marginBottom: 10,
            borderRadius: 10,
          },
          {width: 220, height: 20, marginBottom: 6},
          // short line
          {width: 90, height: 20, marginBottom: 20},

          {
            width: 320,
            height: 220,
            marginBottom: 10,
            borderRadius: 10,
          },
          {width: 220, height: 20, marginBottom: 6},
          // short line
          {width: 90, height: 20, marginBottom: 20},

          {
            width: 320,
            height: 220,
            marginBottom: 10,
            borderRadius: 10,
          },
          {width: 220, height: 20, marginBottom: 6},
          // short line
          {width: 90, height: 20, marginBottom: 20},

          // ...
        ]}
      />
    </ScrollView>
  );
};

export default ActivityLoader;
