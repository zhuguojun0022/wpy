import http from '../config/httpConfig'

const searchUserList = () => http.get('/user/userlist', {mock: true})

const addUserInfo = () => http.post('', {})

const updateUserInfo = () => http.post('', {})

const deleteUserInfo = () => http.post('', {})

const updateUserState = () => http.post('', {})

const resetUserPwd = () => http.post('', {})

const searchRoleList = () => http.get('/user/rolelist', {mock: true})

const searchMenuList = () => http.get('/user/menu', {mock: true})

export default {
    searchUserList,
    addUserInfo,
    updateUserInfo,
    deleteUserInfo,
    updateUserState,
    resetUserPwd,
    searchRoleList,
    searchMenuList
}