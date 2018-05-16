function tag (colMap) {
    return function (h, data) {
        const mapRes = colMap(data)
        if (!mapRes) {
            return null
        }
        const {color, text} = mapRes
        return h('Tag', {
            props: {
                color: color
            }
        }, text)
    }
}

export {
    tag
}