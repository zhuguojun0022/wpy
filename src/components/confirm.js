import Vue from 'vue'
Vue.prototype.$confirm = function (onOk, content = '确认删除吗？') {
    this.$Modal.confirm({
        title: '确认提示',
        content: content,
        width: 300,
        onOk: onOk
    })
}