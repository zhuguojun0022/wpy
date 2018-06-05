<template>
<GPage bg class="bill-details-page">
    <template>
        <div class="clearfix">
            <h5>对账记录</h5>
            <ul class="reconciliation pull-left" style="width: 50%">
                <li class="reconciliation-li">
                    <p class="reconciliation-p">收单商户</p>
                    <span class="reconciliation-span"> {{detailsTableData.merchantName}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">商户号</p>
                    <span class="reconciliation-span"> {{detailsTableData.merchantId}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">对账日期</p>
                    <span class="reconciliation-span"> {{detailsTableData.startTime | filterstartTime}} 至 {{detailsTableData.finishTime | filterfinishTimee}}</span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">对账进度</p>
                    <span class="reconciliation-span"> {{detailsTableData.progress | filterProgress}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">支付渠道</p>
                    <span> {{detailsTableData.channelName}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">渠道账单生成时间</p>
                    <span class="reconciliation-span"> {{detailsTableData.createTime | filtercreateTime}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">对账开始时间</p>
                    <span class="reconciliation-span"> {{detailsTableData.startTime | filterstartTime}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">对账结束时间</p>
                    <span class="reconciliation-span"> {{detailsTableData.finishTime | filterfinishTimee}} </span>
                </li>
            </ul>
            <ul class="reconciliation pull-left reconciliation-right">
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">总收入金额</p>
                    <span class="reconciliation-span"> ￥{{detailsTableData.totalIncome }} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">总收入笔数</p>
                    <span class="reconciliation-span"> {{detailsTableData.incomeNum }} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">总退款金额</p>
                    <span class="reconciliation-span"> ￥{{detailsTableData.totalRefund }} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">总退款笔数</p>
                    <span class="reconciliation-span"> {{detailsTableData.refundNum }} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">渠道手续费</p>
                    <span class="reconciliation-span"> ￥{{detailsTableData.channelFee }} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">净交易额</p>
                    <span class="reconciliation-span"> ￥{{detailsTableData.netSales}} </span>
                </li>
            </ul>
        </div>
    </template>
    <template>
        <div class="check-result">
            <h5>核对结果</h5>
            <span class="check-group-title">核对状态</span>
            <Checkbox-group v-model="checkAll" @on-change="changeTableColumns" class="check-group">
                <Checkbox v-for="checkbox in checkboxGroup" :value="checkbox.value" :label="checkbox.key" :key='checkbox.key'>{{checkbox.value}}</Checkbox>
            </Checkbox-group>
            <Table :columns="columns" :data="tableData"></Table>
            <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>
        </div>
    </template>
    <Modal v-model="errorHandlShow" :title="errorHandlTitle" ref="modal" class="bill-details" @on-ok="errorSure" @on-cancel="cancel">
        <Form :model="errorHandling" :label-width="90" class="chacuochuli" label-position="left">
            <FormItem prop="errorClass" label="差错分类" class="no-border">
                <strong>{{errStatus(errorHandling.errStatus)}}</strong>
            </FormItem>
            <FormItem prop="errorContent" label="差错内容" class="no-border">
                <strong>{{errorHandling.errDetail}}</strong>
            </FormItem>
            <Row  :gutter="16">
                <Col span="12">
                    <FormItem prop="beforeErrorState" label="交易" class="firstForm">
                        <strong>【{{checkStatus(errorHandling.checkStatus)}}】</strong>
                    </FormItem>
                    <FormItem prop="batch" :label-width='100' label="交易流水号">
                        <span>{{errorHandling.serialsNum}}</span>
                    </FormItem>
                    <FormItem prop="transactionTime" :label-width='100' label="交易完成时间">
                        <span>{{errorHandling.tradeFinishTime}}</span>
                    </FormItem>
                    <FormItem prop="typeTrade" :label-width='100' label="交易类型">
                        <span>{{tradeType(errorHandling.tradeType)}}</span>
                    </FormItem>
                    <FormItem prop="beforeErrorState" :label-width='100' label="交易状态">
                        <span>{{checkStatus(errorHandling.checkStatus)}}</span>
                    </FormItem>
                    <FormItem prop="money" :label-width='100' label="金额">
                        <span>￥ {{errorHandling.serialsSum}}</span>
                    </FormItem>
                    <FormItem>
                        <Input disabled></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem prop="money" label="支付渠道" class="firstForm">
                        <strong>【{{detailsTableData.channelName}}】</strong>
                    </FormItem>
                    <FormItem prop="channelPayNumber" :label-width='100' label="渠道流水号">
                        <span>{{errorHandling.channelSerialsNum}}</span>
                    </FormItem>
                    <FormItem prop="transactionTime" :label-width='100' label="交易完成时间">
                        <span>{{errorHandling.tradeFinishTime}}</span>
                    </FormItem>
                    <FormItem prop="typeTrade" :label-width='100' label="交易类型">
                        <span>{{tradeType(errorHandling.tradeType)}}</span>
                    </FormItem>
                    <FormItem prop="money" :label-width='100' label="金额">
                        <span>￥ {{errorHandling.serialsSum}}</span>
                    </FormItem>
                    <FormItem prop="channelFee" :label-width='100' label="服务费">
                        <span>￥ {{errorHandling.channelFee}}</span>
                    </FormItem>
                    <FormItem prop="channelSettlementMoney" :label-width='100' label="结算金额">
                        <span>￥ {{errorHandling.channelSerialsFixSum}}</span>
                    </FormItem>
                </Col>
            </Row>
            <FormItem prop="errorProcessDescribe" label="差错处理描述" class="no-border errorDescribe">
                <Input v-model="errorHandling.errHandle" :rows="4" type="textarea"></Input>
            </FormItem>
        </Form>
    </Modal>
</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../components/table'
import {billApi} from '../../apis/'
import {mapMutations} from 'vuex'
import {formatDateTime} from '../../common/utils'

export default {
    components: {TableHeader, TableFooter},
    name: 'billDetails',
    data () {
        return {
            checkboxGroup: [
                {value: '待对账', key: 0},
                {value: '平账', key: 1},
                {value: '平台单边账', key: 2},
                {value: '支付渠道单边账', key: 3},
                {value: '差异账', key: 4},
                {value: '人工平帐', key: 5}
            ],
            detailsTableData: {},
            checkAll: [],
            tableDataClon: [],
            empty: '',
            errorHandling: {},
            errorHandlShow: false,
            errHandle: '',
            errorHandlTitle: '差错处理',
            uid: this.$route.params.id,
            tableData: [],
            totalNum: 0,
            currentPage: 1,
            pageSize: 10,
            columns: [
                {title: '交易流水号', key: 'serialsNum', width: 140},
                {title: '渠道支付流水号', key: 'channelSerialsNum', width: 140},
                {
                    title: '交易完成时间',
                    key: 'tradeFinishTime',
                    width: 160,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: formatDateTime(row.tradeFinishTime)
                        }])
                    }
                },
                {
                    title: '渠道交易完成时间',
                    key: 'channelTradeFinishTime',
                    width: 160,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: formatDateTime(row.channelTradeFinishTime)
                        }])
                    }
                },
                {
                    title: '交易类型',
                    key: 'tradeType',
                    width: 100,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: this.tradeType(row.tradeType)
                        }])
                    }
                },
                {title: '金额', key: 'serialsSum', width: 100},
                {title: '渠道金额', key: 'channelSerialsSum', width: 100},
                {title: '渠道手续费', key: 'channelFee', width: 100},
                {title: '渠道结算金额', key: 'channelSerialsFixSum', width: 140},
                {
                    title: '核对状态',
                    key: 'checkStatus',
                    width: 100,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: this.checkStatus(row.checkStatus)
                        }])
                    }
                },
                {
                    title: '核对完成时间',
                    key: 'checkTime',
                    width: 160,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: formatDateTime(row.checkTime)
                        }])
                    }
                },
                {title: '核对次数', key: 'checkTimes', width: 100},
                {
                    title: '差错分类',
                    key: 'errStatus',
                    width: 100,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: this.errStatus(row.errStatus)
                        }])
                    }
                },
                {title: '差错内容', key: 'errDetail', width: 100},
                {title: '差错处理描述', key: 'errHandle', width: 160},
                {
                    title: '差错处理时间',
                    key: 'handleTime',
                    width: 160,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: formatDateTime(row.handleTime)
                        }])
                    }
                },
                {
                    title: '差错处理前核对状态',
                    key: 'preCheckStatus',
                    width: 160,
                    fixed: 'right',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: this.checkStatus(row.preCheckStatus)
                        }])
                    }
                },
                {
                    title: '操作',
                    width: 140,
                    fixed: 'right',
                    render: (h, {column, index, row}) => {
                        console.log('row.checkStatus', row.checkStatus)
                        if (row.checkStatus !== 0 && row.checkStatus !== 1 && row.checkStatus !== 5) {
                            return this.getCellRender(h, [{
                                label: '差错处理',
                                type: 'error',
                                on: {
                                    click: () => {
                                        this.clickErrHadling(row)
                                    }
                                }
                            }])
                        } else {
                            return this.getCellRender(h, [{
                                tag: 'span',
                                label: ' --',
                                style: {
                                    marginLeft: '8px'
                                }
                            }])
                        }
                    }
                }
            ]
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.pushBreadcrumb({
                name: '对账详情'
            })
        })
    },
    created () {
        this.searchBillRecordList()
    },
    mounted () {
        this.searchBilllDetails()
    },
    beforeDestroy () {
        window.sessionStorage.removeItem('billInfo')
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'openLoading', 'closeLoading']),
        handleCurrentChange () {},
        checkStatus (status) {
            if (status === 0) {
                return '待对账'
            } else if (status === 1) {
                return '平帐'
            } else if (status === 2) {
                return '平台单边账'
            } else if (status === 3) {
                return '支付渠道单边账'
            } else if (status === 4) {
                return '差异账'
            } else if (status === 5) {
                return '人工平账'
            }
        },
        tradeType (status) {
            if (status === 0) {
                return '消费'
            } else if (status === 1) {
                return '退款'
            } else if (status === 2) {
                return '冲正'
            }
        },
        errStatus (status) {
            if (status === 0) {
                return '支付状态不一致'
            } else if (status === 1) {
                return '第三方支付流水号不一致'
            } else if (status === 2) {
                return '交易类型不一致'
            } else if (status === 3) {
                return '金额不一致'
            } else if (status === 4) {
                return '退款原渠道流水号不一致'
            } else if (status === 5) {
                return '交易日期不一致'
            } else if (status === 6) {
                return '重复退款'
            }
        },
        changeTableColumns (checkAll) {
            this.searchBillRecordList()
        },
        clickErrHadling (row) {
            this.errorHandling = {...row}
            console.log(this.errorHandling)
            this.errorHandlTitle = '差错处理'
            this.errorHandlShow = true
        },
        searchBilllDetails () {
            let billInfo = sessionStorage.getItem('billInfo')
            this.detailsTableData = JSON.parse(billInfo)
            console.log(this.detailsTableData)
        },
        searchBillRecordList () {
            billApi.searchBillRecordList(this.pageSize, this.currentPage, this.checkAll).then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    this.tableData = result.list
                    this.totalNum = result.total
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
            })
        },
        errorSure () {
            let tradeId = this.errorHandling.tradeId
            let recordId = this.errorHandling.recordId
            let errHandle = this.errorHandling.errHandle
            billApi.updateErrorHandle(tradeId, recordId, errHandle).then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    this.searchBillRecordList()
                    this.$Message.success(msg)
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
            })
        },
        cancel () {}
    },
    computed: {

    },
    filters: {
        filterProgress: function (value) {
            let filterProgress = value === 1 ? '已核对' : '有差异'
            return filterProgress
        },
        filterChannelName: function (value) {
            let filterChannelName = value === 1 ? '已核对' : '有差异'
            return filterChannelName
        },
        filtercreateTime: function (value) {
            let filtercreateTime = formatDateTime(value)
            return filtercreateTime
        },
        filterfinishTimee: function (value) {
            let filterfinishTimee = formatDateTime(value)
            return filterfinishTimee
        },
        filterstartTime: function (value) {
            let filterstartTime = formatDateTime(value)
            return filterstartTime
        }
    }
}
</script>
<style lang="less">
.bill-details-page{
.reconciliation{
    &-li{
        list-style: none;
    }
    &-p{
        display: inline-block;
        width: 140px;
        padding: 10px 0;
        color: #999999;
    }
    &-span{
        padding: 10px 0;
    }
}
.reconciliation-right{
    &-p{
        display: inline-block;
        width: 100px;
        padding: 10px 0;
        color: #999999;
    }
}
.check-group{
        margin: 10px 0;
        display: inline-block;
        &-title{
            margin-right: 8px;
        }
    }
.check-result{
    margin: 20px 0;
}
}
.bill-details{
    .ivu-input[disabled]{
        background: transparent;
        color: #495060;
        border: none;
        cursor: default;
    }
    .ivu-modal{
        width: 660px !important;
    }
    .ivu-form-item{
        border: 1px solid #dddee1;
        border-top: none;
        padding-left: 4px;
        margin: 0;
    }
    .firstForm{
        background: #f8f8f9;
        font-weight: bold;
        border-top: 1px solid #dddee1;
        > span{
            margin-left: 10px;
        }
    }
    .no-border{
        border: none;
        margin: 8px 0;
    }
    .errorDescribe{
        .ivu-form-item-content{
            margin-left: 0 !important;
        }
    }
}
</style>
