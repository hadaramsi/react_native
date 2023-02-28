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
    console.log("in getUserPost" + res.status)

    if (res.status == 401) {
        console.log("in 401 - getUserPost")
        await AuthModel.refreshToken()
        return ClientApi.get("/post")
    }
    return res
}
const getPostById = async (postId: String) => {
    let res: any = await ClientApi.get("/post/" + postId)
    if (res.status == 401) {
        await AuthModel.refreshToken()
        res = await ClientApi.get("/post/" + postId)
    }
    return res.data
}

const deletePost = async (postId: String) => {
    const res: any = await ClientApi.get("/post?=_id" + postId)
    console.log("in delete Post post Api" + res.status)

    if (res.status == 401) {
        console.log("in 401 - getUserPost")
        await AuthModel.refreshToken()
    }
    return
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

export default { getAllPosts, addPost, uploadImage, getUserPost, deletePost, getPostById }
