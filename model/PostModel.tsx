import PostApi from "../api/PostApi"
import FormData from "form-data"
import UserModel from "./UserModel"

export type Post = {
    id: String,
    sender: String,
    message: String,
    imageUrl: String,
    userImageUrl: String
}

const getAllPosts = async () => {
    console.log("get All posts")
    const res: any = await PostApi.getAllPosts()
    let data = Array<Post>()
    console.log(res.data)
    if (res.data) {
        for (let i = 0; i < res.data.post.length; i++) {
            const user = await UserModel.getUserById(res.data.post[i].sender)
            const st: Post = {
                id: res.data.post[i]._id,
                message: res.data.post[i].message,
                sender: user.fullName,
                imageUrl: res.data.post[i].imageUrl,
                userImageUrl: user.image

            }
            data.push(st)
        }
    }
    return data
}
const getUserPosts = async (userId: String) => {
    console.log("get user posts")
    const res: any = await PostApi.getUserPost(userId)
    let data = Array<Post>()
    if (res.data) {
        for (let i = 0; i < res.data.post.length; i++) {
            const user = await UserModel.getUserById(res.data.post[i].sender)
            const st: Post = {
                id: res.data.post[i]._id,
                message: res.data.post[i].message,
                sender: user.fullName,
                imageUrl: res.data.post[i].imageUrl,
                userImageUrl: user.image
            }
            data.push(st)
        }
    }
    return data
}

const addPost = async (post: any) => {
    console.log("add post")
    const data = {
        message: post.message,
        sender: post.sender,
        imageUrl: post.imageUrl
    }
    try {
        const res = PostApi.addPost(data)
    } catch (err) {
        console.log("add post fail: " + err)
    }
}
const deletePost = async (postId: String) => {
    console.log("delete post")

    try {
        const res = PostApi.deletePost(postId)
    } catch (err) {
        console.log("add post fail: " + err)
    }
}
const getPostById = async (postId: String) => {
    const res = await PostApi.getPostById(postId)
    return res
}

const uploadImage = async (imageURI: String) => {
    var body = new FormData();
    body.append('file', { name: "name", type: 'image/jpeg', uri: imageURI });
    try {
        const res = await PostApi.uploadImage(body)
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
export default { getAllPosts, addPost, getUserPosts, uploadImage, deletePost, getPostById }