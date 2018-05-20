import http from '../config/httpConfig'

function searchUserList () {
    return http.get('/user/userlist', {mock: true})
}
function searchRoleList () {
    return http.get('/user/rolelist', {mock: true})
}
export default {
    searchUserList,
    searchRoleList
}