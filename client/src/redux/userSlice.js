import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user", // name of slice
  initialState: {
    userData: null,
    otherUsers: null,
    selectedUsers:null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUsers : (state,action) => {
      state.selectedUsers=action.payload
    }
  },
});

export const { setUserData, setOtherUsers , setSelectedUsers } = userSlice.actions;
export default userSlice.reducer;
