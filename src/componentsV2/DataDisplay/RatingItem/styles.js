import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingProgressBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingProgressContent: {
    height: 4,
    width: 146,
    backgroundColor: '#DEDEDE',
    borderRadius: 40,
    marginRight: 8,
  },
  ratingProgress: {
    width: 120,
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 40,
  },
});
