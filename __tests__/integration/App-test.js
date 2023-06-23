/**
 * @format
 */

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import App from '../../App';

beforeAll(() => {
  jest.useFakeTimers();
});

it('Renders Correctly', () => {
  renderer.create(<App />);
});
