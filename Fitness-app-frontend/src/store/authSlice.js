import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        userId: null,
        isInitialized: false,
//        user: JSON.parse(localStorage.getItem('user')) || null,
//        token: localStorage.getItem('token') || null,
//        userId: localStorage.getItem('userId') || null
    },
    reducers: {
      setCredentials: (state, action) =>{
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
       // state.userId = action.payload.userId;
        state.userId = action.payload.user?.sub || null;

//        localStorage.setItem('token', action.payload.token);
//        localStorage.setItem('user', JSON.stringify(action.payload.user));
//        localStorage.setItem('userId', action.payload.user.sub);
      },

      setInitialized: (state) => {
            state.isInitialized = true;
          },
      logout: (state) =>{
        state.user=null;
        state.token=null;
        state.userId=null;
        localStorage.removeItem('token');
//        localStorage.removeItem('user');
//        localStorage.removeItem('userId');

//        document.cookie.split(";").forEach((cookie) => {
//          document.cookie =
//            cookie.trim().split("=")[0] +
//            "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
//        });

      },
      

    },
  });
  
 
  
  export const { setCredentials,setInitialized, logout } = authSlice.actions;
  export default authSlice.reducer;
  