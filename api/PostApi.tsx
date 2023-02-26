import apiClient from "./ClientApi"
import { Post } from "../model/PostModel"

const getAllPost = async () => {
    return apiClient.get("/post")
}
const getUserPost = async () => {
    return apiClient.get("/post")
}

const addPost = async (userJson: any) => {
    return apiClient.post("/post", userJson)
}

const uploadImage = async (image: any) => {
    return apiClient.post("/file/file", image)
}

export default { getAllPost, addPost, uploadImage, getUserPost }
