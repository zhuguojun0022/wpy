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
        <GTab :options="options" :value="'error'"></GTab>
        <div class="m-y-t-2">
            <caller-log></caller-log>
        </div>
        <table-footer :total-num="totalNum" :current-page="currentPage" :page-size="pageSize" @on-change="handleMainChange"></table-footer>
    </GPage>
</template>
<script>
import GTab from '../../../components/GTab'
import {TableFooter} from '../../../components/table'
import callerLog from './CallerLog'
export default {
    data () {
        return {
            totalNum: 0,
            currentPage: 1,
            pageSize: 20,
            options: [{
                label: '错误日志',
                value: 'error'
            }, {
                label: '普通日志',
                value: 'normal'
            }]
        }
    },
    components: {
        tableFooter: TableFooter,
        callerLog: callerLog,
        GTab: GTab
    },
    methods: {
        handleMainChange () {

        }
    }
}
</script>