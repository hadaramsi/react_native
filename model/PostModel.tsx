import apiClient from "../api/ClientApi"
import PostApi from "../api/PostApi"
import FormData from "form-data"

export type Post = {
    id: String,
    sender: String,
    message: String,
    imageUrl: String,
}

const getAllPosts = async () => {
    console.log("get All posts")
    const res: any = await PostApi.getAllPost()
    let data = Array<Post>()
    if (res.data) {
        res.data.forEach((obj: any) => {
            const st: Post = {
                id: obj._id,
                message: obj.message,
                sender: obj.sender,
                imageUrl: obj.imageUrl
            }
            data.push(st)
        });
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
export default { getAllPosts, addPost, uploadImage }