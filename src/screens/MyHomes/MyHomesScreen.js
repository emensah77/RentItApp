import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import HomesCard from './components/HomesCard';
import styles from './MyHomesScreen.styles';

export default () => {
  const renderHeader = useCallback(() => <Text style={styles.headerTitle}>Homes</Text>, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.basePadding}>
        {renderHeader()}
        <HomesCard />
      </View>
    </SafeAreaView>
  );
};
