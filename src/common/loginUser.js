// import {infraApi} from 'Apis/'
import { setToken } from './utils'

let userPromise

export function setLoginUser (user) {
    setToken(user.token)
    window.sessionStorage.setItem('USERNAME', user.userAdminName)
    window.sessionStorage.setItem('USERID', user.userAdminId)
    userPromise = Promise.resolve(user)
}

// export function startGetLoginUser () {
//     userPromise = infraApi.getLoginInfo().then(({data: {result}}) => result)
// }

export default {
    install (Vue, options) {
        Vue.prototype.$getLoginUser = () => userPromise
    }
}