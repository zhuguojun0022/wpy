import http from '../config/httpConfig'

const searchUserList = () => http.get('/user/userlist', {mock: true})

const searchMenuList = () => http.get('/user/menu', {mock: true})

export default {
    searchUserList,
    searchMenuList
}