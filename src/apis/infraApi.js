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
    return http.get('/user/menu', {mock: true})
}

const getLoginInfo = function () {
    return http.get('/getLoginInfo', {mock: mock})
}

export default {
    test,
    login,
    getMenu,
    getLoginInfo
}