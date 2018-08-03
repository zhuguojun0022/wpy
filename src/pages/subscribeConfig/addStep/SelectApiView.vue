<!-- 新增订阅页面 -->
<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Input v-model="orderApiName" style="width: 200px;" type="text" placeholder="请输入" auto-complete="off"></Input>
            <Button icon="search">查询</Button>
        </div>
        <div slot="right">
            <Button type="primary" @click="nextStep">下一步</Button>
            <Button style="min-width: 52px;">取消</Button>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="24">
            <Table highlight-row :columns="columns" :data="tableData" :height="tableHeihgt" @on-current-change="onCurrentChange"></Table>
            <table-footer :total-num="totalNum" :current-page="currentPage" :page-size="pageSize" @on-change="handleMainChange"></table-footer>
        </Col>
    </Row>
</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../../components/table'
import { mapGetters, mapMutations } from 'vuex'
// import server from '../../config/httpConfig'
// import {systemApi} from '../../apis'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            orderApiName: '',
            tableData: [],
            columns: [
                {
                    title: 'API名称',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: row.name,
                            style: {
                                marginRight: '10px',
                                lineHeight: '28px',
                                display: 'block',
                                float: 'left'
                            }
                        }, {
                            tag: 'Tag',
                            color: 'yellow',
                            label: '虚拟',
                            style: {
                                display: row.virtual ? 'inline-block' : 'none'
                            }
                        }])
                    }
                },
                {title: '描述', key: 'comments'},
                {title: '服务组', key: 'groupName'}
            ],
            currentPage: 1,
            pageSize: 20,
            totalNum: 0,
            tableHeihgt: '',
            serverTime: 0,
            activeType: 1
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.pushBreadcrumb({
                name: '新增订阅'
            })
        })
    },
    created () {
        this.getOrderApi()
        this.tableHeihgt = window.innerHeight - 284
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'openLoading', 'closeLoading', 'setStep', 'setApiInfo']),
        handleMainChange (v) {
            this.currentPage = v
            this.getOrderApi()
        },
        getOrderApi () {
            this.openLoading()
            this.closeLoading()
            this.tableData = [
                {
                    groupName: 'helloworld',
                    comments: 'this is a describe',
                    id: '01490ea66942000',
                    name: '人员管理',
                    path: '/user',
                    serviceGroupId: '012345',
                    virtual: false
                }, {
                    groupName: 'wohaoea',
                    comments: 'this is a describe123',
                    id: '01490ea0-942000',
                    name: '天气预报',
                    path: '/user',
                    serviceGroupId: '701223',
                    virtual: true
                }
            ]
            this.serverTime = 1532499166598
            this.totalNum = this.tableData.length
        },
        onCurrentChange (currentRow, oldRow) {
            this.setApiInfo(currentRow)
        },
        nextStep () {
            if (Object.keys(this.apiInfo).length < 1) {
                this.$Message.warning({
                    content: '您还未选择API，请选择',
                    duration: 5
                })
                return false
            }
            this.setStep()
        }
    },
    computed: {
        ...mapGetters({
            getStep: 'getStep',
            apiInfo: 'apiInfo'
        })
    },
    watch: {
    }
}
</script>
