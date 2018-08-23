import http from '../config/httpConfig'
// import qs from 'qs'

const mock = false

// 获取错误日志接口
const oldReqLogs = (params) => http.post('/security/errorlog/all', params, {mock: mock})

export default {
    oldReqLogs
}