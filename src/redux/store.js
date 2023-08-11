import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import postSliceReducer from './post.slice';

const rootReducer = combineReducers({
  post: postSliceReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({}),
});
