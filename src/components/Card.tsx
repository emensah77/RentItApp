import React, {ComponentType, Fragment, ReactElement, useMemo} from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import {colors, spacing} from '@theme';
import {Text, TextProps} from './Text';

type Presets = keyof typeof $containerPresets;

interface CardProps extends TouchableOpacityProps {
  /**
   * One of the different types of text presets.
   */
  preset?: Presets;
  /**
   * How the content should be aligned vertically. This is especially (but not exclusively) useful
   * when the card is a fixed height but the content is dynamic.
   *
   * `top` (default) - aligns all content to the top.
   * `center` - aligns all content to the center.
   * `space-between` - spreads out the content evenly.
   * `force-footer-bottom` - aligns all content to the top, but forces the footer to the bottom.
   */
  verticalAlignment?: 'top' | 'center' | 'space-between' | 'force-footer-bottom';
  /**
   * Custom component added to the left of the card body.
   */
  LeftComponent?: ReactElement;
  /**
   * Custom component added to the right of the card body.
   */
  RightComponent?: ReactElement;
  /**
   * The heading text to display if not using `headingTx`.
   */
  heading?: TextProps['text'];

  /**
   * Style overrides for heading text.
   */
  headingStyle?: StyleProp<TextStyle>;
  /**
   * Pass any additional props directly to the heading Text component.
   */
  HeadingTextProps?: TextProps;
  /**
   * Custom heading component.
   * Overrides all other `heading*` props.
   */
  HeadingComponent?: ReactElement;
  /**
   * The content text to display if not using `contentTx`.
   */
  content?: TextProps['text'];

  /**
   * Style overrides for content text.
   */
  contentStyle?: StyleProp<TextStyle>;
  /**
   * Pass any additional props directly to the content Text component.
   */
  ContentTextProps?: TextProps;
  /**
   * Custom content component.
   * Overrides all other `content*` props.
   */
  ContentComponent?: ReactElement;
  /**
   * The footer text to display if not using `footerTx`.
   */
  footer?: TextProps['text'];

  /**
   * Style overrides for footer text.
   */
  footerStyle?: StyleProp<TextStyle>;
  /**
   * Pass any additional props directly to the footer Text component.
   */
  FooterTextProps?: TextProps;
  /**
   * Custom footer component.
   * Overrides all other `footer*` props.
   */
  FooterComponent?: ReactElement;

  style?: StyleProp<ViewStyle>;

  onPress?: any;
}

/**
 * Cards are useful for displaying related information in a contained way.
 * If a ListItem displays content horizontally, a Card can be used to display content vertically.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Card.md)
 */
export function Card(props: CardProps) {
  const {
    content,
    footer,
    heading,
    ContentComponent,
    HeadingComponent,
    FooterComponent,
    LeftComponent,
    RightComponent,
    verticalAlignment = 'top',
    style: $containerStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    footerStyle: $footerStyleOverride,
    ContentTextProps,
    HeadingTextProps,
    FooterTextProps,
    ...WrapperProps
  } = props;

  // @ts-ignore
  const preset: Presets = $containerPresets[props.preset] ? props.preset : 'default';
  // @ts-ignore
  const isPressable = !!WrapperProps.onPress;
  const isHeadingPresent = !!(HeadingComponent || heading);
  const isContentPresent = !!(ContentComponent || content);
  const isFooterPresent = !!(FooterComponent || footer);

  const Wrapper: ComponentType<TouchableOpacityProps> = isPressable ? TouchableOpacity : View;
  const HeaderContentWrapper = verticalAlignment === 'force-footer-bottom' ? View : Fragment;

  const $containerStyle = useMemo(() => {
    return [$containerPresets[preset], $containerStyleOverride];
  }, [$containerStyleOverride, preset]);

  const $headingStyle = useMemo(() => {
    return [
      $headingPresets[preset],
      (isFooterPresent || isContentPresent) && {marginBottom: spacing.micro},
      $headingStyleOverride,
      HeadingTextProps?.style,
    ];
  }, [$headingStyleOverride, HeadingTextProps?.style, isContentPresent, isFooterPresent, preset]);

  const $contentStyle = useMemo(() => {
    return [
      $contentPresets[preset],
      isHeadingPresent && {marginTop: spacing.micro},
      isFooterPresent && {marginBottom: spacing.micro},
      $contentStyleOverride,
      ContentTextProps?.style,
    ];
  }, [$contentStyleOverride, ContentTextProps?.style, isFooterPresent, isHeadingPresent, preset]);

  const $footerStyle = useMemo(() => {
    return [
      $footerPresets[preset],
      (isHeadingPresent || isContentPresent) && {marginTop: spacing.micro},
      $footerStyleOverride,
      FooterTextProps?.style,
    ];
  }, [$footerStyleOverride, FooterTextProps?.style, isContentPresent, isHeadingPresent, preset]);

  const $alignmentWrapperStyle = useMemo(() => {
    return [
      $alignmentWrapper,
      {justifyContent: $alignmentWrapperFlexOptions[verticalAlignment]},
      LeftComponent && {marginStart: spacing.medium},
      RightComponent && {marginEnd: spacing.medium},
    ];
  }, [LeftComponent, RightComponent, verticalAlignment]);

  return (
    <Wrapper
      style={$containerStyle}
      activeOpacity={0.8}
      accessibilityRole={isPressable ? 'button' : undefined}
      {...WrapperProps}>
      {LeftComponent}

      <View style={$alignmentWrapperStyle}>
        <HeaderContentWrapper>
          {HeadingComponent ||
            (isHeadingPresent && (
              <Text weight="bold" text={heading} {...HeadingTextProps} style={$headingStyle} />
            ))}

          {ContentComponent ||
            (isContentPresent && (
              <Text weight="500" text={content} {...ContentTextProps} style={$contentStyle} />
            ))}
        </HeaderContentWrapper>

        {FooterComponent ||
          (isFooterPresent && (
            <Text
              weight="normal"
              size="xs"
              text={footer}
              {...FooterTextProps}
              style={$footerStyle}
            />
          ))}
      </View>

      {RightComponent}
    </Wrapper>
  );
}

const $containerBase: ViewStyle = {
  borderRadius: spacing.medium,
  padding: spacing.extraSmall,
  // borderWidth: 1,
  shadowColor: colors.palette.neutral800,
  // shadowOffset: { width: 0, height: 12 },
  // shadowOpacity: 0.08,
  // shadowRadius: 12.81,
  // elevation: 16,
  flexDirection: 'row',
};

const $alignmentWrapper: ViewStyle = {
  flex: 1,
  alignSelf: 'stretch',
};

const $alignmentWrapperFlexOptions = {
  top: 'flex-start',
  center: 'center',
  'space-between': 'space-between',
  'force-footer-bottom': 'space-between',
} as const;

const $containerPresets = {
  default: [
    $containerBase,
    {
      backgroundColor: colors.palette.neutral100,
      borderColor: colors.palette.neutral300,
    },
  ] as StyleProp<ViewStyle>,

  reversed: [
    $containerBase,
    {backgroundColor: colors.palette.neutral800, borderColor: colors.palette.neutral500},
  ] as StyleProp<ViewStyle>,
};

const $headingPresets: Record<Presets, TextStyle> = {
  default: {},
  reversed: {color: colors.palette.neutral100},
};

const $contentPresets: Record<Presets, TextStyle> = {
  default: {},
  reversed: {color: colors.palette.neutral100},
};

const $footerPresets: Record<Presets, TextStyle> = {
  default: {},
  reversed: {color: colors.palette.neutral100},
};
