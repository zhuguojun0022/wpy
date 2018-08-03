import Vue from 'vue'

function strRander (content, createElement) {
    let strArray = content.split(',')
    if (strArray.length < 2) return content
    let eleArray = []
    strArray.forEach((elem, index) => {
        if (elem.includes('<[') || elem.includes(']>')) {
            eleArray.push(createElement('span', {
                style: {
                    color: '#70B9F7',
                    fontSize: '12px'
                }
            }, [(elem.replace('<[', '  ')).replace(']>', '  ')]))
        } else {
            eleArray.push(elem)
        }
    })
    return eleArray
}

Vue.component('description-com', {
    functional: true,
    render: function (createElement, context) {
        return createElement('span', strRander(context.props.str, createElement))
    },
    props: {
        str: {
            type: String,
            default: ''
        }
    }
})