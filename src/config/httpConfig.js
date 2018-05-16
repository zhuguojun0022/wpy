import Vue from 'vue'
import axios from 'axios'
import {Message} from 'iview'
import router from '../router'

Vue.prototype.$axios = axios

axios.defaults.baseURL = '/'
axios.defaults.timeout = 10000
axios.defaults.headers = {'cache-control': 'no-cache'}

const originMap = {
    api: '/admin-api'
}

const getURL = (url, origin = 'api', mock = false) => {
    if (mock) {
        return '/mock' + url
    }
    return originMap[origin] + url
}

function replaceRequestURL (config) {
    config.url = getURL(config.url, config.origin, config.mock)
}

// 公共拦截器
axios.interceptors.request.use(config => {
    replaceRequestURL(config)
    return config
}, error => {
    return Promise.reject(error)
})

function clientErrorProcess (response) {
    if (!response.config.alert) {
        if (response.data && response.data.msg) {
            Message.error(`${response.data.msg}`)
        } else {
            Message.error('请求错误，错误码未知！')
        }
    }
}

axios.interceptors.response.use(response => {
    const {config, data} = response
    if (data && data.code &&
        (data.code.startsWith('4') || data.code.startsWith('5'))) {
        clientErrorProcess(response)
    } else if (config.alertSuccess) {
        Message.success(data.msg || '操作成功')
    }
    return response
}, error => {
    if (!error.response && error.message.indexOf('timeout') !== -1) {
        Message.error('请求超时')
    } else if (error.response && error.response.status >= 500) {
        if (error.response.data && error.response.data.code) {
            Message.error(`服务器错误，错误码：${error.response.data.code}，消息：${error.response.data.msg}`)
        } else {
            Message.error('服务器错误，错误码未知')
        }
    } else if (error.response && error.response.status === 401) {
        router.replace('/login')
    } else if (error.response && error.response.status >= 400 && error.response.status < 500) {
        clientErrorProcess(error.response)
    } else {
        Message.error('服务器访问异常')
    }
    return Promise.reject(error)
})

export default axios