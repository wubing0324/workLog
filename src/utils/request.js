import axios from 'axios'
import { Notify } from 'vant'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // 请求超时时间
  withCredentials: true
})

// service.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
// service.defaults.withCredentials = true
// request拦截器
service.interceptors.request.use(
  config => {
    config.headers.token = localStorage.token
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * success 为非true 是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 'success') {
      Notify({ type: 'danger', message: res.message })
      return Promise.reject(new Error(res.message))
    } else {
      return response.data
    }
  },
  error => {
    Notify({ type: 'danger', message: error.message })
    return Promise.reject(error)
  }
)

export default service
