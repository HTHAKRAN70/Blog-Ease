import {createSlice} from '@reduxjs/toolkit';
const initialState={
    currentUser:null,
    error:null,
    Loading:false,
};
const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInstart:(state)=>{
            state.Loading=true;
            state.error=null;
        },
        signInsuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.Loading=false;
            state.error=null;
        },
        signInfailure:(state,action)=>{
            state.Loading=false;
            state.error=action.payload;
        },
        updateStart:(state,action)=>{
            state.Loading=false;
            state.error=action.payload;
        },
        updateSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.Loading=false;
            state.error=false;
        },
        updateFailure:(state,action)=>{
            state.Loading=false;
            state.error=action.payload;
        },
        deleteuserStart:(state,action)=>{
            state.Loading=false;
            state.error=action.payload;
        },
        deleteuserSuccess:(state,action)=>{
           state.currentUser=null;
           state.Loading=false;
           state.error=false; 
        },
        deleteuserFailure:(state,action)=>{
            state.Loading=false;
            state.error=action.payload;
        },
        signoutSuccess:(state,action)=>{
            state.currentUser=null;
            state.Loading=false;
            state.error=null;
        }
    },
});
export const {signoutSuccess,deleteuserStart,deleteuserSuccess,deleteuserFailure,signInfailure,signInstart,signInsuccess,updateStart,updateFailure,updateSuccess}=userSlice.actions;
export default userSlice.reducer;
