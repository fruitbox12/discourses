import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type MeetData = {
    propId: number;
    dId: string;
    token: string;
    timeStamp: string;
}

const initialState: MeetData = {
    propId: 0,
    dId: "",
    token: "",
    timeStamp: ""
}

export const meetSlice = createSlice({
    name: "meet",
    initialState,
    reducers: {
        setMeet: (state, action: PayloadAction<MeetData>) => {
            state.propId = action.payload.propId;
            state.dId = action.payload.dId;
            state.token = action.payload.token;
            state.timeStamp = action.payload.timeStamp;
        },
        clearMeet: (state) => {
            state.propId = 0;
            state.dId = "";
            state.token = "";
            state.timeStamp = "";
        }
    }
})

export const { setMeet, clearMeet } = meetSlice.actions;
export default meetSlice.reducer;