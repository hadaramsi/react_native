import AuthApi from "../api/AuthApi"

export type Login = {
    userName: String,
    password: String,
}
export type Register = {
    userName: String,
    password: String,
}

const loginUser = async (login: Login) => {
    console.log("login user")
    const data = {
        message: login.userName,
        sender: login.password
    }
    try {
        const res: any = await AuthApi.login(data)
        return res.data
    } catch (err) {
        console.log("fail to login: " + err)
    }
    return null
}

const RegisterUser = async (register: Register) => {
    console.log("register user")
    const data = {
        message: register.userName,
        sender: register.password
    }
    try {
        const res: any = await AuthApi.register(data)
        return res.data
    } catch (err) {
        console.log("fail to register: " + err)
    }
    return null
}
export default { loginUser, RegisterUser }