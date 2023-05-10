import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  ml12: {
    marginLeft: 12,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
  },
  title: {
    paddingBottom: 16,
  },
  descriptionContainer: {
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  desRight: {},
  desLeft: {},
  desTitle: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    color: '#252525',
  },
  textUnderline: {
    textDecorationLine: 'underline',
  },
  textNoUnderline: {
    textDecorationLine: 'none',
  },
  desSubTitle: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    color: '#717171',
  },
  starIconOfDes: {
    paddingHorizontal: 4,
  },
  mapButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 52,
    backgroundColor: '#0047B3',
    width: 110,
    alignSelf: 'center',
    alignItems: 'center',
  },

  whiteText: {
    color: '#FFFFFF',
  },
});
