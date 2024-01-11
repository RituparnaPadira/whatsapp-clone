import {baseUrl} from "../constants/constants";
import {sendRequest} from "./ApiUtils";

const token = "Bearer "+localStorage.getItem("token")
const headers = {
    "Authorization": token,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}
export const getUserDetailsApi = async () => {
    let url = baseUrl+"/api/user/get"
    return sendRequest(url, 'GET', headers, null)
}

export const searchUsersApi = async (query) => {
    let url = baseUrl+'/api/user/search/'+query
    return sendRequest(url, 'GET', headers, null)
}

export const getAllUsersInfoApi = async () => {
    let url = baseUrl+'/api/user/get/all'
    return sendRequest(url, 'GET', headers, null)
}

export const updateUser = async (attribute, value) => {
    let url = baseUrl+"/api/user/update";
    let body = {
        attribute: attribute,
        value: value
    };
    console.log("User update request", body)
    return sendRequest(url, 'POST', headers, JSON.stringify(body))
}