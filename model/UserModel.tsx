import UserApi from '../api/UserApi'

const getUserById = async (userId: String) => {
    const res = await UserApi.getUserById(userId)
    return res
}

const putUserById = async (userId: String, data: any) => {
    console.log("in put model")
    const res = await UserApi.putUserById(userId, data)
    return res
}

export default { getUserById, putUserById }