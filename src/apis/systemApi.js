import http from '../config/httpConfig'

const searchUserList = () => http.get('/user/userlist', {mock: true})

const searchRoleList = () => http.get('/user/rolelist', {mock: true})

const searchMenuList = () => http.get('/user/menu', {mock: true})

const authorizedUserList = () => http.get('/user/authorizedUserlist', {mock: true})

export default {
    searchUserList,
    searchRoleList,
    searchMenuList,
    authorizedUserList
}