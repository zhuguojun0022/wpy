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

const searchUnAuthorizedUserList = (roleId, userAdminName) => http.post('/role/queryRoleNoAuthUser', {roleId, userAdminName})

const updateAuthorizedUser = (roleId, userAdminId) => http.post('/role/addUserAdminRole', {roleId, userAdminId})

const getMenuTree = () => http.get('/menu/tree')

const addMenu = (menuTitle, menuRouter, menuRemark, menuIcon, menuOrder, menuPid) => http.post('/menu/add', {
    menuTitle, menuRouter, menuRemark, menuIcon, menuOrder, menuPid
})

const updateMenuTree = (menuId, menuTitle, menuRouter, menuRemark, menuIcon, menuOrder, menuPid) => http.post('/menu/update', {
    menuId, menuTitle, menuRouter, menuRemark, menuIcon, menuOrder, menuPid
})

const searchRegionList = (pageSize, currentPage, regionName) => http.post(`/region/queryRegionList`, {
    pageSize, currentPage, regionName
})

const addRegionInfo = (regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg) => http.post(`/region/addRegion`, {
    regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg
})

const updateRegionInfo = (regionId, regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg) => http.post(`/region/modifyRegion`, {
    regionId, regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg
})

const deleteRegionInfo = (regionId) => http.post(`/region/delRegion`, {regionId})

const searchIssueList = (pageSize, currentPage, region) => http.post(`/region/channel/query`, {
    pageSize, currentPage, region
})

const addIssueInfo = (channelList) => http.post(`/region/channel/add`, {
    channelList
})

const deleteIssueInfo = (regionId, channelId) => http.post(`/region/channel/delete`, {
    regionId, channelId
})

const changeIssueInfo = (regionId, regionNo, authStatus) => http.post(`/region/channel/updateAuth`, {
    regionId, regionNo, authStatus
})

const searchchannelList = (aaz571) => http.post('/channel/simple', {
    aaz571
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
    updateMenuTree,
    searchUnAuthorizedUserList,
    updateAuthorizedUser,
    searchRegionList,
    addRegionInfo,
    updateRegionInfo,
    deleteRegionInfo,
    searchIssueList,
    addIssueInfo,
    deleteIssueInfo,
    changeIssueInfo,
    searchchannelList
}