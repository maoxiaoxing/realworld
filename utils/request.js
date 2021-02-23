import axios from 'axios'

// 创建请求对象
export const request = axios.create({
  baseURL: 'http://realworld.api.fed.lagounews.com'
})
