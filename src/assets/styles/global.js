import {StyleSheet, Dimensions} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const size = () => Dimensions.get('screen');
export const isPortrait = () => size().height > size().width;
export const isLandscape = () => !isPortrait;
export const pageInnerHorizontalPadding = 20;
export const standardWidth = isPortrait && size().width > 450 ? 800 : 450;

export const sizing = {
  maxWidth: standardWidth,
  width: '100%',
  alignSelf: 'center',
};

export const fonts = {
  primary: 'Manrope ExtraLight',
};

export const colors = {
  primary: '#194CC3',
  secondary: '#FFFFFF',
  text: '#1F2D3D',
  border: 'lightgrey',
  gray: '#DDDDDD',
  active: '#0047B3',
};

export const offsets = {
  minor: wp(1),
  offsetA: wp(2.56),
  offsetB: wp(4.1),
  offsetC: wp(5.64),
};

export const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#383838',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#120202',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#120202',
      },
    ],
  },
  {
    featureType: 'administrative.province',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#383838',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#23a0fd',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.icon',
    stylers: [
      {
        color: '#16659e',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text',
    stylers: [
      {
        color: '#16659e',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#16659e',
      },
    ],
  },
];

const global = StyleSheet.create({
  flex: {flex: 1},
  spaceBetween: {...sizing, justifyContent: 'space-between'},
  spaceAround: {...sizing, justifyContent: 'space-around'},
  flexStart: {...sizing, justifyContent: 'flex-start'},
  flexEnd: {...sizing, justifyContent: 'flex-end'},
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
  column: {
    flexDirection: 'column',
  },
  columnReverse: {flexDirection: 'column-reverse'},
  row: {...sizing, flexDirection: 'row'},
  wrap: {...sizing, flexWrap: 'wrap'},
  rowWrap: {...sizing, flexDirection: 'row', flexWrap: 'wrap'},
  rowReverse: {flexDirection: 'row-reverse'},
  zeroElevation: {
    elevation: 0,
    zIndex: 0,
  },
  elevation: {
    elevation: 3,
    padding: 30,
    borderRadius: 5,
    borderTopWidth: 0,
    shadowColor: '#000',
    // shadowOffset: {width: 1000, height: 2000},
    // shadowOpacity: 1,
    // shadowRadius: 20,
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  page: {
    flex: 1,
    backgroundColor: '#FFF',
    height: '100%',
    width: '100%',
  },
  pageContent: {
    paddingHorizontal: pageInnerHorizontalPadding,
    flexGrow: 1,
  },
  footer: {
    paddingHorizontal: pageInnerHorizontalPadding,
    backgroundColor: '#FFF',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
  },
  header: {
    backgroundColor: '#FFF',
    width: '100%',
    height: 65,
    borderBottomColor: '#DFDFDF',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 12,
    width: 12,
    margin: 5,
  },
  mediumIcon: {width: 48, height: 32},
  largeIcon: {width: 42.5, height: 47, marginVertical: 25},
  ovalIcon: {
    borderRadius: 12,
  },
  leftHeaderIcon: {
    position: 'absolute',
    left: pageInnerHorizontalPadding,
  },
  rightHeaderIcon: {
    position: 'absolute',
    right: pageInnerHorizontalPadding,
  },
  prefix: {
    position: 'absolute',
    left: pageInnerHorizontalPadding / 2,
    marginTop: 15,
  },
  suffix: {
    position: 'absolute',
    right: pageInnerHorizontalPadding / 2,
    top: 25,
    opacity: 0.3,
  },
  groupSuffix: {
    position: 'absolute',
    right: pageInnerHorizontalPadding / 2,
    top: 25,
    opacity: 0.4,
  },
  inputContainer: {
    alignSelf: 'center',
    maxHeight: 60,
  },
  input: {
    color: '#000000',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingRight: 8,
    paddingBottom: 10,
    paddingLeft: pageInnerHorizontalPadding / 2,
    maxWidth: '100%',
    width: standardWidth,
    height: 60,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderStyle: 'solid',
    borderRadius: 8,
    opacity: 0.6,
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'center',
  },
  inputLabel: {position: 'absolute', left: 14, top: 2, color: '#717171', alignSelf: 'center'},
  inlineInput: {
    borderWidth: 1,
    borderColor: '#B0B0B0',
    width: 342,
    maxWidth: '100%',
    height: 40,
    borderRadius: 31,
    flex: 0,
  },
  multiLine: {
    flexDirection: 'column',
    minWidth: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  plain: {
    width: 'auto',
    minWidth: 225,
    backgroundColor: 'transparent',
    textAlign: 'left',
    borderWidth: 0,
    borderRadius: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  groupBefore: {
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  groupAfter: {
    marginTop: 0,
    marginBottom: -1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dividerContainer: {
    marginVertical: 42.5,
    backgroundColor: 'transparent',
  },
  noTextDividerContainer: {marginVertical: 25},
  dividerTextContainer: {
    padding: 7,
    backgroundColor: '#FFFFFF',
    zIndex: 200,
    alignSelf: 'center',
    marginTop: -20,
    position: 'absolute',
  },
  noTextDividerTextContainer: {
    padding: 0,
    marginTop: 0,
  },
  dividerText: {
    width: 'auto',
    color: '#717171',
  },
  divider: {
    height: 2 * StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#DEDEDE',
    zIndex: 100,
  },
  noTextDivider: {marginTop: 0},
  dropdownItem: {
    ...sizing,
    flexDirection: 'row',
    paddingHorizontal: pageInnerHorizontalPadding - 5,
    paddingVertical: pageInnerHorizontalPadding / 2,
    marginVertical: 5,
  },
  error: {
    color: 'red',
    position: 'relative',
    marginTop: 3,
    marginBottom: 10,
    lineHeight: 17,
  },
  chip: {
    backgroundColor: '#F7F7F7',
    height: 45,
    width: 'auto',
    borderWidth: 2,
    borderColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 41,
  },
  chipSmall: {
    backgroundColor: '#F7F7F7',
    height: 34,
    width: 'auto',
    borderWidth: 1,
    borderColor: '#BFBFBF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  chipSelected: {
    backgroundColor: '#0047B3',
    height: 36,
    borderWidth: 1,
    borderColor: '#0047B3',
    paddingVertical: 5,
    paddingHorizontal: 27,
    borderRadius: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipDeSelected: {
    backgroundColor: 'transparent',
    height: 36,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    paddingVertical: 5,
    paddingHorizontal: 27,
    borderRadius: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#E6F0FF',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0047B3',
  },
  deselected: {
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B0B0B0',
  },
  contentBox: {
    maxWidth: 350,
    width: '80%',
    marginLeft: 3,
    marginRight: 3,
  },
  tab: {borderBottomWidth: 2, borderBottomColor: '#000000', height: 36},
  tabContent: {
    marginTop: 25,
  },
  buttonLike: {
    padding: 7,
    borderRadius: 13,
  },
  smallBorderRadius: {
    borderRadius: 12,
  },
  smallCircle: {
    width: 32,
    height: 32,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#B0B0B0',
  },
  ...Array.from(new Array(101)).reduce(
    (p, _, i) => ({
      ...p,
      [`top-${i}`]: {
        position: 'absolute',
        top: i,
        zIndex: 10000,
      },
      [`right-${i}`]: {
        position: 'absolute',
        right: i,
        zIndex: 10000,
      },
      [`bottom-${i}`]: {
        position: 'absolute',
        bottom: i,
        zIndex: 10000,
      },
      [`left-${i}`]: {
        position: 'absolute',
        left: i,
        zIndex: 10000,
      },
      [`top-${i}-center`]: {
        position: 'absolute',
        top: i,
        zIndex: 10000,
        alignSelf: 'center',
      },
      [`right-${i}-center`]: {
        position: 'absolute',
        right: i,
        zIndex: 10000,
        alignSelf: 'center',
      },
      [`bottom-${i}-center`]: {
        position: 'absolute',
        bottom: i,
        zIndex: 10000,
        alignSelf: 'center',
      },
      [`left-${i}-center`]: {
        position: 'absolute',
        left: i,
        zIndex: 10000,
        alignSelf: 'center',
      },
    }),
    {},
  ),
});

export default global;
