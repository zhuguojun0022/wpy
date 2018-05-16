import Vuex from 'vuex'
import Vue from 'vue'
import modules from './modules'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const store = new Vuex.Store({
    modules: {
        ...modules
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})

export default store