import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import mixpanel from '../../src/MixpanelConfig';

const useDwellTimeTracking = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const trackDwellTime = useCallback(() => {
    let startTime = {};

    const focusHandler = () => {
      const screenName = route.name;
      startTime[screenName] = new Date();
    };

    const blurHandler = () => {
      const screenName = route.name;
      const endTime = new Date();
      const dwellTime = endTime - startTime[screenName];

      mixpanel.track(`Screen Dwell Time - ${screenName}`, {
        screenName,
        dwellTime,
      });
    };

    const unsubscribeFocus = navigation.addListener('focus', focusHandler);
    const unsubscribeBlur = navigation.addListener('blur', blurHandler);

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, route]);

  return { trackDwellTime };
};

export default useDwellTimeTracking;
