<!-- 添加调用者页面 -->
<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Button type="primary" @click="addOrderUser">增加调用者</Button>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="24">
            <Table highlight-row :columns="columns" :data="tableData" :height="tableHeihgt"></Table>
            <table-footer :total-num="totalNum" :current-page="currentPage" :page-size="pageSize" @on-change="handleMainChange"></table-footer>
        </Col>
    </Row>
    <Modal v-model="newOrderShow" :title="newOrderTitle" ref="modal">
        <Select v-model.trim="newCaller" multiple>
            <Option v-for="(item, index) in nosubCallerList" :key="index" :value="item.id">
                {{ item.name }}
            </Option>
        </Select>
        <div slot="footer">
            <Button type="ghost" @click="onCancelClick()">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitClick()">确认</Button>
        </div>
    </Modal>
</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../components/table'
import {mapMutations} from 'vuex'
import {subconfigApi} from '../../apis'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            tableData: [],
            columns: [
                {title: '调用者', key: 'callerName'},
                {title: '已订阅数', key: 'orderNum'},
                {title: '即将过期数', key: 'expringCount'},
                {
                    title: '操作',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '配置订阅',
                            type: 'primary',
                            on: {
                                click: (e) => {
                                    e.stopPropagation()
                                    this.$router.push({
                                        name: 'OrderConfig',
                                        params: {
                                            callerId: row.callerId,
                                            callerName: row.callerName
                                        }
                                    })
                                }
                            }
                        }])
                    }
                }
            ],
            newOrderShow: false,
            newOrderTitle: '新建订阅关系',
            modal_loading: false,
            newCaller: [],
            currentPage: 1,
            pageSize: 20,
            totalNum: 0,
            tableHeihgt: '',
            nosubCallerList: []
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '订阅配置',
                icon: 'icon-fuwuguanli'
            })
        })
    },
    created () {
        this.searchCallerList()
        this.tableHeihgt = window.innerHeight - 224
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        handleMainChange (v) {
            this.currentPage = v
            this.searchCallerList()
        },
        getNoSubCallers () {
            subconfigApi.getNoSub().then(({data: {resultCode, msg}}) => {
            })
            this.nosubCallerList = [{
                id: 1,
                name: 'test1'
            }, {
                id: 2,
                name: 'test2'
            }]
        },
        addOrderUser () {
            this.getNoSubCallers()
            this.newOrderShow = true
        },
        onCancelClick () {
            this.newOrderShow = false
            this.newCaller = []
        },
        onSubmitClick () {
            subconfigApi.addSub({
                callerId: this.newCaller
            }).then((result) => {
            })
            this.$Message.success({
                content: 'success',
                duration: 5
            })
            this.newOrderShow = false
            this.newCaller = []
            this.searchCallerList()
        },
        searchCallerList () {
            // this.openLoading()
            subconfigApi.getSub().then(({data: {resultCode, msg}}) => {
                // this.closeLoading()
            })
            this.tableData = [{
                callerName: '调用者1',
                orderNum: 2,
                expringCount: 1,
                callerId: '0123Eda222'
            }, {
                callerName: '调用者2',
                orderNum: 4,
                expringCount: 1,
                callerId: '0lllEda222'
            }, {
                callerName: '调用者3',
                orderNum: 3,
                expringCount: 0,
                callerId: '199jda222'
            }, {
                callerName: '调用者4',
                orderNum: 2,
                expringCount: 2,
                callerId: '0123Eda333'
            }]
            this.totalNum = this.tableData.length
        }
    },
    computed: {}
}
</script>

<style  lang="less" scoped>
</style>
