// import {infraApi} from 'Apis/'
import { setToken } from './utils'

let userPromise

export function setLoginUser (user) {
    setToken(user.token)
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