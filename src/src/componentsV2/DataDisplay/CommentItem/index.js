import React, {useMemo} from 'react';
import {View, Image, Pressable} from 'react-native';

import {styles} from './styles';
import Typography from '../Typography';
import {offsets} from '../../../styles/globalStyles';

const CommentItem = ({image, style, title, locality, subLocality, onPress}) => {
  return (
    <Pressable onPress={onPress} style={[styles.main, style]}>
      <View style={[styles.userTitleWrapper]}>
        {image && <Image source={{uri: image}} style={styles.userImage} />}
        <View>
          <Typography bold style={{marginLeft: offsets.offsetA}}>
            Hanna
          </Typography>
          <Typography style={{marginLeft: offsets.offsetA, marginTop: offsets.minor}}>
            3 days ago
          </Typography>
        </View>
      </View>
      <View style={styles.textWrapper}>
        <Typography style={{marginTop: offsets.offsetA}}>
          Very beautiful, clean and spacious house. Great location and access. Super easy and smooth
          check-in process. Hosts were great to communicate with and very helpf...
        </Typography>
        <Typography
          onPress={() => {}}
          style={{textDecorationLine: 'underline', marginTop: offsets.offsetA}}>
          Learn more
        </Typography>
      </View>
    </Pressable>
  );
};

export default CommentItem;
