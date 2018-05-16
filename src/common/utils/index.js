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

export {
    isArray,
    dataMap,
    isPlainObject
}