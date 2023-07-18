import * as React from 'react';
import {ComponentType} from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';

export type IconTypes = keyof typeof iconRegistry;

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes;

  /**
   * An optional tint color for the icon
   */
  color?: string;

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number;

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>;

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps['onPress'];
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Icon.md)
 */
export const Icon = (props: IconProps) => {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props;

  const isPressable = !!WrapperProps.onPress;
  // @ts-ignore
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
    ? TouchableOpacity
    : View;

  return (
    <Wrapper
      accessibilityRole={isPressable ? 'imagebutton' : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}>
      {/* @ts-ignore */}
      <Image
        style={[
          $imageStyle,
          color && {tintColor: color},
          size && {width: size, height: size},
          $imageStyleOverride,
        ]}
        source={iconRegistry[icon]}
      />
    </Wrapper>
  );
};

export const iconRegistry = {
  arrDown: require('@assets/images/arrow-down.png'),
  search: require('@assets/images/icons/Union.png'),
  searchMini: require('@assets/images/icons/search-mini.png'),
  heart: require('@assets/images/icons/Vector.png'),
  home: require('@assets/images/icons/Group.png'),
  inbox: require('@assets/images/icons/Vector19.png'),
  user: require('@assets/images/icons/Union1.png'),
  starFilled: require('@assets/images/icons/star-fill.png'),
  filterMini: require('@assets/images/icons/filter-mini.png'),
  filter: require('@assets/images/icons/filter.png'),
  entireFlat: require('@assets/images/icons/entire-flat.png'),
  apartment: require('@assets/images/icons/apartments.png'),
  mansion: require('@assets/images/icons/mansion.png'),
  house: require('@assets/images/icons/house.png'),
  singleRoom: require('@assets/images/icons/checkin.png'),
  fullHome: require('@assets/images/icons/home.png'),
  arrLeft: require('@assets/images/icons/arr-left.png'),
};

const $imageStyle: ImageStyle = {
  resizeMode: 'contain',
};
