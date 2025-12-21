// src/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
    token: string | null;
};

const initialState: AuthState = {
    token: localStorage.getItem("token"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        clearToken(state) {
            state.token = null;
            localStorage.removeItem("token");
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;