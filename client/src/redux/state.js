import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  err: null,
  loading: false,
  listings: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signUpStart: (state) => {
      state.loading = true;
    },
    signUpSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.err = null;
    },
    signUpFailure: (state, action) => {
      state.err = action.payload;
      state.loading = false;
    },
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.err = null;
    },
    signInFailure: (state, action) => {
      state.err = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.err = null;
    },
    updateUserFailure: (state, action) => {
      state.err = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.user = null;
      state.loading = false;
      state.err = null;
    },
    deleteUserFailure: (state, action) => {
      state.err = action.payload;
      state.loading = false;
    },
    signOutUserStart: (state) => {
      state.loading = true;
    },
    signOutUserSuccess: (state) => {
      state.user = null;
      state.loading = false;
      state.err = null;
    },
    signOutUserFailure: (state, action) => {
      state.err = action.payload;
      state.loading = false;
    },
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    setTripList: (state, action) => {
      state.user.tripList = action.payload;
    },
    setWishList: (state, action) => {
      state.user.wishList = action.payload;
    },
    setPropertyList: (state, action) => {
      state.user.propertyList = action.payload;
    },
    setReservationList: (state, action) => {
      state.user.reservationList = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
  setListings,
  setPropertyList,
  setTripList,
  setWishList,
  setReservationList,
} = userSlice.actions;

export default userSlice.reducer;
