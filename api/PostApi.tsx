import ClientApi from "./ClientApi"

import AuthModel from "../model/AuthModel"

const getAllPosts = async () => {
    const res: any = await ClientApi.get("/post");
    console.log("in getAllPosts " + res.status);

    if (res.status == 401) {
        console.log("in 401 - getAllPosts");
        await AuthModel.refreshToken();
        return ClientApi.get("/post");
    }
    return res;
};
const getUserPost = async (userId: String) => {
    // return apiClient.get("/post")
    const res: any = await ClientApi.get("/post?sender=" + userId)
    console.log("in getUserPost" + res.status);

    if (res.status == 401) {
        console.log("in 401 - getUserPost");
        await AuthModel.refreshToken();
        return ClientApi.get("/post");
    }
    return res;
}

const addPost = async (userJson: any) => {
    // return apiClient.post("/post", userJson)
    const res: any = await ClientApi.post("/post", userJson)
    console.log("in addPost" + res.status);

    if (res.status == 401) {
        console.log("in 401 - addPost");
        await AuthModel.refreshToken();
        return ClientApi.get("/post");
    }
    return res;
}

const uploadImage = async (image: any) => {
    return ClientApi.post("/file/file", image)

}

export default { getAllPosts, addPost, uploadImage, getUserPost }
