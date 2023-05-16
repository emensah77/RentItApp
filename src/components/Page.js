import React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';

import Header from './Header';

import {global} from '../assets/styles';

const Page = props => {
  const {header, children} = props;

  return (
    <SafeAreaView style={global.flex}>
      {header && <Header center>{header}</Header>}
      <ScrollView
        style={global.page}
        contentContainerStyle={global.pageContent}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Page;
