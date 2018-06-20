import userManage from '../pages/system/user-manage/IndexPage'
import roleManage from '../pages/system/role-manage/RolePage'
import menuManage from '../pages/system/menu-manage/IndexPage'
import regionManage from '../pages/system/region-manage/RegionPage'
import issueManage from '../pages/system/issue-manage/IssuePage'

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
}, {
    path: 'sys/menu',
    name: 'menuManage',
    meta: {
        menuCode: 'SYS_MENU_MANAGE'
    },
    component: menuManage
}, {
    path: 'sys/region',
    name: 'regionManage',
    meta: {
        menuCode: 'SYS_MENU_MANAGE'
    },
    component: regionManage
}, {
    path: 'sys/issue',
    name: 'issueManage',
    meta: {
        menuCode: 'SYS_MENU_MANAGE'
    },
    component: issueManage
}]
