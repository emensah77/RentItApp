import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import postSlice from './post.slice';

const rootReducer = combineReducers({
  post: postSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({}),
});
