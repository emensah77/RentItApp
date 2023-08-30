import React, {ReactElement, useMemo} from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import {spacing} from '@theme';
import {Icon, IconTypes} from './Icon';
import {Text, TextProps} from './Text';

export interface ListItemProps extends TouchableOpacityProps {
  /**
   * How tall the list item should be.
   * Default: 56
   */
  height?: number;
  /**
   * Whether to show the top separator.
   * Default: false
   */
  topSeparator?: boolean;
  /**
   * Whether to show the bottom separator.
   * Default: false
   */
  bottomSeparator?: boolean;
  /**
   * Text to display if not using `tx` or nested components.
   */
  text?: TextProps['text'];

  /**
   * Children components.
   */
  children?: TextProps['children'];

  /**
   * Optional text style override.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Pass any additional props directly to the Text component.
   */
  TextProps?: TextProps;
  /**
   * Optional View container style override.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Optional TouchableOpacity style override.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Icon that should appear on the left.
   */
  leftIcon?: IconTypes;
  /**
   * An optional tint color for the left icon
   */
  leftIconColor?: string;
  /**
   * Icon that should appear on the right.
   */
  rightIcon?: IconTypes;
  /**
   * An optional tint color for the right icon
   */
  rightIconColor?: string;
  /**
   * Right action custom ReactElement.
   * Overrides `rightIcon`.
   */
  RightComponent?: ReactElement;
  /**
   * Left action custom ReactElement.
   * Overrides `leftIcon`.
   */
  LeftComponent?: ReactElement;

  textProps?: TextProps;
}

interface ListItemActionProps {
  icon: IconTypes | undefined;
  iconColor?: string;
  Component?: ReactElement;
  size: number;
  side: 'left' | 'right';
}

/**
 * A styled row component that can be used in FlatList, SectionList, or by itself.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-ListItem.md)
 */
export function ListItem(props: ListItemProps) {
  const {
    bottomSeparator,
    children,
    height = 56,
    LeftComponent,
    leftIcon,
    leftIconColor,
    RightComponent,
    rightIcon,
    rightIconColor,
    style,
    text,
    textProps,
    topSeparator,
    textStyle: $textStyleOverride,
    containerStyle: $containerStyleOverride,
    // ...TouchableOpacityProps
  } = props;

  const $textStyles = useMemo(
    () => [$textStyle, $textStyleOverride, textProps?.style],
    [$textStyleOverride, textProps?.style],
  );

  const $containerStyles = useMemo(
    () => [
      topSeparator && $separatorTop,
      bottomSeparator && $separatorBottom,
      $containerStyleOverride,
    ],
    [$containerStyleOverride, bottomSeparator, topSeparator],
  );

  const $touchableStyles = useMemo(
    () => [$touchableStyle, {minHeight: height}, style],
    [height, style],
  );

  return (
    <View style={$containerStyles}>
      <TouchableOpacity {...TouchableOpacityProps} style={$touchableStyles}>
        <ListItemAction
          side="left"
          size={height}
          icon={leftIcon}
          iconColor={leftIconColor}
          Component={LeftComponent}
        />

        <Text {...textProps} text={text} style={$textStyles}>
          {children}
        </Text>

        <ListItemAction
          side="right"
          size={height}
          icon={rightIcon}
          iconColor={rightIconColor}
          Component={RightComponent}
        />
      </TouchableOpacity>
    </View>
  );
}

function ListItemAction(props: ListItemActionProps) {
  const {icon, Component, iconColor, size, side} = props;

  const $containerStyle = useMemo(
    () => [
      $iconContainer,
      side === 'left' && $iconContainerLeft,
      side === 'right' && $iconContainerRight,
      {height: size},
    ],
    [side, size],
  );

  if (Component) return Component;

  if (icon) {
    return <Icon size={24} icon={icon} color={iconColor} containerStyle={$containerStyle} />;
  }

  return null;
}

const $separatorTop: ViewStyle = {
  borderTopWidth: 1,
  // borderTopColor: colors.separator,
};

const $separatorBottom: ViewStyle = {
  borderBottomWidth: 1,
  // borderBottomColor: colors.separator,
};

const $textStyle: TextStyle = {
  paddingVertical: spacing.extraSmall,
  alignSelf: 'center',
  flexGrow: 1,
  flexShrink: 1,
};

const $touchableStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'flex-start',
};

const $iconContainer: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  flexGrow: 0,
};
const $iconContainerLeft: ViewStyle = {
  marginEnd: spacing.medium,
};

const $iconContainerRight: ViewStyle = {
  marginStart: spacing.medium,
};
