import http from '../config/httpConfig'

const searchUserList = (pageSize, currentPage, userAdminName, roleId, userAdminStatus) => http.post(`/useradmin/query`, {
    pageSize, currentPage, userAdminName, roleId, userAdminStatus
})

const searchDownRoleList = () => http.get('/useradmin/queryUserNoAuthRoles')

const addUserInfo = (userAdminName, userAdminEmail, userAdminMobile, roleIds) => http.post('/useradmin/add', {
    userAdminName, userAdminEmail, userAdminMobile, roleIds
})

const updateUserInfo = (userAdminId, userAdminName, userAdminEmail, userAdminMobile, roleIds) => http.post('/useradmin/modifyUserAdmin', {
    userAdminId, userAdminName, userAdminEmail, userAdminMobile, roleIds
})

const deleteUserInfo = (userIds) => http.post('/useradmin/delUserAdmin', {userIds})

const updateUserState = (userAdminId, userAdminStatus) => http.post('/useradmin/setUserAdminStatus', {
    userAdminId, userAdminStatus
})

const resetUserPwd = (userAdminId) => http.post('/useradmin/resetAdminPwd', {userAdminId})

const searchRoleList = () => http.get('/user/rolelist', {mock: true})

const searchMenuList = () => http.get('/user/menu', {mock: true})

const authorizedUserList = () => http.get('/user/authorizedUserlist', {mock: true})

export default {
    searchUserList,
    searchDownRoleList,
    addUserInfo,
    updateUserInfo,
    deleteUserInfo,
    updateUserState,
    resetUserPwd,
    searchRoleList,
    searchMenuList,
    authorizedUserList
}