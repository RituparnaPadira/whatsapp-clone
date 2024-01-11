import {baseUrl} from "../constants/constants";
import {sendRequest} from "./ApiUtils";

const token = "Bearer "+localStorage.getItem("token")
const headers = {
    "Authorization": token,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

export const getAllChatsInfoApi = async () => {
    let url = baseUrl + "/api/chat/get-all/user"
    return sendRequest(url, 'GET', headers, null)
}

export const createChatApi = async ( chatType, memberIds, groupName, groupImage) => {
    let url = baseUrl + "/api/chat/create"
    let body = JSON.stringify({
        type: chatType,
        memberIds: memberIds,
        groupName: groupName,
        groupImage: groupImage
    })
    return sendRequest(url, 'POST', headers, body)
}


export const getOrCreateChatApi = async (userId) => {
    let url = baseUrl+'/api/chat/get-or-create/'+userId
    try {
        let options = {
            headers: headers,
            method: 'GET'
        }
        const res = await fetch(url, options)
        console.log("res", res)
        const status = res.status
        const data = await res.json()
        console.log("data", data)
        if(data.status === 500) {
            return new Promise((resolve, reject) => {
                reject("Internal server error. Please try again later!");
            });
        }
        return {data: data, status: status}
    } catch(err) {
        console.log(err)
        return new Promise((resolve, reject) => {
            reject("Cannot connect. Check your network or try again later!");
        });
    }
}