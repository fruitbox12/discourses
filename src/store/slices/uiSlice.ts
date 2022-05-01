import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UiData = {
    showBetaMsg: boolean;
    wrongChain: boolean;
}

const initialState: UiData = {
    showBetaMsg: true,
    wrongChain: false
}

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setShowBetaMsg: (state, action: PayloadAction<boolean>) => {
            state.showBetaMsg = action.payload;
        },
        setWrongChain: (state, action: PayloadAction<boolean>) => {
            state.wrongChain = action.payload;
        }
    }
})

export const { setShowBetaMsg, setWrongChain } = uiSlice.actions;
export default uiSlice.reducer;