import axios from "axios";


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
})

function getToken(){
    return localStorage.getItem('token')
}

axiosInstance.interceptors.request.use((config) => {
    const token = getToken()
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


export default axiosInstance