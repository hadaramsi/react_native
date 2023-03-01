import apiClient from "./ClientApi"

const login = async (loginJson: any) => {
    return apiClient.post("/auth/login", loginJson)
}

const register = async (registerJson: any) => {
    console.log("help meeeee")

    return apiClient.post("/auth/register", registerJson)
}

const refresh = async () => {
    return apiClient.get("/auth/refresh")
}
const uploadImage = async (image: any) => {
    return apiClient.post("/file/file", image)
}
const logout = async () => {
    return apiClient.get("/auth/logout")
}

export default { login, register, refresh, uploadImage, logout }