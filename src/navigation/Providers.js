import React from 'react';

import {Host} from 'react-native-portalize';
import {AuthProvider} from './AuthProvider';
import Router from './Router';

const Providers = () => (
  <AuthProvider>
    <Host>
      <Router />
    </Host>
  </AuthProvider>
);

export default Providers;
