import {createNavigationContainerRef} from '@react-navigation/native';

export default class NavigationService {
  static ref = createNavigationContainerRef();

  static navigate = (name, params) => {
    if (this.ref.isReady()) {
      this.ref.navigate(name, params);
    }
  };

  static goBack = () => {
    if (this.ref.isReady()) {
      this.ref.goBack();
    }
  };
}
