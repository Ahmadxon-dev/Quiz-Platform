import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email:null,
    name:null,
    role:null,
    counterValue: 0,
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
        },
        logout: (state) =>{
            state.email = null
            state.name = null
            state.role = null
            localStorage.clear()
        }
    },
});

export const { increment, setUser, logout } = userSlice.actions;

export default userSlice.reducer;