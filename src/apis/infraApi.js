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

export default {
    test,
    login,
    getMenu,
    getLoginInfo,
    changePwd,
    dapingAll,
    dapingMoth,
    dapingCity,
    dapingChannel,
    dapingAllCity
}