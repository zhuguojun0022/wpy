<!-- 配置订阅页面 -->
<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Button type="primary" @click="addOrder">新增订阅</Button>
        </div>
        <div slot="right">
            <Select filterable v-model="APIName" placeholder="API名称" style="width: 200px" clearable>
                <Option v-for="item in apiList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select filterable v-model="channelName" placeholder="渠道名称" style="width: 200px" clearable>
                <Option v-for="item in channelList" :value="item.channelId" :key="item.channelId">{{ item.AAZ571 }}</Option>
            </Select>
            <Select v-model="status" style="width: 200px" placeholder="状态">
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
import {mapMutations} from 'vuex'
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
                            label: !row.active ? '启用' : '',
                            type: 'success',
                            style: {
                                marginRight: '5px',
                                display: !row.active && filter(row).label !== '已过期' ? 'inline-block' : 'none'
                            },
                            on: {
                                click: (e) => {
                                    this.stateAPIClick(row)
                                }
                            }
                        }, {
                            label: '——',
                            type: 'primary',
                            style: {
                                marginRight: '5px',
                                display: !row.active && filter(row).label !== '已过期' ? 'none' : 'inline-block',
                                color: '#cccccc'
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
        this.callerId = this.$route.params.callerId
        // console.log(this.$route.params.callerName)
        this.resetBreadcrumb({
            name: '订阅配置',
            icon: 'icon-fuwuguanli'
        })
        // this.pushBreadcrumb({
        //     name: this.$route.params.callerName
        // })
        this.appId = this.$route.params.appId
        this.getApiList()
        this.getChannelList()
        this.getOrderApi(this.callerId)
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'openLoading', 'closeLoading', 'resetStep', 'resetBreadcrumb']),
        handleMainChange (v) {
            this.currentPage = v
            this.getOrderApi()
        },
        // 获取api列表
        getApiList () {
            subconfigApi.getApiList({
                name: null,
                active: true
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
                name: ''
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
            if (type === 'search') {
                searchInfo.apiId = this.APIName
                searchInfo.callerId = this.channelName
                searchInfo.active = this.status
            }
            this.openLoading()
            subconfigApi.getOrderApi({
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                apiId: searchInfo.apiId,
                callerId: searchInfo.callerId,
                active: searchInfo.active
            }).then(({data: {resultCode, msg, result}}) => {
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
                    apiId: row.id,
                    apiName: row.apiName,
                    channelName: row.callerName
                }
            })
        },
        stateAPIClick (row) {
            this.$Modal.confirm({
                title: '提示',
                content: '您将启用此API，是否继续？',
                cancelText: '取消',
                loading: true,
                onOk: () => {
                    subconfigApi.updateStatusOrderedAPI({
                        id: row.id,
                        active: true
                    }).then(({data: {resultCode, msg}}) => {
                        if (resultCode === '000000') {
                            this.$Modal.remove()
                            this.$Message.success({
                                content: msg,
                                duration: 2
                            })
                            row.active = true
                        } else {
                            this.$Modal.remove()
                            this.$Message.error({
                                content: msg,
                                duration: 2
                            })
                            row.active = false
                        }
                    })
                }
            })
        },
        onSearchClick () {
            this.getOrderApi('search')
        }
    },
    computed: {}
}
</script>

<style  lang="less" scoped>
</style>
