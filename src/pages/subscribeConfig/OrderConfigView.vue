<!-- 配置订阅页面 -->
<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Button type="primary" @click="addOrder">新增订阅</Button>
        </div>
        <div slot="right">
            <Select filterable v-model="APIName" placeholder="API名称" style="width: 230px" clearable>
                <Option v-for="item in apiList" :value="item.id" :key="item.id" :label="item.name">
                    <span>{{ item.name }}</span>
                    <span style="float:right;color:#ccc">{{ item.groupName }}</span>
                </Option>
            </Select>
            <Select filterable v-model="channelName" placeholder="渠道名称" style="width: 200px" clearable>
                <Option v-for="item in channelList" :value="item.channelId" :key="item.channelId">{{ item.AAZ571 }}</Option>
            </Select>
            <Select v-model="status" style="width: 200px" placeholder="状态" clearable>
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="24">
            <Table :columns="columns" :data="tableData" :height="tableHeihgt"></Table>
            <table-footer :total-num="totalNum" :current-page="currentPage" :page-size="pageSize" @on-change="handleMainChange"></table-footer>
        </Col>
    </Row>
</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../components/table'
import {mapMutations, mapGetters} from 'vuex'
import {subconfigApi} from '../../apis'
// import server from '../../config/httpConfig'
// import {systemApi} from '../../apis'

export default {
    components: {TableHeader, TableFooter},
    data () {
        let filter = (row) => {
            if (!row.active) {
                return {
                    label: '未启用',
                    color: 'red',
                    border: '1px solid red'
                }
            } else if (row.active) {
                return {
                    label: '已启用',
                    color: 'green',
                    border: '1px solid #19be6b'
                }
            }
        }
        return {
            tableData: [],
            columns: [
                {
                    title: 'API名称',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: row.apiName,
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.watchNameClick(row)
                                }
                            }
                        }])
                    }
                },
                {title: '渠道名称', key: 'callerName'},
                {title: 'API描述', key: 'comments'},
                {
                    title: '状态',
                    fixed: 'center',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: filter(row).label,
                            color: filter(row).color,
                            tag: 'Tag'
                        }])
                    }
                },
                {
                    title: '操作',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: !row.active ? '启用' : '禁用',
                            type: !row.active ? 'success' : 'warning',
                            style: {
                                marginRight: '5px',
                                display: 'inline-block'
                            },
                            on: {
                                click: (e) => {
                                    this.stateAPIClick(row)
                                }
                            }
                        }, {
                            label: '删除',
                            type: 'error',
                            disabled: row.active,
                            on: {
                                click: (e) => {
                                    this.$Modal.confirm({
                                        title: '提示',
                                        content: '是否删除这条订阅配置',
                                        cancelText: '取消',
                                        loading: true,
                                        onOk: () => {
                                            subconfigApi.removeOrderApi({
                                                id: row.id
                                            }).then(({data: {result, resultCode, msg}}) => {
                                                this.$Modal.remove()
                                                if (resultCode === '000000') {
                                                    this.$Message.success({
                                                        content: msg,
                                                        duration: 3
                                                    })
                                                    this.getOrderApi('search')
                                                } else {
                                                    this.$Message.error({
                                                        content: msg,
                                                        duration: 3
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            }
                        }])
                    }
                }
            ],
            currentPage: 1,
            pageSize: 20,
            totalNum: 0,
            tableHeihgt: '',
            APIName: '',
            channelName: '',
            channelList: '',
            status: '',
            statusList: [{
                value: 1,
                label: '已启用'
            }, {
                value: 0,
                label: '未启用'
            }],
            apiList: []
        }
    },
    created () {
        this.tableHeihgt = window.innerHeight - 224
    },
    mounted () {
        this.resetBreadcrumb({
            name: '订阅配置',
            icon: 'icon-subscribeConfig'
        })
        this.appId = this.$route.params.appId
        this.getApiList()
        this.getChannelList()
        this.getOrderApi('search')
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'openLoading', 'closeLoading', 'resetStep', 'resetBreadcrumb', 'saveSearchInfo']),
        handleMainChange (v) {
            this.currentPage = v
            this.getOrderApi()
        },
        // 获取api列表
        getApiList () {
            subconfigApi.getApiList({
                name: null,
                active: null
            }).then(({data: {msg, resultCode, result}}) => {
                if (resultCode === '000000') {
                    this.apiList = result
                } else {
                    this.$Message.error({
                        content: msg,
                        duration: 3
                    })
                }
            })
        },
        // 获取渠道列表
        getChannelList () {
            subconfigApi.getChannelInfo({
                AAZ571: ''
            }).then(({data: {result, resultCode, msg}}) => {
                this.channelList = result
            })
        },
        addOrder () {
            this.resetStep()
            this.$router.push({
                name: 'addOrder'
            })
        },
        getOrderApi (type) {
            let searchInfo = {}
            searchInfo.pageNum = this.currentPage
            searchInfo.pageSize = this.pageSize
            searchInfo.apiId = this.APIName
            searchInfo.callerId = this.channelName
            searchInfo.active = this.status
            if (type === 'search') {
                searchInfo.type = 'search'
                this.currentPage = 1
                this.saveSearchInfo(searchInfo)
            } else {
                searchInfo.type = undefined
                this.saveSearchInfo(searchInfo)
            }
            this.openLoading()
            subconfigApi.getOrderApi(this.getSearchInfo).then(({data: {resultCode, msg, result}}) => {
                this.closeLoading()
                if (resultCode === '000000') {
                    this.tableData = result.list
                    this.totalNum = result.total
                } else {
                    this.$Message.error({
                        content: msg,
                        duration: 3
                    })
                }
            })
        },
        watchNameClick (row) {
            this.$router.push({
                name: 'subDetails',
                params: {
                    orderId: row.id,
                    apiName: row.apiName,
                    channelName: row.callerName
                }
            })
        },
        stateAPIClick (row) {
            let content, active
            if (row.active) {
                content = '您将禁用此API，是否继续？'
                active = false
            } else {
                content = '您将启用此API，是否继续？'
                active = true
            }
            this.$Modal.confirm({
                title: '提示',
                content: content,
                cancelText: '取消',
                loading: true,
                onOk: () => {
                    subconfigApi.updateStatusOrderedAPI({
                        id: row.id,
                        active: active
                    }).then(({data: {resultCode, msg}}) => {
                        if (resultCode === '000000') {
                            this.$Modal.remove()
                            this.$Message.success({
                                content: msg,
                                duration: 2
                            })
                            row.active = !row.active
                        } else {
                            this.$Modal.remove()
                            this.$Message.error({
                                content: msg,
                                duration: 2
                            })
                            row.active = row.active
                        }
                    })
                }
            })
        },
        onSearchClick () {
            this.getOrderApi('search')
        }
    },
    computed: {
        ...mapGetters({
            getSearchInfo: 'getSearchInfo'
        })
    }
}
</script>

<style lang="less" scoped>
</style>
