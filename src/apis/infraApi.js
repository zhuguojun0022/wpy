import http from '../config/httpConfig'
const mock = false

function test (userAdminName) {
    return http.post(`/useradmin/query`, {
        userAdminName
    })
}

const login = function (username, password, cid = '', code = '') {
    return http.post('/auth/login', {
        username,
        password,
        cid,
        code
    }, {mock: mock})
}

const getMenu = function () {
    return http.get('/menu/myTree')
}
const dapingAll = (aab301) => http.post('/count/all?aab301=' + aab301, {mock: mock})
const dapingMoth = (aab301) => http.post('/count/month?aab301=' + aab301, {mock: mock})
const dapingCity = (aab301) => http.post('/count/top5city?aab301=' + aab301, {mock: mock})
const dapingChannel = (aab301) => http.post('/count/channel?aab301=' + aab301, {mock: mock})
const dapingAllCity = (aab301) => http.post('/count/city?aab301=' + aab301, {mock: mock})
const getLoginInfo = function () {
    return http.get('/getLoginInfo', {mock: mock})
}

const changePwd = function (userAdminId, userAdminPwdOld, userAdminPwd) {
    return http.post('/useradmin/setAdminPwd', {
        userAdminId,
        userAdminPwdOld,
        userAdminPwd
    }, {
        mock: mock
    })
}

const getInquire = function () {
    return http.post('/geoCoord/getProvince')
}

const getCity = function (regionNo) {
    return http.post('/geoCoord/getCity?regionNo=' + regionNo, {mock: mock})
}

const Save = function (regionId, regionProvince, regionName, longitude, latitude, createUserNo) {
    return http.post('/geoCoord/insert', {
        regionId,
        regionProvince,
        regionName,
        longitude,
        latitude,
        createUserNo
    }, {
        mock: mock
    })
}

const getList = function () {
    return http.post('/geoCoord/query')
}

const Delete = function (regionId) {
    return http.post('/geoCoord/delete?regionId=' + regionId, {mock: mock})
}

const Change = function (regionId, longitude, latitude, createUserNo) {
    return http.post('/geoCoord/update', {
        regionId,
        longitude,
        latitude,
        createUserNo
    }, {
        mock: mock
    })
}
export default {
    test,
    login,
    getMenu,
    getLoginInfo,
    changePwd,
    getInquire,
    getCity,
    Save,
    getList,
    Delete,
    Change,
    dapingAll,
    dapingMoth,
    dapingCity,
    dapingChannel,
    dapingAllCity

}