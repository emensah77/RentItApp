import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  content: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 13,
    overflow: 'hidden',
    // box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.16);
  },
  roomImageBox: {
    height: 180,
    padding: 8,
  },
  tagInfo: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  tagInfoText: {
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 16,
    color: '#252525',
  },
  roomInfoBox: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  name: {
    fontWeight: 700,
    fontSize: 26,
    lineHeight: 32,
    color: '#000000',
    marginBottom: 8,
  },
  infoText: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 18,
    color: '#000000',
  },
  roomInfoBoxBottom: {
    flexDirection: 'row',
  },
  dateBox: {
    width: 80,
    paddingRight: 24,
    borderRightWidth: 1,
    borderColor: '#DEDEDE',
  },
  placeBox: {
    paddingLeft: 16,
    justifyContent: 'center',
  },
  date: {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 5,
  },
  year: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
  },
  city: {
    fontWeight: 500,
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    marginBottom: 5,
  },
  country: {
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
  },
});
