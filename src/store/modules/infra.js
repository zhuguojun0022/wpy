export default {
    state: {
        breadcrumb: []
    },
    mutations: {
        pushBreadcrumb (state, item) {
            state.breadcrumb.push(item)
        },
        popBreadcrumb (state) {
            state.breadcrumb.pop()
        },
        resetBreadcrumb (state, item) {
            state.breadcrumb = [item]
        }
    },
    getters: {
        getBreadcrumbData: state => state.breadcrumb
    }
}