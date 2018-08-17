import http from '../config/httpConfig'

// 获取服务组列表信息 【开启】
const getOpenServiceGroupList = (removed) => http.get(`/serviceGroup?removed=${removed}`, {mock: false})
// 获取服务组列表 【关闭关闭数目】
const getClosedServiceGroupNum = () => http.get('/serviceGroup/remove', {mock: false})
// 新增服务组
const addServiceGroup = (param) => http.post('/serviceGroup', param, {mock: false})
// 更新服务组
const updateServiceGroup = (param) => http.put('/serviceGroup', param, {mock: false})
// 删除服务组
const deleteServiceGroup = (id) => http.post(`/serviceGroup/remove`, {id}, {mock: false})
// 获取API列表信息 【开启】
const getOpenAPIList = (groupId, removed) => http.post('/security/api/group', {groupId, removed}, {mock: false})
// 获取API列表信息 【关闭数】
const getClosedAPIListNum = (groupId, removed) => http.post('/security/api/group/apiCount', {groupId, removed}, {mock: false})
// 获取具体API信息
const getAPIInfo = (id) => http.get(`/security/api/${id}`, {mock: false})
// 新增API
const addAPI = (param) => http.post('/security/api/add', param, {mock: false})
// 更新API
const updateAPI = (param) => http.put('/security/api/update', param, {mock: false})
// 删除API 【同状态修改接口】
const deleteAPI = (id, lifecycle) => http.get(`/security/api/switch?id=${id}&lifecycle=${lifecycle}`, {mock: false})
// 修改API状态
const updateAPIStatus = (id, lifecycle) => http.get(`/security/api/switch?id=${id}&lifecycle=${lifecycle}`, {mock: false})
// 获取该api的订阅信息
const getOrderListByApiId = (id) => http.get(`/security/subscription/api/${id}`, {mock: false})

export default {
    getOpenServiceGroupList,
    getClosedServiceGroupNum,
    addServiceGroup,
    updateServiceGroup,
    deleteServiceGroup,
    getOpenAPIList,
    getClosedAPIListNum,
    getAPIInfo,
    addAPI,
    updateAPI,
    deleteAPI,
    updateAPIStatus,
    getOrderListByApiId
}