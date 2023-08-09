import React, {useState, useCallback, useMemo} from 'react';
import {ScrollView, View, StatusBar, StatusBarProps} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {ExtendedEdge, useSafeAreaInsetsStyle} from '@utils/useSafeAreaInsetsStyle';
import Header from './Header';
import Whitespace from './Whitespace';
import Typography from './Typography';

import {global} from '../assets/styles';

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
  StatusBarProps?: StatusBarProps;
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
    onRightIconPress,
    accessibilityLabel,
    backgroundColor = '#FFFFFF',
    safeAreaEdges = ['top'],
    statusBarStyle = 'dark-content',
    statusBarProps,
  } = props;
  const [footerTop, setFooterTop] = useState(0);

  const navigation = useNavigation();

  const Display = useMemo(() => (inline ? View : ScrollView), [inline]);

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);

  const pageStyle = useMemo(
    () => [global.flex, {backgroundColor}, inline ? {} : $containerInsets],
    [$containerInsets, backgroundColor, inline],
  );

  const contentContainerStyle = useMemo(
    () => [inline ? {} : global.pageContent, reverse ? global.columnReverse : {}],
    [reverse, inline],
  );

  const onFooterLayout = useCallback(e => {
    const {
      layout: {height},
    } = e.nativeEvent;
    setFooterTop(height);
  }, []);

  return (
    <View style={pageStyle}>
      {!inline && (
        <StatusBar
          backgroundColor={backgroundColor}
          barStyle={statusBarStyle}
          {...statusBarProps}
        />
      )}

      {type === 'small' && header && !inline ? (
        <Header
          center
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          onClose={onLeftIconPress || navigation.goBack}
          onMenuToggle={onRightIconPress}>
          {header}
        </Header>
      ) : null}

      <Display
        accessible
        accessibilityLabel={accessibilityLabel}
        style={global.page}
        contentContainerStyle={contentContainerStyle}
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