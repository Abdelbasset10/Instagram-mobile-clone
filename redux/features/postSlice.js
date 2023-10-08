import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const fetchAllPosts = createAsyncThunk(
  'fetchAllPosts/post',
  async () => {
    try {
      const postsData = await firestore().collection('posts').get();
      const fetchedPosts = postsData.docs;
      let realData = [];
      fetchedPosts.forEach(post => {
        realData = [
          ...realData,
          {
            comments: post?._data.comments,
            creator: post?._data.creator,
            desc: post?._data.desc,
            picture: post?._data.picture,
            hideLike: post?._data.hideLike,
            id: post?._data.id,
            likes: post?._data.likes,
            offComments: post?._data.offComments,
          },
        ];
      });
      const data = realData;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
);

const postSlice = createSlice({
  name: 'post',
  initialState: {
    isLoading: false,
    error: '',
    posts: [],
    postId: null,
  },
  reducers: {
    updatePostId: (state, action) => {
      state.postId = action.payload;
    },
  },
  extraReducers: {
    [fetchAllPosts.pending]: (state, action) => {
      state.isLoading = true;
    },
    [fetchAllPosts.fulfilled]: (state, action) => {
      state.posts = action.payload;
      state.isLoading = false;
    },
    [fetchAllPosts.rejected]: (state, action) => {
      state.error = action.payload.message;
      state.isLoading = false;
    },
  },
});

export const {updatePostId} = postSlice.actions;

export default postSlice.reducer;
