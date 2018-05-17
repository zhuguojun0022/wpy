import http from '../config/httpConfig'

function searchUserList () {
    return http.get('/user/userlist', {mock: true})
}

export default {
    searchUserList
}