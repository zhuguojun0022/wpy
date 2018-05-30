function isArray (t) {
    if (Array.isArray) {
        return Array.isArray(t)
    }
    return Object.prototype.toString.call(t) === '[object Array]'
}

function isPlainObject (t) {
    if (!t) {
        return false
    }

    if (isArray(t)) {
        return false
    }

    return typeof t === 'object'
}

/**
 * map = {src: dest}
 */
function dataMap (map, data) {
    if (!data) {
        return null
    }

    if (!map) {
        return data
    }

    if (isArray(data)) {
        const res = []
        data.forEach(d => res.push(dataMap(map, d)))
        return res
    }

    if (isPlainObject(data)) {
        const res = {}
        Object.keys(map).forEach(key => {
            res[map[key]] = data[key]
        })
        return res
    }

    return data
}

const SYSTEM_TOKEN = 'X-TOKEN'

const ls = {
    set (key, value) {
        if (!key || !value) return
        window.localStorage.setItem(key, JSON.stringify(value))
    },
    get (key) {
        if (!key) return null
        const _key = window.localStorage[key]
        if (!_key) return null
        return JSON.stringify(_key)
    }
}

function getToken () {
    return ls.get(SYSTEM_TOKEN)
}

function setToken (token) {
    return ls.set(SYSTEM_TOKEN, token)
}

function checkLogin () {
    return !!getToken()
}

function loginOut () {
    window.localStorage.removeItem(SYSTEM_TOKEN)
}

function formatDateTime (timeStamp) {
    if (!timeStamp) return ''
    let date = new Date()
    date.setTime(timeStamp * 1000)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let h = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    m = m < 10 ? ('0' + m) : m
    d = d < 10 ? ('0' + d) : d
    h = h < 10 ? ('0' + h) : h
    minute = minute < 10 ? ('0' + minute) : minute
    second = second < 10 ? ('0' + second) : second
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

export {
    isArray,
    dataMap,
    isPlainObject,
    getToken,
    setToken,
    checkLogin,
    loginOut,
    formatDateTime
}