import http from '../config/httpConfig'

function getImgVCode () {
    return http.get('/validateCode/common', {mock: true})
}

const login = function (username, passwd, codeId = '', code = '') {
    return http.post('/login/passwd', {
        username,
        passwd,
        codeId,
        code
    }, {mock: true})
}

const getMenu = function () {
    return http.get('/menu', {mock: true})
}

const getLoginInfo = function () {
    return http.get('/getLoginInfo', {mock: true})
}

export default {
    getImgVCode,
    login,
    getMenu,
    getLoginInfo
}