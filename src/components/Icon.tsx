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

  const $imageContainerStyle = React.useMemo(
    () => [
      $imageStyle,
      color && {tintColor: color},
      size && {width: size, height: size},
      $imageStyleOverride,
    ],
    [$imageStyleOverride, color, size],
  );

  return (
    <Wrapper
      accessibilityRole={isPressable ? 'imagebutton' : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}>
      {/* @ts-ignore */}
      <Image style={$imageContainerStyle} source={iconRegistry[icon]} />
    </Wrapper>
  );
};

const arrDown = require('@assets/images/arrow-down.png');
const search = require('@assets/images/icons/Union.png');
const searchMini = require('@assets/images/icons/search-mini.png');
const heart = require('@assets/images/icons/Vector.png');
const home = require('@assets/images/icons/Group.png');
const inbox = require('@assets/images/icons/Vector19.png');
const user = require('@assets/images/icons/Union1.png');
const starFilled = require('@assets/images/icons/star-fill.png');
const filterMini = require('@assets/images/icons/filter-mini.png');
const filter = require('@assets/images/icons/filter.png');
const entireFlat = require('@assets/images/icons/entire-flat.png');
const apartment = require('@assets/images/icons/apartments.png');
const mansion = require('@assets/images/icons/mansion.png');
const house = require('@assets/images/icons/house.png');
const singleRoom = require('@assets/images/icons/checkin.png');
const fullHome = require('@assets/images/icons/home.png');
const arrLeft = require('@assets/images/icons/arr-left.png');
const closeCircle = require('@assets/images/icons/circle.png');
const location = require('@assets/images/icons/location.png');

export const iconRegistry = {
  arrDown,
  search,
  searchMini,
  heart,
  home,
  inbox,
  user,
  starFilled,
  filterMini,
  filter,
  entireFlat,
  apartment,
  mansion,
  house,
  singleRoom,
  fullHome,
  arrLeft,
  closeCircle,
  location,
};

const $imageStyle: ImageStyle = {
  resizeMode: 'contain',
};
