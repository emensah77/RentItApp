import React, {useMemo} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';

import Header from './Header';

import {global} from '../assets/styles';

const Page = props => {
  const {header, children, inline} = props;

  const Display = useMemo(() => (inline ? View : ScrollView), [inline]);

  return (
    <SafeAreaView style={global.flex}>
      {header && !inline && <Header center>{header}</Header>}
      <Display
        style={global.page}
        contentContainerStyle={global.pageContent}
        keyboardShouldPersistTaps="handled">
        {children}
      </Display>
    </SafeAreaView>
  );
};

export default Page;
