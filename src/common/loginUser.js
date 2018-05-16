import {infraApi} from 'Apis/'

let userPromise

export function setLoginUser (user) {
    userPromise = Promise.resolve(user)
}

export function startGetLoginUser () {
    userPromise = infraApi.getLoginInfo().then(({data: {result}}) => result)
}

export default {
    install (Vue, options) {
        Vue.prototype.$getLoginUser = () => userPromise
    }
}