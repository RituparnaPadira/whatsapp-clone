import {baseUrl} from "../constants/constants";
import {sendRequest} from "./ApiUtils";

const token = "Bearer "+localStorage.getItem("token")
const headers = {
    "Authorization": token,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

export const getAllMessagesApi = async (chatId) => {
    const url = baseUrl+"/api/message/get/all/"+chatId;
    return sendRequest(url, 'GET', headers, null)
}

export const createMessageApi = async (chatId, content) => {
    const url = baseUrl+"/api/message/create/"+chatId;
    return sendRequest(url, 'POST', headers, content.toString())
}