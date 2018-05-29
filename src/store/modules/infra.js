export default {
    state: {
        breadcrumb: [],
        showLoading: false
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
        },
        openLoading (state) {
            state.showLoading = true
        },
        closeLoading (state) {
            state.showLoading = false
        }
    },
    getters: {
        getBreadcrumbData: state => state.breadcrumb,
        getShowLoading: state => state.showLoading
    }
}