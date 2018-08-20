export default {
    state: {
        breadcrumb: [],
        showLoading: false,
        billDetailInfo: []
    },
    mutations: {
        pushBreadcrumb (state, item) {
            if (item.constructor === Array) {
                state.breadcrumb = [...state.breadcrumb, ...item]
            } else {
                state.breadcrumb.push(item)
            }
        },
        popBreadcrumb (state) {
            state.breadcrumb.pop()
        },
        setBreadcrumb (state, item) {
            state.breadcrumb = item
        },
        resetBreadcrumb (state, item) {
            state.breadcrumb = [item]
        },
        clearBreadcrumb (state) {
            state.breadcrumb = []
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