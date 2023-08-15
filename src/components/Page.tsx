import React, {useState, useCallback, useMemo} from 'react';
import {ScrollView, View, ViewStyle, StatusBar, StatusBarProps, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {ExtendedEdge, useSafeAreaInsetsStyle} from '@utils/useSafeAreaInsetsStyle';
import Header from './Header';
import Whitespace from './Whitespace';
import Typography from './Typography';

import {colors, global} from '../assets/styles';
import {pageInnerHorizontalPadding} from '../assets/styles/global';

interface PageProps {
  /**
   * Override the default edges for the safe area.
   */
  safeAreaEdges?: ExtendedEdge[];
  /**
   * Background color
   */
  backgroundColor?: string;
  /**
   * Status bar setting. Defaults to dark.
   */
  statusBarStyle?: 'light' | 'dark';
  /**
   * Pass any additional props directly to the StatusBar component.
   */
  statusBarProps?: StatusBarProps;

  hasPadding?: boolean;
  // wildcard
  [x: string]: any;
}

const containerStyle: ViewStyle = {
  flex: 1,
};

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
    safeAreaEdges = ['top'],
    hasPadding = true,
    statusBarStyle,
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

  const containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);

  const wrapperStyle = useMemo(() => {
    return [containerStyle, {backgroundColor}, containerInsets];
  }, [containerInsets, backgroundColor]);

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
    <View style={wrapperStyle}>
      <StatusBar style={statusBarStyle} {...statusBarProps} />

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
    </View>
  );
};

export default Page;
