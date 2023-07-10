import React, {ComponentType} from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {colors, spacing, fontFamily} from '@theme';
import {Text, TextProps} from './Text';

type Presets = keyof typeof $viewPresets;

export interface ButtonAccessoryProps {
  style: StyleProp<any>;
  pressableState: PressableStateCallbackType;
}

export interface ButtonProps extends PressableProps {
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps['text'];

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>;
  /**
   * One of the different types of button presets.
   */
  preset?: Presets;

  loading?: boolean;
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * Children components.
   */
  children?: React.ReactNode;
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Button.md)
 */
export function Button(props: ButtonProps) {
  const {
    text,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    loading,
    children,
    RightAccessory,
    LeftAccessory,
    ...rest
  } = props;
  // @ts-ignore
  const preset: Presets = $viewPresets[props.preset] ? props.preset : 'primary';

  function $viewStyle({pressed}) {
    return [
      $viewPresets[preset],
      $viewStyleOverride,
      !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
    ];
  }
  function $textStyle({pressed}) {
    return [
      $textPresets[preset],
      $textStyleOverride,
      !!pressed && [$pressedTextPresets[preset], $pressedTextStyleOverride],
    ];
  }

  return (
    // eslint-disable-next-line react/jsx-no-bind
    <Pressable style={$viewStyle} accessibilityRole="button" {...rest}>
      {state => (
        <>
          {!!LeftAccessory && <LeftAccessory style={$leftAccessoryStyle} pressableState={state} />}

          {loading ? (
            <ActivityIndicator color={colors.palette.pink} />
          ) : (
            <Text text={text} style={$textStyle(state)}>
              {children}
            </Text>
          )}
          {!!RightAccessory && (
            <RightAccessory style={$rightAccessoryStyle} pressableState={state} />
          )}
        </>
      )}
    </Pressable>
  );
}

// MARK: - Base Styles

const $baseViewStyle: ViewStyle = {
  minHeight: 56,
  borderRadius: 100,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  paddingVertical: spacing.small,
  paddingHorizontal: spacing.small,
  overflow: 'hidden',
};

const $baseTextStyle: TextStyle = {
  fontSize: 16,
  lineHeight: 20,
  fontFamily: fontFamily.manrope,
  color: colors.palette.textInverse,
  fontWeight: '500',
  textAlign: 'center',
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
};

// MARK: - Configure Presets

const $viewPresets = {
  primary: [
    $baseViewStyle,
    {
      backgroundColor: colors.palette.primary,
    },
  ] as StyleProp<ViewStyle>,
  secondary: [
    $baseViewStyle,
    {
      backgroundColor: 'transparent',
    },
  ] as StyleProp<ViewStyle>,

  gradientBorder: [
    $baseViewStyle,
    {
      borderWidth: 3,
      borderColor: 'white',
    },
  ] as StyleProp<ViewStyle>,

  textOnly: $baseViewStyle,
};

const $textPresets: Record<Presets, StyleProp<TextStyle>> = {
  primary: $baseTextStyle,
  secondary: [
    $baseTextStyle,
    {
      color: colors.palette.primary,
    },
  ],
  gradientBorder: [
    $baseTextStyle,
    {
      color: colors.palette.textInverse,
    },
  ],
  textOnly: [
    $baseTextStyle,
    {
      fontFamily: fontFamily.manrope,
      color: colors.palette.textInverse,
    },
  ],
};

const $pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  primary: {backgroundColor: colors.palette.neutral200},
  secondary: {backgroundColor: colors.palette.neutral200},
  gradientBorder: {opacity: 0.9},
  textOnly: $baseViewStyle,
};

const $pressedTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  primary: {opacity: 0.9},
  secondary: {opacity: 0.9},
  gradientBorder: {opacity: 0.9},
  textOnly: {opacity: 0.8},
};

// MARK: - Configure Accessory Views

const $rightAccessoryStyle: ViewStyle = {marginStart: spacing.extraSmall, zIndex: 1};
const $leftAccessoryStyle: ViewStyle = {marginEnd: spacing.extraSmall, zIndex: 1};
