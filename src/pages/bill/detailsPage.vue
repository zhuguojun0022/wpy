<template>
<GPage bg class="bill-details-page">
    <template>
        <div class="clearfix">
            <h5>对账记录</h5>
            <ul class="reconciliation pull-left" v-for="item in detailsTableData" :key="item" style="width: 50%">
                <li class="reconciliation-li">
                    <p class="reconciliation-p">收单商户</p>
                    <span class="reconciliation-span"> {{item.merchants}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">商户号</p>
                    <span class="reconciliation-span"> {{item.merchantsCode}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">对账日期</p>
                    <span class="reconciliation-span"> {{item.checkDate}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">对账进度</p>
                    <span class="reconciliation-span"> {{item.progress}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">支付渠道</p>
                    <span> {{item.payChannel}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">渠道账单生成时间</p>
                    <span class="reconciliation-span"> {{item.generateTime}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">对账开始时间</p>
                    <span class="reconciliation-span"> {{item.startTime}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-p">对账结束时间</p>
                    <span class="reconciliation-span"> {{item.endTime}} </span>
                </li>
            </ul>
            <ul class="reconciliation pull-left reconciliation-right" v-for="item in detailsTableData"  :key="item">
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">总收入金额</p>
                    <span class="reconciliation-span"> ￥{{item.totalAmount | filterMoney}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">总收入笔数</p>
                    <span class="reconciliation-span"> {{item.totalAmount | filterNum}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">总退款金额</p>
                    <span class="reconciliation-span"> ￥{{item.totalRefunds | filterMoney}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">总退款笔数</p>
                    <span class="reconciliation-span"> {{item.totalRefunds | filterNum}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">渠道手续费</p>
                    <span class="reconciliation-span"> ￥{{item.fees}} </span>
                </li>
                <li class="reconciliation-li">
                    <p class="reconciliation-right-p">净交易额</p>
                    <span class="reconciliation-span"> ￥{{item.businessAmount}} </span>
                </li>
            </ul>
        </div>
    </template>
    <template>
        <div class="check-result">
            <h5>核对结果</h5>
            <span class="check-group-title">核对状态</span>
            <Checkbox-group v-model="checkAll" @on-change="changeTableColumns" class="check-group">
                <Checkbox :label="checkbox.value" v-for="checkbox in checkboxGroup">{{checkbox.value}}</Checkbox>
            </Checkbox-group>
            <Table :columns="columns" :data="tableData"></Table>
            <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>
        </div>
    </template>
    <Modal v-model="errorHandlShow" :title="errorHandlTitle" ref="modal" class="bill-details">
        <Form :model="errorHandling" :label-width="90" class="chacuochuli" label-position="left">
            <FormItem prop="errorClass" label="差错分类" class="no-border">
                <Input v-model="errorHandling.errorClass" disabled></Input>
            </FormItem>
            <FormItem prop="errorContent" label="差错内容" class="no-border">
                <Input v-model="errorHandling.errorContent" disabled></Input>
            </FormItem>
            <Row  :gutter="16">
                <Col span="12">
                    <FormItem prop="beforeErrorState" label="交易" class="firstForm">
                        <Input v-model="errorHandling.beforeErrorState" disabled></Input>
                    </FormItem>
                    <FormItem prop="batch" label="交易流水号">
                        <Input v-model="errorHandling.batch" disabled></Input>
                    </FormItem>
                    <FormItem prop="transactionTime" label="交易完成时间">
                        <Input v-model="errorHandling.transactionTime" disabled></Input>
                    </FormItem>
                    <FormItem prop="typeTrade" label="交易类型">
                        <Input v-model="errorHandling.typeTrade" disabled></Input>
                    </FormItem>
                    <FormItem prop="beforeErrorState" label="交易状态">
                        <Input v-model="errorHandling.beforeErrorState" disabled></Input>
                    </FormItem>
                    <FormItem prop="money" label="金额">
                        <Input v-model="errorHandling.money" disabled></Input>
                    </FormItem>
                    <FormItem>
                        <Input disabled></Input>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem prop="money" label="支付渠道" class="firstForm">
                        <Input v-model="errorHandling.money" disabled></Input>
                    </FormItem>
                    <FormItem prop="channelPayNumber" label="渠道流水号">
                        <Input v-model="errorHandling.channelPayNumber" disabled></Input>
                    </FormItem>
                    <FormItem prop="transactionTime" label="交易完成时间">
                        <Input v-model="errorHandling.transactionTime" disabled></Input>
                    </FormItem>
                    <FormItem prop="typeTrade" label="交易类型">
                        <Input v-model="errorHandling.typeTrade" disabled></Input>
                    </FormItem>
                    <FormItem prop="money" label="金额">
                        <Input v-model="errorHandling.money" disabled></Input>
                    </FormItem>
                    <FormItem prop="channelFee" label="服务费">
                        <Input v-model="errorHandling.channelFee" disabled></Input>
                    </FormItem>
                    <FormItem prop="channelSettlementMoney" label="结算金额">
                        <Input v-model="errorHandling.channelSettlementMoney" disabled></Input>
                    </FormItem>
                </Col>
            </Row>
            <FormItem prop="errorProcessDescribe" label="差错处理描述" class="no-border errorDescribe">
                <Input v-model="errorHandling.errorProcessDescribe" type="textarea"></Input>
            </FormItem>
        </Form>
    </Modal>
</GPage>
</template>
<script>
import {TableHeader, TableFooter, TableSwitch} from '../../components/table'
import {billApi} from '../../apis/'
import {mapMutations} from 'vuex'

export default {
    components: {TableHeader, TableFooter, TableSwitch},
    name: 'billDetails',
    data () {
        return {
            checkboxGroup: [
                {value: '平账'},
                {value: '差异账'},
                {value: '人工平账'},
                {value: '单边账'},
                {value: '支付渠道单边账'},
                {value: '待对账'}
            ],
            detailsTableData: [],
            checkAll: ['平账'],
            tableDataClon: [],
            errorHandling: {},
            errorHandlShow: false,
            errorHandlTitle: '差错处理',
            uid: this.$route.params.id,
            tableData: [],
            totalNum: 0,
            currentPage: 1,
            columns: [
                {title: '交易流水号', key: 'batch', width: 140},
                {title: '渠道支付流水号', key: 'channelPayNumber', width: 140},
                {title: '交易完成时间', key: 'transactionTime', width: 160},
                {title: '渠道交易完成时间', key: 'channelTime', width: 160},
                {title: '交易类型', key: 'typeTrade', width: 100},
                {title: '金额', key: 'money', width: 100},
                {title: '渠道金额', key: 'channelMoney', width: 100},
                {title: '渠道手续费', key: 'channelFee', width: 100},
                {title: '渠道结算金额', key: 'channelSettlementMoney', width: 140},
                {title: '核对状态', key: 'checkState', width: 100},
                {title: '核对完成时间', key: 'checkFinishTime', width: 160},
                {title: '核对次数', key: 'checkNumber', width: 100},
                {title: '差错分类', key: 'errorClass', width: 100},
                {title: '差错内容', key: 'errorContent', width: 100},
                {title: '差错处理描述', key: 'errorProcessDescribe', width: 160},
                {title: '差错处理时间', key: 'errorProcessTime', width: 160},
                {title: '差错处理前核对状态', key: 'beforeErrorState', width: 160, fixed: 'right'},
                {
                    title: '操作',
                    width: 140,
                    fixed: 'right',
                    render: (h, {column, index, row}) => {
                        if (row.beforeErrorState !== '') {
                            return this.getCellRender(h, [{
                                label: '差错处理',
                                type: 'error',
                                on: {
                                    click: () => {
                                        this.clickErrHadling(row)
                                    }
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
            vm.resetBreadcrumb({
                name: to.name,
                icon: 'home'
            })
        })
    },
    created () {
        this.searchReconciliation()
        this.searchBilllDetails()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        handleCurrentChange () {},
        changeTableColumns (checkAll) {
            let tableDataClon = this.tableDataClon
            if (checkAll.length === 0) {
                this.tableData = tableDataClon
            } else {
                let newtableData = tableDataClon.filter(item => {
                    return checkAll.includes(item.checkState)
                })
                this.tableData = newtableData
                console.log(checkAll)
            }
        },
        clickErrHadling (row) {
            this.errorHandling = {...row}
            console.log(this.errorHandling)
            this.errorHandlTitle = '差错处理'
            this.errorHandlShow = true
        },
        searchBilllDetails () {
            billApi.searchBilllDetails().then(({data: {result, code, msg}}) => {
                this.detailsTableData = result.listty
            })
        },
        searchReconciliation () {
            billApi.searchReconciliation().then(({data: {result, code, msg}}) => {
                // this.tableData = result.list
                let reconciliation = '平账'
                this.tableDataClon = result.list
                this.totalNum = result.totalNum
                this.tableData = this.tableDataClon.filter(item => {
                    return reconciliation.includes(item.checkState)
                })
            })
        }
    },
    computed: {},
    filters: {
        filterMoney: function (value) {
            let filtermoney = value.split('|')
            return filtermoney[0]
        },
        filterNum: function (value) {
            let filternum = value.split('|')
            return filternum[1]
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
