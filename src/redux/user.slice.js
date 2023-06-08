/* eslint no-param-reassign: 0 */

import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
    clearUser: () => {
      return initialState;
    },
  },
});

export function getUser() {
  return async dispatch => {
    try {
      dispatch(setUser({}));
    } catch (error) {
      console.error('getUser Error:', error);
    }
  };
}

export const userSelectors = {
  selectUser: state => state?.data,
};

export const {setUser, clearUser} = userSlice.actions;
