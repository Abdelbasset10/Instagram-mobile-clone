import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
  },
  reducers: {
    addUser: (state, action) => {
      state.userData = action.payload;
    },
    logOut: state => {
      state.userData = null;
    },
  },
  extraReducers: {},
});

export const {addUser, logOut} = userSlice.actions;

export default userSlice.reducer;
