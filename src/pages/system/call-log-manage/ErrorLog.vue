<template>
    <section>
        <Form :model="searchValue" inline>
            <FormItem prop="startTime" class="m-x-r search-condition">
                <label class="required-search m-x-r m-x-l">开始时间:</label>
                <Date-picker transfer :clearable="false" confirm v-model="searchValue.startTime" class="m-x" size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" style="width: 216px"></Date-picker>
            </FormItem>
            <FormItem v-if="isCustomized" prop="endTime" class="m-x-r search-condition">
                <label class="required-search m-x-r">结束时间:</label>
                <Date-picker transfer :clearable="false" confirm v-model="searchValue.endTime" class="m-x" size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择结束时间" style="width: 216px"></Date-picker>
            </FormItem>
            <FormItem prop="apiName" class="m-x search-condition">
                <label class="search-title m-x-r">API名称:</label>
                <!-- <Select
                    v-if="isAdmin"
                    v-model="applySelect"
                    placeholder="请搜索应用"
                    style="width: 200px"
                    size="small"
                    filterable
                    clearable
                    remote
                    :transfer="true"
                    :remote-method="matchAppEvent"
                    :loading="findLoading">
                    <Option v-for="item in applyData" :value="item.id" :key="item.id">{{item.name}}</Option>
                </Select> -->
                <Select v-model="searchValue.apiSelected" placeholder="请选择api" size="small" clearable style="width: 200px">
                    <Option v-for="item in apiData" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="caller" class="m-x-r-2 search-condition" v-if="publish">
                <label class="search-title m-x-r">&nbsp;&nbsp;&nbsp;&nbsp;调用者:</label>
                <Select
                    v-if="!isAdmin && publish"
                    v-model="searchValue.caller"
                    style="width: 140px"
                    size="small"
                    clearable
                    transfer>
                    <Option v-for="(item) in filterCallerListData" :value="item.channelId" :key="item.channelId">{{item.AAZ571}}</Option>
                </Select>
                <Select
                    v-if="isAdmin"
                    v-model="searchValue.caller"
                    placeholder="请搜索应用"
                    style="width: 200px"
                    size="small"
                    filterable
                    clearable
                    remote
                    :transfer="true"
                    :remote-method="matchAppEvent"
                    :loading="findLoading">
                    <Option v-for="item in callerList" :value="item.appKey" :key="item.appKey">{{ item.apiName }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="returnCode" class="m-x-r search-condition">
                <label class="search-title m-x-r">&nbsp;&nbsp;&nbsp;返回码:</label>
                <Select
                    transfer
                    v-model="searchValue.returnCode"
                    placeholder="请选择返回码"
                    size="small"
                    style="width: 260px">
                    <Option v-for="item in codeList" :value="item.code" :key="item.code">{{ item.msg }}</Option>
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
                returnCode: '2',
                timeFrame: 3600000 * 24
            },
            isCustomized: true,
            timeFrameList: [
                { label: '1小时', value: 60 * 60 * 1000 },
                { label: '3小时', value: 3 * 60 * 60 * 1000 },
                { label: '12小时', value: 12 * 60 * 60 * 1000 },
                { label: '24小时', value: 24 * 60 * 60 * 1000 },
                { label: '48小时', value: 48 * 60 * 60 * 1000 }
            ],
            applySelect: '',
            isAdmin: false,
            applyData: [],
            apiData: [],
            publish: true,
            filterCallerListData: [],
            callerList: [],
            codeList: [],
            tableData: [],
            columns: [{
                title: '请求ID',
                key: 'reqId',
                width: 200
            }, {
                title: '调用者名称',
                key: 'callerName'
            }, {
                title: 'API名称',
                render: (h, {columns, index, row}) => {
                    return h('div', [
                        h('Button', {props: {type: 'primary', style: {paddingLeft: '0px'}}}, [
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
                key: 'starttime'
            }, {
                title: '返回码',
                render: (h, {column, index, row}) => {
                    return h('div', [
                        h('Button', {props: {type: 'primary'}}, [
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
        searchClick () {
            this.reqLogList()
        },
        handleCurrentChange (val) {
            this.currentPage = val
            this.reqLogList()
        },
        // 查询应用的方法
        getAppList (name) {
            monitorApi.getApp({
                name: name,
                publish: true
            }).then(({body: {result, code, msg}}) => {})
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
        reqLogList () {
            let start = this.searchValue.startTime - 0
            let end = this.searchValue.endTime - 0
            if (!this.isCustomized) {
                end = start + this.searchValue.timeFrame
            }
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
                start: new Date().getTime(this.searchValue.startTime),
                end: new Date().getTime(this.searchValue.endTime)
            }
            monitorApi.oldReqLogs(params).then(({body: {result, code, msg}}) => {})
        },
        matchAppEvent (name) {
            if (name.length < 1) {
                return false
            }
            this.getAppList(name)
        },
        matchCallerEvent () {
            if (name.length < 1) {
                return false
            }
            this.getCallerList(name)
        },
        getCodeList () {
            this.codeList = [
                { msg: '4002 (没有有效的订阅)', code: '4002' },
                { msg: '4003 (没有订阅该API)', code: '4003' },
                { msg: '4004 (服务没有找到)', code: '4004' }
            ]
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
            this.searchValue.startTime = new Date(strDate)
        }
    }
}
</script>
