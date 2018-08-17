import http from '../config/httpConfig'
// import qs from 'qs'

const mock = false

// 获取已订阅API详细信息（编辑专用）
const reqLogs = (params) => http.get('/security/v1/config', params, {mock: mock})
// 获取状态码路径
const getCodeList = () => http.get('/security/v1/respCode')
//
const oldReqLogs = (params) => http.post('/security/errorlog/all', params, {mock: mock})
// 查询应用接口
const getApp = (params) => http.get('/security/v1/app/all', params, {mock: mock})
// 查询调用者接口
const getfilterCallerList = (params) => http.get('/security/v1/reqLog/filter/caller', params, {mock: mock})
// 查询api下拉列表
const getApiList = (params) => http.get('/security/v1/dashboard/apiInfo', params, {mock: mock})

export default {
    reqLogs,
    getCodeList,
    oldReqLogs,
    getApp,
    getfilterCallerList,
    getApiList
}