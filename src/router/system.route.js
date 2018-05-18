import userManage from '../pages/system/user-manage/AdminUserPage'
import menuManage from '../pages/system/menu-manage/IndexPage'

export default [{
    path: 'sys/user',
    name: 'userManage',
    meta: {
        menuCode: 'SYS_USER_MANAGE'
    },
    component: userManage
}, {
    path: 'sys/menu',
    name: 'menuManage',
    meta: {
        menuCode: 'SYS_MENU_MANAGE'
    },
    component: menuManage
}]