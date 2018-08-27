export default {
    state: {
        search: {
            searchInfo: {}
        }
    },
    mutations: {
        saveSearchInfo ({search}, info) {
            if (info.type === 'search') {
                search.searchInfo = info
                search.searchInfo.pageNum = 1
            }
            search.searchInfo.pageNum = info.pageNum
        }
    },
    getters: {
        getSearchInfo: ({search}) => search.searchInfo
    }
}