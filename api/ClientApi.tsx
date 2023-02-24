import { create } from "apisauce";

const apiClient = create({
    baseURL: 'http://10.0.0.21:3000',
    headers: { Accept: 'application/vnd.github.v3+json' },
})

export default apiClient