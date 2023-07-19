import React, {FunctionComponent, useMemo} from 'react';
import {ScrollView, ViewStyle} from 'react-native';

type Props = {
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  paddingHorizontal?: boolean;
  paddingTop?: boolean;
  children?: React.ReactNode | React.ReactNode[];
  isFixed?: boolean;
  navigation?: any;
  onScroll?: any;
  hideTab?: boolean;
  [x: string]: any;
};

export const ScrollArea: FunctionComponent<Props> = ({children, contentStyle, ...otherProps}) => {
  const $containerStyle = useMemo(() => {
    return [$contentStyle, contentStyle];
  }, [contentStyle]);
  return (
    <ScrollView
      nestedScrollEnabled={true}
      contentContainerStyle={$containerStyle}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      alwaysBounceHorizontal={false}
      alwaysBounceVertical={false}
      bounces={false}
      scrollEventThrottle={16}
      {...otherProps}>
      {children}
    </ScrollView>
  );
};

const $contentStyle: ViewStyle = {
  flexGrow: 1,
};
