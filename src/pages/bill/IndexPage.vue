<template>
<GPage bg class="bill-manage-page">
    <table-header>
        <template slot="right">
            <Input v-model="filterName" placeholder="收单账户" style="width: 200px" clearable></Input>
            <Select v-model="payType" style="width: 100px" placeholder="支付渠道">
                <Option v-for="item in roleList" :value="item.channelId" :key="item.channelId">{{ item.channelName }}</Option>
            </Select>
            <Select v-model="ContrastProcess" style="width: 100px" placeholder="对账进度">
                <Option v-for="item in statusList" :value="item.recordStatus" :key="item.recordStatus">{{ item.label }}</Option>
            </Select>
            <DatePicker type="date" placeholder="对账开始时间" style="width: 150px" v-model="startTime"></DatePicker>
            <DatePicker type="date" :options="endDate" placeholder="对账结束时间" style="width: 150px" v-model="endTime"></DatePicker>
            <DatePicker type="date" placeholder="渠道账单生成时间" style="width: 150px" v-model="bulidTime"></DatePicker>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>

    <Table :row-class-name="rowClassName" :columns="columns" :data="tableData"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../components/table'
import {billApi} from '../../apis/'
import {mapMutations} from 'vuex'
import {formatDateTime} from '../../common/utils'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            filterName: '',
            filterRole: '',
            filterStatus: '',
            roleList: [],
            startTime: '',
            endTime: '',
            bulidTime: '',
            payType: '',
            ContrastProcess: '',
            statusList: [
                {recordStatus: 3, label: '已核对'},
                {recordStatus: 4, label: '有差异'}
            ],
            columns: [
                {title: '收单商户', key: 'merchantName'},
                {title: '支付渠道', key: 'channelName'},
                {
                    title: '对账开始时间',
                    key: 'startTime',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: formatDateTime(row.startTime)
                        }])
                    }
                },
                {
                    title: '对账结束时间',
                    key: 'finishTime',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: formatDateTime(row.finishTime)
                        }])
                    }
                },
                {
                    title: '渠道账单生成时间',
                    key: 'createTime',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: formatDateTime(row.createTime)
                        }])
                    }
                },
                {title: '净交易额', key: 'netSales'},
                {
                    title: '总收入金额 | 笔数',
                    key: 'totalIncome',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: '￥' + row.totalIncome + ' | ' + row.incomeNum
                        }])
                    }
                },
                {title: '渠道手续费', key: 'channelFee'},
                {
                    title: '对账进度',
                    key: 'recordStatus',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: row.recordStatus === 1 ? '已核对' : '有差异',
                            style: {
                                color: row.progress === 0 ? 'red' : '#495060'
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
                                    console.log(row)
                                    var billInfo = JSON.stringify(row)
                                    sessionStorage.setItem('billInfo', billInfo)
                                    console.log(billInfo)
                                    this.onWatchClick(row.recordId)
                                }
                            }
                        }])
                    }
                }
            ],
            tableData: [],
            totalNum: 0,
            pageSize: 10,
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
        this.searchTypeList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        rowClassName (row) {
            if (row.progress === '有差异') {
                return 'error-line'
            } else {
                return ''
            }
        },
        handleCurrentChange () {},
        onSearchClick () {
            this.searchBillList()
            console.log(this.startTime.getTime(), this.endTime, this.bulidTime)
        },
        onWatchClick (id) {
            this.$router.push({
                name: 'billDetails',
                params: {
                    id: id
                }
            })
        },
        searchTypeList () {
            billApi.searchTypeList().then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    this.roleList = result
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
            })
        },
        searchBillList () {
            this.openLoading()
            let startTime = this.startTime === '' ? this.startTime : this.startTime.getTime()
            let endTime = this.startTime === '' ? this.startTime : this.startTime.getTime()
            let bulidTime = this.startTime === '' ? this.startTime : this.startTime.getTime()
            billApi.searchBillList(
                this.pageSize,
                this.currentPage,
                this.filterName,
                this.payType,
                this.ContrastProcess,
                startTime,
                endTime,
                bulidTime
            ).then(({data: {result, resultCode, msg}}) => {
                this.closeLoading()
                if (resultCode === '000000') {
                    this.tableData = result.list
                    this.totalNum = result.total
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
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
