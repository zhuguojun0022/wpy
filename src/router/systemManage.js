import userManage from '../pages/infra/systemManagement/AdminUserPage'

export default [{
    path: 'sys/user',
    name: 'userManage',
    meta: {
        menuCode: 'SYS_USER_MANAGE'
    },
    component: userManage
}]