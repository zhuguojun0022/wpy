<template>
    <section>
        <Form :model="searchValue" inline>
            <FormItem prop="startTime" class="m-x-r search-condition">
                <label class="required-search m-x-l">开始时间:</label>
                <Date-picker transfer :clearable="false" confirm v-model="searchValue.startTime" class="m-x" size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" style="width: 200px"></Date-picker>
            </FormItem>
            <FormItem prop="endTime" class="m-x-r search-condition">
                <label class="required-search">结束时间:</label>
                <Date-picker transfer :clearable="false" confirm v-model="searchValue.endTime" class="m-x" size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择结束时间" style="width: 200px"></Date-picker>
            </FormItem>
            <FormItem prop="apiName" class="m-x-r search-condition">
                <label class="search-title m-x-r">API名称:</label>
                <Select filterable v-model="searchValue.apiSelected" placeholder="请选择api" size="small" clearable style="width: 200px">
                    <Option v-for="item in apiData" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="caller" class="m-x-r-2 search-condition">
                <label class="search-title m-x-r">&nbsp;&nbsp;&nbsp;&nbsp;渠道名称:</label>
                <Select
                    filterable
                    v-model="searchValue.caller"
                    style="width: 200px"
                    size="small"
                    clearable
                    transfer>
                    <Option v-for="(item) in filterCallerListData" :value="item.channelId" :key="item.channelId">{{item.AAZ571}}</Option>
                </Select>
            </FormItem>
            <FormItem prop="returnCode" class="m-x-r search-condition">
                <label class="search-title m-x-r">&nbsp;&nbsp;&nbsp;返回码:</label>
                <Select
                    transfer
                    v-model="searchValue.returnCode"
                    placeholder="请选择返回码"
                    size="small"
                    clearable
                    style="width: 200px">
                    <Option v-for="item in codeList" :value="item.code" :key="item.code" :label="item.msg">
                        <span>{{ item.msg }}</span>
                        <span style="float:right;color:#ccc">{{ item.code }}</span>
                    </Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" size="small" @click="searchClick">查询</Button>
            </FormItem>
        </Form>
        <Table size="small" :columns="columns" :data="tableData" style="width: 100%"></Table>
        <table-footer :total-num="totalNum" :current-page="currentPage" :page-size="pageSize" @on-change="handleCurrentChange"></table-footer>
    </section>
</template>
<script>
import {monitorApi, subconfigApi} from '../../../apis'
import {TableFooter} from '../../../components/table'
import { mapMutations, mapGetters } from 'vuex'

export default {
    components: {
        TableFooter: TableFooter
    },
    data () {
        return {
            findLoading: false,
            totalNum: 0,
            currentPage: 1,
            pageSize: 20,
            searchValue: {
                startTime: '',
                endTime: '',
                apiSelected: '',
                caller: '',
                returnCode: '',
                timeFrame: 3600000 * 24
            },
            applySelect: '',
            apiData: [],
            filterCallerListData: [],
            codeList: [],
            tableData: [],
            columns: [{
                title: '请求ID',
                key: 'id',
                minWidth: 200
            }, {
                title: '渠道名称',
                key: 'channelName'
            }, {
                title: 'API名称',
                render: (h, {columns, index, row}) => {
                    return h('div', [
                        h('div', {props: {type: 'primary'}, style: {'paddingLeft': '0px'}}, [
                            h('Tooltip', {
                                props: {
                                    content: '请求url：' + (row.url || '无'),
                                    placement: 'top',
                                    style: {
                                        wordBreak: 'break-all',
                                        wordWrap: 'break-word'
                                    }
                                }
                            }, row.apiName)
                        ])
                    ])
                }
            }, {
                title: '时间',
                key: 'starttime',
                width: 200
            }, {
                title: '返回码',
                render: (h, {column, index, row}) => {
                    return h('div', [
                        h('div', {props: {type: 'primary'}, style: {'paddingLeft': '0px'}}, [
                            h('Tooltip', {
                                props: {
                                    content: '返回信息: ' + (row.error || '无'),
                                    placement: 'top'
                                }
                            }, row.code)
                        ])
                    ])
                }
            }, {
                title: '后端返回码',
                key: 'httpStatus'
            }]
        }
    },
    methods: {
        ...mapMutations(['saveSearchInfo']),
        searchClick () {
            this.reqLogList('search')
        },
        handleCurrentChange (val) {
            this.currentPage = val
            this.reqLogList()
        },
        // 查询api接口
        getApiList (appId) {
            subconfigApi.getApiList({
                name: null
            }).then(({data: {result, resultCode, msg}}) => {
                this.apiData = result
            })
        },
        // 调用者接口查询
        getCallerList (name) {
            subconfigApi.getChannelInfo({
                name: ''
            }).then(({data: {result, resultCode, msg}}) => {
                this.filterCallerListData = result
            })
        },
        reqLogList (type) {
            let start = this.searchValue.startTime - 0
            let end = this.searchValue.endTime - 0
            if (!(end && start)) {
                this.$Message.warning({
                    content: '时间不可以为空',
                    duration: 2
                })
                return false
            } else if (end - start < 0) {
                this.$Message.warning({
                    content: '结束时间需要大于开始时间',
                    duration: 2
                })
                return false
            }
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                callerId: this.searchValue.caller,
                apiId: this.searchValue.apiSelected,
                code: this.searchValue.returnCode,
                start: new Date(start).getTime(),
                end: new Date(end).getTime()
            }
            if (type === 'search') {
                params.type = 'search'
                this.currentPage = 1
                this.saveSearchInfo(params)
            } else {
                params.type = undefined
                this.saveSearchInfo(params)
            }
            monitorApi.oldReqLogs(this.getSearchInfo).then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    this.totalNum = result.total
                    this.tableData = result.list
                } else {
                    this.totalNum = 0
                    this.$Message.error({
                        content: msg,
                        duration: 3
                    })
                }
            })
        },
        getCodeList () {
            // this.codeList = [
            //     { msg: '4002 (没有有效的订阅)', code: '4002' },
            //     { msg: '4003 (没有订阅该API)', code: '4003' },
            //     { msg: '4004 (服务没有找到)', code: '4004' }
            // ]
            monitorApi.errorCode().then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    this.codeList = result
                } else {
                    this.$Message.error({
                        content: msg,
                        duration: 3
                    })
                }
            })
        }
    },
    watch: {
        applySelect (val, old) {
            if (!val) return false
            this.getApiList(val)
        }
    },
    mounted () {
        this.getCodeList()
        this.getCallerList()
        this.getApiList()
        let routeWay = this.$route.params.dashboard
        let nowDate = new Date()
        let date = nowDate.getDate()
        let month = nowDate.getMonth() + 1
        let year = nowDate.getFullYear()
        if (routeWay) {
            let str = nowDate - 3600000 * 24
            this.searchValue.startTime = new Date(str)
        } else {
            let strDate = `${year}/${month}/${date} 00:00:00`
            let strEndDate = `${year}/${month}/${date} 23:59:59`
            this.searchValue.startTime = new Date(strDate)
            this.searchValue.endTime = new Date(strEndDate)
        }
        this.searchClick()
    },
    computed: {
        ...mapGetters({
            getSearchInfo: 'getSearchInfo'
        })
    }
}
</script>
