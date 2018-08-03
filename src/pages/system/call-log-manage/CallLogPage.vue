<template>
    <GPage bg>
        <Tabs value="errorlog">
            <TabPane label="错误日志" name="errorlog">
                <caller-log></caller-log>
            </TabPane>
            <TabPane label="普通日志" name="normallog">
                <caller-log></caller-log>
            </TabPane>
        </Tabs>
        <table-footer :total-num="totalNum" :current-page="currentPage" :page-size="pageSize" @on-change="handleMainChange"></table-footer>
    </GPage>
</template>
<script>
import {TableFooter} from '../../../components/table'
import callerLog from './CallerLog'
export default {
    data () {
        return {
            totalNum: 0,
            currentPage: 1,
            pageSize: 20
        }
    },
    components: {
        tableFooter: TableFooter,
        callerLog: callerLog
    },
    methods: {
        handleMainChange () {

        }
    }
}
</script>