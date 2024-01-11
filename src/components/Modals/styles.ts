import {colors} from '@assets/styles';
import {StyleSheet, Dimensions} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  modalContainer: {
    height: '80%',
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: colors.palette.textInverse,
    borderTopLeftRadius: 26,
    overFlow: 'hidden',
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    flexDirection: 'row',
    background: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 12,
    paddingHorizontal: wp(4.1),
    height: wp(15.8),
    alignItems: 'center',
    paddingLeft: wp(13),
  },

  main: {
    container: {},
    monthContainer: {},
    weekContainer: {},
    monthNameText: {
      fontWeight: 'bold',
    },
    dayNameText: {},
    dayText: {},
    dayTextColor: 'black',
    holidayColor: 'black',
    todayColor: 'black',
    disabledTextColor: '#B0B0B0',
    selectedDayTextColor: 'white',
    selectedDayBackgroundColor: colors.palette.primary,
    selectedBetweenDayTextColor: '#000',
    selectedBetweenDayBackgroundTextColor: '#F2F2F2',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: colors.palette.textInverse,
    height: 70,
    paddingHorizontal: 25,
  },

  btn: {
    backgroundColor: colors.palette.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },

  videoLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  video: {
    width: Dimensions.get('window').width - 10,
    height: Dimensions.get('window').height,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  form: {
    flex: 1,
  },
  headerTitle: {
    textAlign: 'left',
    padding: 10,
    color: colors.palette.primary,
  },

  subscriptionModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 0,
    width: Dimensions.get('window').width * 0.8,
  },
  subscriptionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subscriptionDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'red',
  },
  benefitContainer: {
    marginBottom: 20,
    width: '100%',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: '100%',
  },
  benefitIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  benefitText: {
    fontSize: 16,
    flex: 1, // Allows text to wrap and fill available space
    flexWrap: 'wrap', // Wrap text to next line if needed
  },
  subscriptionPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    paddingVertical: 10,
  },
  fullWidthScrollView: {
    flex: 1, // Make ScrollView flex to fill the space
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center', // Centers content when less than screen height
  },
});

export default styles;
