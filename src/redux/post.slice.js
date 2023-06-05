/* eslint no-param-reassign: 0 */

import {createSlice} from '@reduxjs/toolkit';
import {fetchPost_req} from '../api/posts.api';

const initialState = {
  isLoading: false,
  data: null,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setPost: (state, action) => {
      state.data = action.payload;
    },
    clearPost: () => {
      return initialState;
    },
  },
});

export function getPost(id) {
  return async dispatch => {
    try {
      dispatch(setLoading(true));
      dispatch(setPost(await fetchPost_req(id)));
      dispatch(setLoading(false));
    } catch (error) {
      console.error('getPost Error:', error);
    }
  };
}

export const postSelectors = {
  selectPost: state => state?.post.data,
  selectPostIsLoading: state => state.post.isLoading,
};

export const {setPost, setLoading} = postSlice.actions;

export default postSlice.reducer;
