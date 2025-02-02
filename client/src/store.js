import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import testSlice from "./features/test/testSlice";

const store = configureStore({
    reducer: {
        test: testSlice,
        user: userSlice,
    },
    devTools: true,
});

export default store;
