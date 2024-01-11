import {createSlice} from "@reduxjs/toolkit";
import {updateUser} from "../../api/UserApi";

const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        id: undefined,
        fullName: undefined,
        image: undefined,
        statusText: undefined,
        otherUsersData: undefined,
    },
    reducers: {
        updateUser(state, action) {
            return {...state, ...action.payload}
        }
    }
})

export default userSlice