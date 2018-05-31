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

const searchRoleList = (currentPage, pageSize) => http.post('/role/query', {currentPage, pageSize}, {mock: false})

const addRoleInfo = (roleName, roleRemark, roleStatus) => http.post('/role/add', {roleName, roleRemark, roleStatus})

const updateRoleState = (roleId, roleStatus) => http.post('/role/setRoleStatus', {roleId, roleStatus})

const updateRoleInfo = (roleId, roleName, roleRemark, roleStatus) => http.post('/role/modifyRole', {
    roleId, roleName, roleRemark, roleStatus
})

const deleteRoleInfo = (roleId) => http.post('/role/delRole', {roleId})

const searchMenuList = () => http.get('/user/menu', {mock: true})

const authorizedUserList = (roleId, currentPage, pageSize) => http.post('/role/queryRoleUsers', {roleId, currentPage, pageSize}, {mock: false})

export default {
    searchUserList,
    searchDownRoleList,
    addUserInfo,
    updateUserInfo,
    deleteUserInfo,
    updateUserState,
    resetUserPwd,
    searchRoleList,
    addRoleInfo,
    updateRoleInfo,
    deleteRoleInfo,
    updateRoleState,
    searchMenuList,
    authorizedUserList
}