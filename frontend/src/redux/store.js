import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./slice/UserSlice";
import chatSlice from "./slice/ChatSlice";
import messageSlice from "./slice/MessageSlice";

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        chats: chatSlice.reducer,
        messages: messageSlice.reducer
    }
})

export default store