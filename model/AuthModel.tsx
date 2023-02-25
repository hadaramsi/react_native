import AuthApi from "../api/AuthApi"
import FormData from "form-data"

export type Login = {
    email: String,
    password: String,
}
export type Register = {
    email: String,
    password: String,
    fullName: String,
    imageUrl: String
}

const loginUser = async (login: Login) => {
    console.log("login user")
    const data = {
        email: login.email,
        password: login.password
    }
    try {
        const res: any = await AuthApi.login(data)
        console.log(res.data)

        return res.data
    } catch (err) {
        console.log("fail to login: " + err)
    }
    return null
}

const RegisterUser = async (register: Register) => {
    console.log("register user")
    const data = {
        email: register.email,
        password: register.password,
        fullName: register.fullName,
        imageUrl: register.imageUrl
    }
    try {
        const res: any = await AuthApi.register(data)
        return res.data
    } catch (err) {
        console.log("fail to register: " + err)
    }
    return null
}
const uploadImage = async (imageURI: String) => {
    var body = new FormData();
    body.append('file', { name: 'name', type: 'image/jpeg', uri: imageURI })
    try {
        const res = await AuthApi.uploadImage(body)
        if (!res.ok) {
            console.log("save failed " + res.problem)
        } else {
            if (res.data) {
                const d: any = res.data
                console.log("----= url:" + d.url)
                return d.url
            }
        }
    } catch (err) {
        console.log("save failed " + err)
    }
    return ""
}
export default { loginUser, RegisterUser, uploadImage }