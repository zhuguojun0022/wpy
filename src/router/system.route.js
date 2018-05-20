import userManage from '../pages/system/user-manage/AdminUserPage'
import roleManage from '../pages/system/role-manage/RolePage'

export default [{
    path: 'sys/user',
    name: 'userManage',
    meta: {
        menuCode: 'SYS_USER_MANAGE'
    },
    component: userManage
}, {
    path: 'sys/role',
    name: 'roleManage',
    meta: {
        menuCode: 'SYS_ROLE_MANAGE'
    },
    component: roleManage
}]
