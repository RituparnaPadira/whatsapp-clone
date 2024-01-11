export const sendRequest = async(url, method, headers, body) => {
    try {
        let options = {
            headers: headers,
            method: method
        }
        if(method !== 'GET') {
            options.body = body
        }
        const res = await fetch(url, options)
        const data = await res.json()
        if(data.status === 500) {
            return new Promise((resolve, reject) => {
                reject("Internal server error. Please try again later!");
            });
        }
        return data
    } catch(err) {
        console.log(err)
        return new Promise((resolve, reject) => {
            reject("Cannot connect. Check your network or try again later!");
        });
    }
}

export const uploadToCloudinary = async(image) => {
    const body = new FormData()
    body.append("file", image)
    body.append("upload_preset", "")
    body.append("cloud_name", "")

    const url = ""

    //const data = await sendRequest(url, 'POST', null, body)

    try {
        const res = await fetch(url, {
            method: 'POST',
            body: body
        })
        const data = await res.json()
        if(data.status === 500) {
            return new Promise((resolve, reject) => {
                reject("Internal server error. Please try again later!");
            });
        }
        return data.url.toString()
    } catch(err) {
        console.log(err)
        return new Promise((resolve, reject) => {
            reject("Cannot connect. Check your network or try again later!");
        });
    }
}