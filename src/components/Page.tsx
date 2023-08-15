import React, {useState, useCallback, useMemo} from 'react';
import {SafeAreaView, ScrollView, View, StatusBar, StatusBarProps, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Header from './Header';
import Whitespace from './Whitespace';
import Typography from './Typography';

import {colors, global} from '../assets/styles';
import {pageInnerHorizontalPadding} from '../assets/styles/global';
import hamburger from '../assets/images/hamburger.png';

interface PageProps {
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Status bar setting. Defaults to dark.
   */
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  /**
   * Pass any additional props directly to the StatusBar component.
   */
  statusBarProps?: StatusBarProps;

  hasPadding?: boolean;
  // wildcard
  [x: string]: any;
}

const Page = (props: PageProps) => {
  const {
    header,
    children,
    inline,
    type = 'small',
    reverse,
    footer,
    leftIcon,
    rightIcon,
    onLeftIconPress,
    accessibilityLabel,
    backgroundColor = colors.palette.textInverse,
    hasPadding = true,
    statusBarStyle = 'dark',
    statusBarProps,
  } = props;
  const [footerTop, setFooterTop] = useState(0);

  const Display = useMemo(() => (inline ? View : ScrollView), [inline]);

  const navigation = useNavigation();

  const onFooterLayout = useCallback(e => {
    const {
      layout: {height},
    } = e.nativeEvent;
    setFooterTop(height);
  }, []);

  const wrapperStyle = useMemo(() => {
    return [global.flex, {backgroundColor}];
  }, [backgroundColor]);

  const displayStyles = useMemo(() => {
    return [
      global.page,
      hasPadding && inline && {paddingHorizontal: pageInnerHorizontalPadding},
      inline && {paddingHorizontal: 0},
      Platform.OS === 'ios' ? {paddingTop: 20} : {},
    ];
  }, [hasPadding, inline]);

  const displayContentStyles = useMemo(() => {
    return [
      global.pageContent,
      reverse ? global.columnReverse : {},
      hasPadding && {paddingHorizontal: pageInnerHorizontalPadding},
    ];
  }, [hasPadding, reverse]);

  return (
    <SafeAreaView style={wrapperStyle}>
      <StatusBar backgroundColor={backgroundColor} barStyle={statusBarStyle} {...statusBarProps} />

      {type === 'drawer' && header ? (
        // @ts-ignore
        <Header leftIcon={hamburger} onClose={navigation.toggleDrawer}>
          {header}
        </Header>
      ) : null}

      {type === 'small' && header && !inline ? (
        <Header
          center
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          onClose={onLeftIconPress || navigation.goBack}>
          {header}
        </Header>
      ) : null}

      <Display
        accessible
        accessibilityLabel={accessibilityLabel}
        style={displayStyles}
        contentContainerStyle={displayContentStyles}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        {type === 'large' && header && !inline ? (
          <>
            <Whitespace marginTop={30} />

            <Typography type="largeHeading">{header}</Typography>
          </>
        ) : null}
        {type === 'small' && <Whitespace paddingTop={32} />}
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
