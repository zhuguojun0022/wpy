<template>
<GPage bg class="bill-manage-page">
    <table-header>
        <template slot="right">
            <Input v-model="filterName" placeholder="收单账户" style="width: 200px" clearable></Input>
            <Select v-model="filterRole" style="width: 200px" placeholder="支付渠道">
                <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="filterStatus" style="width: 200px" placeholder="对账进度">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="filterStatus" style="width: 200px" placeholder="日期">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>

    <Table :row-class-name="rowClassName" :columns="columns" :data="tableData"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

</GPage>
</template>
<script>
import {TableHeader, TableFooter, TableSwitch} from '../../components/table'
import {billApi} from '../../apis/'
import {mapMutations} from 'vuex'

export default {
    components: {TableHeader, TableFooter, TableSwitch},
    data () {
        return {
            filterName: '',
            filterRole: '',
            filterStatus: '',
            roleList: [],
            statusList: [],
            columns: [
                {title: '收单商户', key: 'merchants'},
                {title: '支付渠道', key: 'payChannel'},
                {title: '对账开始时间', key: 'startTime'},
                {title: '对账结束时间', key: 'endTime'},
                {title: '渠道账单生成时间', key: 'generateTime'},
                {title: '净交易额', key: 'businessAmount'},
                {title: '总收入金额 | 笔数', key: 'totalAmount'},
                {title: '渠道手续费', key: 'fees'},
                {
                    title: '对账进度',
                    key: 'progress',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: row.progress,
                            style: {
                                color: row.progress === '有差异' ? 'red' : '#495060'
                            }
                        }])
                    }
                },
                {
                    title: '操作',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '查看明细',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.onWatchClick(row.billId)
                                }
                            }
                        }])
                    }
                }
            ],
            tableData: [],
            totalNum: 0,
            currentPage: 1
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: to.name,
                icon: 'icon-duizhangguanli'
            })
        })
    },
    created () {
        this.searchBillList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        rowClassName (row) {
            if (row.progress === '有差异') {
                return 'error-line'
            } else {
                return ''
            }
        },
        handleCurrentChange () {},
        onSearchClick () {},
        onWatchClick (id) {
            this.$router.push({
                name: 'billDetails',
                params: {
                    id: id
                }
            })
        },
        searchBillList () {
            billApi.searchBillList().then(({data: {result, code, msg}}) => {
                this.tableData = result.list
                this.totalNum = result.totalNum
            })
        }
    }
}
</script>
<style lang="less">
.bill-manage-page {
    .ivu-table td {
        background: transparent;
    }
    .error-line {
        background: rgba(255, 172, 172, 0.788);
    }
}
</style>
