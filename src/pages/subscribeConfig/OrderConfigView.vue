<!-- 配置订阅页面 -->
<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Button type="primary" @click="addOrder">新增订阅</Button>
        </div>
        <div slot="right">
            <RadioGroup type="button" v-model="activeType">
                <Radio :label="1">全部</Radio>
                <Radio :label="2">已过期</Radio>
            </RadioGroup>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="24">
            <Table highlight-row :columns="columns" :data="tableData" :height="tableHeihgt"></Table>
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
        let filter = (serverTime, row) => {
            if (row.subscribeExpire <= serverTime) {
                return {
                    label: '已过期',
                    color: 'default',
                    border: '1px solid grey'
                }
            } else {
                if (!row.active) {
                    return {
                        label: '未启用',
                        color: 'red',
                        border: '1px solid red'
                    }
                } else if (row.active) {
                    if (row.subscribeBegin > serverTime) {
                        return {
                            label: '未生效',
                            color: 'default',
                            border: '1px solid #f90'
                        }
                    } else if (row.subscribeBegin <= serverTime && row.subscribeExpire > serverTime) {
                        return {
                            label: '已生效',
                            color: 'green',
                            border: '1px solid #19be6b'
                        }
                    }
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
                {title: 'API描述', key: 'apiComments'},
                {title: '生效时间', key: 'activeTime'},
                {title: '有效时间至', key: 'endTime'},
                {
                    title: '状态',
                    fixed: 'center',
                    render: (h, {column, index, row}) => {
                        let serverTime = this.serverTime
                        return this.getCellRender(h, [{
                            label: filter(serverTime, row).label,
                            color: filter(serverTime, row).color,
                            tag: 'Tag',
                            on: {
                                click: () => {
                                    this.watchNameClick(row)
                                }
                            }
                        }])
                    }
                },
                {
                    title: '操作',
                    render: (h, {column, index, row}) => {
                        let serverTime = this.serverTime
                        return this.getCellRender(h, [{
                            label: !row.active ? '启用' : '',
                            type: 'success',
                            style: {
                                marginRight: '5px',
                                display: !row.active && filter(serverTime, row).label !== '已过期' ? 'inline-block' : 'none'
                            },
                            on: {
                                click: (e) => {
                                    this.stateAPIClick(row)
                                }
                            }
                        }, {
                            label: '复制',
                            type: 'primary',
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: (e) => {
                                    this.copyApiClick(row)
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
            serverTime: 0,
            activeType: 1
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
        this.pushBreadcrumb({
            name: this.$route.params.callerName
        })
        this.appId = this.$route.params.appId
        this.getOrderApi(this.callerId)
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'openLoading', 'closeLoading', 'resetStep', 'resetBreadcrumb']),
        handleMainChange (v) {
            this.currentPage = v
            this.getOrderApi()
        },
        addOrder () {
            this.resetStep()
            this.$router.push({
                name: 'addOrder',
                params: {
                    appId: this.appId,
                    callerId: this.callerId,
                    callerName: this.$route.params.callerName
                }
            })
        },
        getOrderApi () {
            this.openLoading()
            subconfigApi.getOrderApi({
                callerId: this.callerId,
                activeType: this.activeType === 1 ? '5' : '6'
            }).then(({data: {resultCode, msg}}) => {
                if (resultCode === 404) {
                }
            })
            this.closeLoading()
            this.tableData = [
                {
                    active: false,
                    activeTime: '2018-06-01',
                    activeType: 0,
                    antiReplayAttack: false,
                    apiAuthRequired: true,
                    apiComments: '',
                    apiId: '01490ea66942000',
                    apiName: '人员管理',
                    apiPath: '/user',
                    apiSignFailure: null,
                    bgPath: null,
                    callerId: null,
                    concurrentLimit: 0,
                    encryption: false,
                    endTime: '2023-10-01',
                    free: false,
                    groupName: 'qwe',
                    id: '028asd299012210',
                    subscribeBegin: 1527782400000,
                    subscribeDuration: 60,
                    subscribeExpire: 1685548800000
                }, {
                    active: true,
                    activeTime: '2020-12-01',
                    activeType: 0,
                    antiReplayAttack: false,
                    apiAuthRequired: true,
                    apiComments: '这是一条测试数据',
                    apiId: '01490ea66942000',
                    apiName: '测试数据',
                    apiPath: '/user/23123sao',
                    apiSignFailure: null,
                    bgPath: null,
                    callerId: null,
                    concurrentLimit: 0,
                    encryption: false,
                    endTime: '2020-11-19',
                    free: false,
                    groupName: 'qwe',
                    id: '028asd2ppp12210',
                    subscribeBegin: 1527782400000,
                    subscribeDuration: 60,
                    subscribeExpire: 1685548800000
                }
            ]
            this.serverTime = 1532499166598
            this.totalNum = this.tableData.length
        },
        watchNameClick (row) {
            this.$router.push({
                name: 'subDetails',
                params: {
                    orderId: row.id,
                    appId: this.appId,
                    way: 'edit',
                    serverTime: this.serverTime,
                    callerName: this.$route.params.callerName,
                    apiName: row.apiName
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
                        id: row.id
                    }).then(({data: {resultCode, msg}}) => {
                    })
                    this.$Modal.remove()
                    this.$Message.success({
                        content: 'success',
                        duration: 2
                    })
                    row.active = true
                }
            })
        },
        copyApiClick (row) {
            this.$router.push({
                name: 'copy',
                params: {
                    orderId: row.id,
                    callerId: this.callerId
                }
            })
        }
    },
    computed: {},
    watch: {
        activeType () {
            this.getOrderApi()
        }
    }
}
</script>

<style  lang="less" scoped>
</style>
