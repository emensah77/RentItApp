import {StyleSheet, Dimensions} from 'react-native';

export const size = () => Dimensions.get('screen');
export const isPortrait = () => size().height > size().width;
export const isLandscape = () => !isPortrait;
export const pageInnerHorizontalPadding = 30;
export const standardWidth = isPortrait && size().width > 450 ? 800 : 540;
export const sizing = {
  maxWidth: standardWidth,
  width: '100%',
  alignSelf: 'center',
};

const global = StyleSheet.create({
  flex: {flex: 1},
  row: {...sizing, flexDirection: 'row'},
  spaceBetween: {...sizing, justifyContent: 'space-between'},
  flexStart: {...sizing, justifyContent: 'flex-start'},
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  zeroElevation: {
    elevation: 0,
    zIndex: 0,
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  page: {
    backgroundColor: '#FFF',
    height: '100%',
    width: '100%',
  },
  pageContent: {
    paddingHorizontal: pageInnerHorizontalPadding,
    paddingTop: 32,
    paddingBottom: 32,
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#FFF',
    width: '100%',
    height: 59,
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
  headerIcon: {
    position: 'absolute',
    left: pageInnerHorizontalPadding,
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
  dividerTextContainer: {
    padding: 7,
    backgroundColor: '#FFFFFF',
    zIndex: 200,
    alignSelf: 'center',
    marginTop: -3,
  },
  dividerText: {
    width: 'auto',
    color: '#717171',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#DEDEDE',
    zIndex: 100,
    marginTop: 18,
    position: 'absolute',
  },
  dropdownItem: {
    paddingHorizontal: pageInnerHorizontalPadding - 5,
    paddingVertical: pageInnerHorizontalPadding / 2,
  },
  error: {
    color: 'red',
    position: 'relative',
    marginTop: 3,
    marginBottom: 10,
    lineHeight: 17,
  },
});

export default global;
