import {baseUrl} from "../constants/constants";
import {sendRequest} from "./ApiUtils";


const headers = {
    'Accept': 'application/json',
        'Content-Type': 'application/json'
}

export const loginApi = async (email, password) => {
    let url = baseUrl+'/auth/login'
    let body = JSON.stringify({
        email: email,
        password: password
    })
    return await sendRequest(url, 'POST', headers, body)
}

export const signupApi = async (fullName, email, password) => {
    let url = baseUrl+'/auth/signup'
    let body = JSON.stringify({
        fullName: fullName,
        email: email,
        password: password,
        userType: "GENERAL"
    })
    return await sendRequest(url, 'POST', headers, body)
}