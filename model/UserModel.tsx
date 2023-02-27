import UserApi from '../api/UserApi'

const getUserById = async (userId: String) => {
    const res = await UserApi.getUserById(userId)
    return res
}

const putUserById = async (userId: String, userDetails: any) => {
    const res = await UserApi.putUserById(userId, userDetails)
    return res
}

export default { getUserById, putUserById }