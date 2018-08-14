import http from '../config/httpConfig'
// import qs from 'qs'

const mock = false

// 获取已订阅API详细信息（编辑专用）
const reqLogs = (params) => http.get('/security/v1/config', params, {mock: mock})

export default {
    reqLogs
}