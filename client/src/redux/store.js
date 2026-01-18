import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice"
import messageSlice from "./message.Slice"

export const store = configureStore({
    reducer : {
        user : userSlice,
        messages : messageSlice
    }
})