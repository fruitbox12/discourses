import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import meetReducer from "./slices/meetSlice";
import uiReducer from "./slices/uiSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistUserConfig = {
    key: "user",
    storage
}

const persisMeetConfig = {
    key: "meet",
    storage
}

const persistUiConfig = {
    key: "ui",
    storage
}

const persistedUserReducer = persistReducer(persistUserConfig, userReducer);
const persistedMeetReducer = persistReducer(persisMeetConfig, meetReducer);
const persistedUiReducer = persistReducer(persistUiConfig, uiReducer);

const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        meet: persistedMeetReducer,
        ui: persistedUiReducer
    }
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;