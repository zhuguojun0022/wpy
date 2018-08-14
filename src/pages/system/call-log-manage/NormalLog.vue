<template>
    <section class="normal-log">
        <Form :model="searchValue" inline>
            <FormItem prop="startTime" class="m-x-r search-condition">
                <label class="required-search m-x-r m-x-l">开始时间:</label>
                <Date-picker transfer :clearable="false" confirm v-model="searchValue.startTime" class="m-x" size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" style="width: 216px"></Date-picker>
            </FormItem>
            <FormItem v-if="userDefined" prop="endTime" class="m-x-r search-condition">
                <label class="required-search m-x-r">结束时间:</label>
                <Date-picker transfer :clearable="false" confirm v-model="searchValue.endTime" class="m-x" size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择结束时间" style="width: 216px"></Date-picker>
            </FormItem>
            <FormItem v-if="!userDefined" prop="endTime" class="m-x-r search-condition">
                <label class="required-search m-x-r">有效时限:</label>
                <Slider
                    v-model="searchValue.timeFrame"
                    class="silder-inline p-x"
                    :min="1"
                    :max="24"
                    :step="1"
                    style="width: 200px">
                </Slider>
                <Input-number :precision="1" size="small" :max="24" :min="1" v-model="searchValue.timeFrame"></Input-number>
                <div class="silder-inline" style="width: 40px;">
                    <label>小时</label>
                </div>
            </FormItem>
            <FormItem class="search-condition">
                <Checkbox v-model="userDefined">自定义结束时间</Checkbox>
            </FormItem>
            <FormItem prop="apiName" class="m-x search-condition">
                <label class="search-title m-x-r">API名称:</label>
                <Select
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
                    <Option v-for="item in applyData" :value="item.appId" :key="item.appId">{{item.appName}}</Option>
                </Select>
                <Select v-model="searchValue.apiSelected" placeholder="请选择api" size="small" clearable style="width: 200px">
                    <Option v-for="item in apiData" :value="item.apiId" :key="item.apiId">{{ item.apiName }}</Option>
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
                    <Option v-for="(item) in filterCallerListData" :value="item.appKey" :key="item.appKey">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" size="small" @click="searchClick">查询</Button>
            </FormItem>
        </Form>
        <Table size="small" :columns="columns" :data="tableData" style="width: 100%"></Table>
        <table-footer :total-num="totalNum" :current-page="currentPage" :page-size="pageSize" @on-change="handleMainChange"></table-footer>
    </section>
</template>
<script>
import {monitorApi} from '../../../apis'
export default {
    data () {
        return {
            findLoading: false,
            searchValue: {
                startTime: '',
                endTime: '',
                timeFrame: 1.0,
                apiSelected: '',
                caller: '',
                returnCode: '2000'
            },
            userDefined: false,
            applySelect: '',
            isAdmin: false,
            applyData: [],
            apiData: [],
            publish: true,
            filterCallerListData: [],
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
                title: '耗时',
                key: 'cost',
                width: 80
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
            }],
            apiNameTable: '',
            prePageDisable: false,
            lastRowKey: '',
            nextPageDisable: '',
            callerNameTable: '',
            preBeginRowKey: '',
            totalNum: 0,
            currentPage: 1,
            pageSize: 20
        }
    },
    mounted () {
        let nowDate = new Date()
        let date = nowDate.getDate()
        let month = nowDate.getMonth() + 1
        let year = nowDate.getFullYear()
        let strDate = `${year}/${month}/${date} 00:00:00`
        this.searchValue.startTime = new Date(strDate)
    },
    methods: {
        init (user) {
            if (!this.isAdmin) {
                this.applySelect = this.appId
                if (!this.publish) {
                    this.searchValue.caller = this.appKey
                }
            }
        },
        searchClick () {
            this.searchValue.startTime = this.searchValue.startTime - 0
            if (!this.userDefined) {
                this.searchValue.endTime = this.searchValue.startTime - 0 + this.searchValue.timeFrame * 60 * 60 * 1000
            }
            this.searchValue.endTime = this.searchValue.endTime - 0
            if (!(this.searchValue.startTime)) {
                this.$Message.warning({
                    content: '开始时间不可以为空',
                    duration: 2
                })
                return false
            } else if (!(this.searchValue.startTime)) {
                this.$Message.warning({
                    content: '结束时间不可以为空',
                    duration: 2
                })
                return false
            } else if (this.searchValue.endTime - this.searchValue.startTime > 86400000) {
                this.$Message.warning({
                    content: '起止时间不可以超过一天',
                    duration: 2
                })
                return false
            } else if (this.searchValue.endTime - this.searchValue.startTime < 0) {
                this.$Message.warning({
                    content: '结束时间不可以小于开始时间',
                    duration: 2
                })
                return false
            } else if (!this.applySelect) {
                this.$Message.warning({
                    content: '应用名称不可以为空',
                    duration: 2
                })
                return false
            } else if (!this.searchValue.apiSelected) {
                this.$Message.warning({
                    content: 'api名称不能为空',
                    duration: 2
                })
                return false
            } else if (!this.searchValue.caller) {
                this.$Message.warning({
                    content: '调用者不可以为空',
                    duration: 2
                })
                return false
            }
            this.currentPage = 1
            this.apiData.forEach((val, key) => {
                if (val.apiId === this.searchValue.apiSelected) {
                    this.apiNameTable = val.apiName
                }
            })
            this.filterCallerListData.forEach((val, key) => {
                if (val.appKey === this.searchValue.caller) {
                    this.callerNameTable = val.name
                }
            })
            this.reqLogList()
        },
        getAppList (name) {
            this.findLoading = true
        },
        getApiList (appId) {
        },
        getCallerList (name) {
            this.findLoading = true
        },
        getfilterCallerList (appId) {
        },
        reqLogList () {
            this.prePageDisable = true
            monitorApi.reqLogList(this.applySelect, this.pageSize, this.currentPage, this.searchValue.caller, this.searchValue.apiSelected, this.searchValue.returnCode, this.searchValue.startTime, this.searchValue.endTime).then(({body: {result, code, msg}}) => {
                if (code === '2000') {
                    this.tableData = result.reqLogs
                    if (result.reqLogs && result.reqLogs.length > 0) {
                        this.lastRowKey = result.reqLogs[result.reqLogs.length - 1].rowKey
                    }
                    this.currentPage = result.currentPage
                    if (result.reqLogs && result.reqLogs.length < 20) {
                        this.nextPageDisable = true
                    } else {
                        this.nextPageDisable = false
                    }
                } else {
                    this.$Message.warning({
                        content: msg,
                        duration: 2
                    })
                }
            }).catch(() => {})
        },
        prepageClick () {
            if (this.currentPage === 1) {
                this.prePageDisable = true
                return false
            }
            this.currentPage = this.currentPage - 1
            monitorApi.reqLogList(this.applySelect, this.pageSize, this.currentPage, this.searchValue.caller, this.searchValue.apiSelected, this.searchValue.returnCode, this.searchValue.startTime, this.searchValue.endTime).then(({body: {result, code, msg}}) => {
                if (code === '2000') {
                    this.tableData = result.reqLogs
                    this.preBeginRowKey = result.reqLogs[0].rowKey
                    this.lastRowKey = result.reqLogs[result.reqLogs.length - 1].rowKey
                    this.nextPageDisable = false
                    if (this.currentPage === 1) {
                        this.prePageDisable = true
                    }
                } else {
                    this.$Message.warning({
                        content: msg,
                        duration: 2
                    })
                }
            })
        },
        nextpageClick () {
            if (this.nextPageDisable) {
                return false
            }
            this.currentPage = this.currentPage + 1
            monitorApi.reqLogList(this.applySelect, this.pageSize, this.currentPage, this.searchValue.caller, this.searchValue.apiSelected, this.searchValue.returnCode, this.searchValue.startTime, this.searchValue.endTime).then(({body: {result, code, msg}}) => {
                if (code === '2000') {
                    if (result.reqLogs.length > 0) {
                        this.tableData = result.reqLogs
                        this.lastRowKey = result.reqLogs[result.reqLogs.length - 1].rowKey
                        this.preBeginRowKey = result.reqLogs[0].rowKey
                        this.preBeginRowKey = false
                        if (result.reqLogs.length < 20) {
                            this.nextPageDisable = true
                        }
                    } else {
                        this.nextPageDisable = true
                        this.currentPage = this.currentPage - 1
                        this.$Message.warning({
                            content: '没有更多内容',
                            duration: 2
                        })
                    }
                } else {
                    this.$Message.warning({
                        content: msg,
                        duration: 2
                    })
                }
            })
        },
        handleCurrentChange (val) {
            this.currentPage = val
            this.reqLogList()
        },
        matchAppEvent (name) {
            if (name.length < 1) {
                return false
            }
            this.getAppList(name)
        },
        matchCallerEvent (name) {
            if (name.length < 1) {
                return false
            }
            this.getCallerList(name)
        }
    },
    watch: {
        applySelect (val, old) {
            if (!val) return false
            this.getApiList(val)
        },
        'searchValue.apiSelected' (val) {
            if (this.publish) {
                this.getfilterCallerList(val)
            }
        }
    }
}
</script>
<style lang="less">
.normal-log {
    .silder-inline {
        display: inline-flex;
        color: #5E6D82;
    }
}
</style>
