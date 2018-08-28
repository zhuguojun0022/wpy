import http from '../config/httpConfig'
// import qs from 'qs'

const mock = false

// 获取错误日志接口
const oldReqLogs = (params) => http.post('/security/errorlog/all', params, {mock: mock})
// 错误状态码
const errorCode = () => http.get('/security/errorlog/codes')

export default {
    oldReqLogs,
    errorCode
}