import React, {useMemo} from 'react';
import {StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle} from 'react-native';
import {colors, fontFamily as fontFamilie} from '@theme';

type Sizes = keyof typeof $sizeStyles;
type Weights = keyof typeof fontFamily.manrope;
type Presets = keyof typeof $presets;

export interface TextProps extends RNTextProps {
  text?: string;

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>;
  /**
   * One of the different types of text presets.
   */
  preset?: Presets;
  /**
   * Text weight modifier.
   */
  weight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
  /**
   * Text size modifier.
   */
  size?: Sizes;
  /**
   * Children components.
   */
  children?: React.ReactNode;
  /**
   * Text color.
   */
  color?: string;
  /**
   * Wildcard.
   */
  [x: string]: any;
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Text.md)
 */
export function Text(props: TextProps) {
  const {weight, size, text, children, color, style: $styleOverride, ...rest} = props;

  const content = text || children;
  // @ts-ignore
  const preset: Presets = $presets[props.preset] ? props.preset : 'default';
  // @ts-ignore
  const $styles = useMemo(() => {
    return [
      {fontFamily: fontFamily.manrope, fontWeight: weight},
      $presets[preset],
      // @ts-ignore
      $sizeStyles[size],
      {color},
      $styleOverride,
    ];
  }, [$styleOverride, color, preset, size, weight]);
  return (
    // @ts-ignore
    <RNText {...rest} style={$styles}>
      {content}
    </RNText>
  );
}

const $sizeStyles = {
  xxl: {fontSize: 36, lineHeight: 44} as TextStyle,
  xl: {fontSize: 24, lineHeight: 34} as TextStyle,
  lg: {fontSize: 20, lineHeight: 32} as TextStyle,
  md: {fontSize: 18, lineHeight: 26} as TextStyle,
  sm: {fontSize: 16, lineHeight: 24} as TextStyle,
  xs: {fontSize: 14, lineHeight: 21} as TextStyle,
  xxs: {fontSize: 12, lineHeight: 18} as TextStyle,
};

const $fontWeightStyles = Object.entries(fontFamilie.manrope).reduce(
  (acc, [weight, fontFamily]) => {
    return {...acc, [weight]: {fontFamily}};
  },
  {},
) as Record<Weights, TextStyle>;

const $baseStyle: StyleProp<TextStyle> = [$sizeStyles.sm, {color: colors.text}];

const $presets = {
  default: $baseStyle,

  bold: [$baseStyle, $fontWeightStyles.bold] as StyleProp<TextStyle>,

  heading: [$baseStyle, $sizeStyles.xxl, $fontWeightStyles.bold] as StyleProp<TextStyle>,

  subheading: [$baseStyle, $sizeStyles.lg] as StyleProp<TextStyle>,

  formLabel: [$baseStyle] as StyleProp<TextStyle>,

  formHelper: [$baseStyle, $sizeStyles.sm] as StyleProp<TextStyle>,
};
