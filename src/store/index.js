import Vuex from 'vuex'
import Vue from 'vue'
import modules from './modules'
import createLogger from 'vuex/dist/logger'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// vue可持久化
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

const store = new Vuex.Store({
    modules: {
        ...modules
    },
    strict: debug,
    plugins: debug ? [createLogger(), vuexLocal.plugin] : [vuexLocal.plugin]
})

export default store