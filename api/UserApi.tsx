import ClientApi from './ClientApi'
import AuthModel from '../model/AuthModel'

const getUserById = async (userId: String) => {
    let res: any = await ClientApi.get("/user/" + userId)

    if (res.status == 401) {
        await AuthModel.refreshToken()
        res = await ClientApi.get("/user/" + userId)
    }
    return res.data
}

const putUserById = async (userId: String, userDetails: any) => {
    let res: any = await ClientApi.put("/user/" + userId, userDetails)
    if (res.status == 401) {
        await AuthModel.refreshToken()
        res = await ClientApi.put("/user/" + userId, userDetails)
    }
    return res.data
}
export default { getUserById, putUserById }
