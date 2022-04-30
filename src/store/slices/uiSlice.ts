import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UiData = {
    showBetaMsg: boolean;
}

const initialState: UiData = {
    showBetaMsg: true
}

export const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setShowBetaMsg: (state, action: PayloadAction<boolean>) => {
            state.showBetaMsg = action.payload;
        }
    }
})

export const { setShowBetaMsg } = uiSlice.actions;
export default uiSlice.reducer;