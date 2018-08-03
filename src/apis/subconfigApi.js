import http from '../config/httpConfig'
import qs from 'qs'

const mock = false

// 获取指定应用的已订阅CALLER
const getSub = () => http.get('/security/v1/subs')
// 获取指定应用的未订阅CALLER
const getNoSub = () => http.get('/security/v1/notsubs')
// 新增指定应用的调用者
const addSub = (params) => http.post('/security/v1/sub', params, {mock: mock})
// 获取已订阅API
const getOrderApi = (params) => http.get('/security/v1/configs/caller?' + qs.stringify(params), {mock: mock})
// 启用API订阅
const updateStatusOrderedAPI = (params) => http.put('/security/v1/config/status', params)

export default {
    getSub,
    getNoSub,
    addSub,
    getOrderApi,
    updateStatusOrderedAPI
}