<template>
    <GPage bg>
        <!-- <Tabs value="errorlog">
            <TabPane label="错误日志" name="errorlog">
                <caller-log></caller-log>
            </TabPane>
            <TabPane label="普通日志" name="normallog">
                <caller-log></caller-log>
            </TabPane>
        </Tabs> -->
        <GTab :options="options" :value="'error'" @input="getCurrentTab"></GTab>
        <div class="m-y-t-2">
            <error-log v-show="logType === 'error'"></error-log>
        </div>
    </GPage>
</template>
<script>
import GTab from '../../../components/GTab'
import ErrorLog from './ErrorLog'
// import NormalLog from './NormalLog'
import {mapMutations} from 'vuex'

export default {
    data () {
        return {
            totalNum: 0,
            currentPage: 1,
            pageSize: 20,
            options: [{
                label: '错误日志',
                value: 'error'
            }],
            logType: 'error'
        }
    },
    components: {
        errorLog: ErrorLog,
        // normalLog: NormalLog,
        GTab: GTab
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '调用日志'
            })
        })
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        handleMainChange () {

        },
        getCurrentTab (value) {
            this.logType = value
        }
    }
}
</script>