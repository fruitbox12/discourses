import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserData = {
    username: string;
    walletAddress: string;
    token: string;
    expiresAt: string;
    isLoggedIn: boolean;
    tConnected: boolean;
    t_handle: string;
    t_name: string;
    t_id: string;
    t_img: string;
}

type TwitterSliceData = {
    tConnected: boolean;
    t_handle: string;
    t_name: string;
    t_id: string;
    t_img: string;
}

const initialState : UserData = {
    username: "",
    walletAddress: "",
    token: "",
    expiresAt: "",
    isLoggedIn: false,
    tConnected: false,
    t_handle: "",
    t_name: "",
    t_id: "",
    t_img: ""
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserData>) => {
            state.username = action.payload.username;
            state.walletAddress = action.payload.walletAddress;
            state.token = action.payload.token;
            const date = new Date().setHours(new Date().getHours() + 1);
            state.expiresAt = new Date(date).toISOString();
            state.isLoggedIn = action.payload.isLoggedIn;
            state.tConnected = action.payload.tConnected;
            state.t_handle = action.payload.t_handle;
            state.t_name = action.payload.t_name;
            state.t_id = action.payload.t_id;
            state.t_img = action.payload.t_img;
        },
        clearUser: (state) => {
            state.username = "";
            state.walletAddress = "";
            state.token = "";
            state.expiresAt = "";
            state.isLoggedIn = false;
            state.tConnected = false;
            state.t_handle = "";
            state.t_name = "";
            state.t_id = "";
            state.t_img = "";
        },
        updateToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        updateTwitter: (state, action: PayloadAction<TwitterSliceData>) => {
            state.tConnected = action.payload.tConnected ? true : false;
            state.t_handle = action.payload.t_handle ? action.payload.t_handle : "";
            state.t_name = action.payload.t_name ? action.payload.t_name : "";
            state.t_id = action.payload.t_id ? action.payload.t_id : "";
            state.t_img = action.payload.t_img? action.payload.t_img : "";
        }
    }
})

export const { setUser, clearUser, updateToken, updateTwitter } = userSlice.actions;
export default userSlice.reducer;