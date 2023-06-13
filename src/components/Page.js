import React, {useState, useCallback, useMemo} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';

import Header from './Header';
import Whitespace from './Whitespace';
import Typography from './Typography';

import {global} from '../assets/styles';

const Page = props => {
  const {header, children, inline, type = 'small', footer, leftIcon, rightIcon} = props;
  const [footerTop, setFooterTop] = useState(0);

  const Display = useMemo(() => (inline ? View : ScrollView), [inline]);

  const onFooterLayout = useCallback(e => {
    const {
      layout: {height},
    } = e.nativeEvent;
    setFooterTop(height);
  }, []);

  return (
    <SafeAreaView style={global.flex}>
      {type === 'small' && header && !inline ? (
        <Header center leftIcon={leftIcon} rightIcon={rightIcon}>
          {header}
        </Header>
      ) : null}

      <Display
        style={global.page}
        contentContainerStyle={global.pageContent}
        keyboardShouldPersistTaps="handled">
        {type === 'large' && header && !inline ? (
          <>
            <Whitespace marginTop={30} />

            <Typography type="largeHeading">{header}</Typography>
          </>
        ) : null}
        {children}
      </Display>

      {footer ? (
        <>
          <Whitespace marginTop={footerTop || 5} />

          <View style={global.footer} onLayout={onFooterLayout}>
            {footer}
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
};

export default Page;
