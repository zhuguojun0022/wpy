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

const addRoleInfo = (roleName, roleRemark) => http.post('/role/add', {roleName, roleRemark})

const updateRoleState = (roleId, roleStatus) => http.post('/role/setRoleStatus', {roleId, roleStatus})

const updateRoleInfo = (roleId, roleName, roleRemark) => http.post('/role/modifyRole', {
    roleId, roleName, roleRemark
})

const deleteRoleInfo = (roleId) => http.post('/role/delRole', {roleId})

const deleteRoleUser = (userAdminRoleId) => http.post('/role/delRoleUser', {userAdminRoleId})

const authorizedUserList = (roleId, userAdminName, currentPage, pageSize) => http.post('/role/queryRoleUsers', {roleId, userAdminName, currentPage, pageSize}, {mock: false})

const authorizedMenuTree = (roleId) => http.post('/role/queryRoleMenuTree', {roleId})

const updateAuthorizedMenuTree = (roleId, menuIds) => http.post('/role/saveRoleMenu', {roleId, menuIds})

const getMenuTree = () => http.get('/menu/tree')

const addMenu = (menuTitle, menuRouter, menuRemark, menuIcon, menuOrder, menuPid) => http.post('/menu/add', {
    menuTitle, menuRouter, menuRemark, menuIcon, menuOrder, menuPid
})

const updateMenuTree = (menuId, menuTitle, menuRouter, menuRemark, menuIcon, menuOrder, menuPid) => http.post('/menu/update', {
    menuId, menuTitle, menuRouter, menuRemark, menuIcon, menuOrder, menuPid
})

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
    authorizedUserList,
    deleteRoleUser,
    authorizedMenuTree,
    updateAuthorizedMenuTree,
    getMenuTree,
    addMenu,
    updateMenuTree
}