import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email:null,
    name:null,
    role:null,
    _id:null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        increment: (state) => {
            state.counterValue += 1;
        },
        setUser:(state, action)=>{
            state.email = action.payload.email
            state.role = action.payload.role
            state.name = action.payload.name
            state._id = action.payload._id
        },
        logout: (state) =>{
            state.email = null
            state.name = null
            state.role = null
            state._id = null
            localStorage.clear()
        }
    },
});

export const { increment, setUser, logout } = userSlice.actions;

export default userSlice.reducer;