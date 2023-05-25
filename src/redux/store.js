import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  user: userSlice,
});

// eslint-disable-next-line import/prefer-default-export
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({}),
});
