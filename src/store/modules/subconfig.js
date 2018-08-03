export default {
    state: {
        subconfig: {
            step: 0,
            apiInfo: {}
        }
    },
    mutations: {
        setStep ({subconfig}) {
            subconfig.step += 1
        },
        setApiInfo ({subconfig}, info) {
            subconfig.apiInfo = info
        },
        resetStep ({subconfig}) {
            subconfig.step = 0
        }
    },
    getters: {
        getStep: ({subconfig}) => subconfig.step,
        apiInfo: ({subconfig}) => subconfig.apiInfo
    }
}