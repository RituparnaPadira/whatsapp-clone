import {createSlice} from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chatSlice",
    initialState: [],
    reducers: {
        addChat(state, action) {
            state.push(action.payload)
        },
        setAllChats(state, action) {
            return action.payload
        }
    }
})


export default chatSlice