<template>
<GPage bg>
    <table-header>
        <template slot="right">
            <Input v-model="filterName" placeholder="商户名称" style="width: 200px" clearable></Input>
            <Select v-model="filterType" style="width: 200px" placeholder="商户类型">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="filterStatus" style="width: 200px" placeholder="配置状态">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>

    <Table :columns="columns" :data="tableData"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

    <Modal v-model="diaShow" :title="diaTitle" ref="modal">
        <Form :model="contractItems" :label-width="140" :rules="ruleValidate" :ref="formRef" class="new-merchants-form">
            <FormItem prop="merchantsName" label="商户名称" required>
                <Input v-model.trim="contractItems.merchantsName" placeholder="请输入商户名称"></Input>
            </FormItem>
            <FormItem prop="businessScene" label="业务场景" required>
                <Select v-model="contractItems.businessScene">
                    <Option v-for="item in businessSceneList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="tradeType" label="交易类型" required>
                <Select v-model="contractItems.tradeType">
                    <Option v-for="item in tradeTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="payType" label="支付产品" required>
                <Select v-model="contractItems.payType">
                    <Option v-for="item in payTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="activeTime" label="交易有效时长">
                <Input v-model.trim="contractItems.activeTime" placeholder="请输入交易有效时长"></Input>
            </FormItem>
            <FormItem prop="payTypeCollection" label="支付方式集" required>
                <Select v-model="contractItems.payTypeCollection">
                    <Option v-for="item in payTypeCollectionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="channel" label="支持的医保结算渠道" required>
                <Select v-model="contractItems.channel">
                    <Option v-for="item in channelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="payLimit" label="限定支付选项" required>
                <Select v-model="contractItems.payLimit">
                    <Option v-for="item in payLimitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="refundActiveTime" label="退款有效期" required>
                <Input v-model.trim="contractItems.refundActiveTime" placeholder="请输入退款有效期"></Input>
            </FormItem>
            <FormItem prop="refundLimit" label="退款限制" required>
                <Select v-model="contractItems.refundLimit">
                    <Option v-for="item in refundLimitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="onCancelClick(formRef)">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitClick(formRef)">提交</Button>
        </div>
    </Modal>
</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../../components/table'
import {channelApi} from '../../../apis/'
import {mapMutations} from 'vuex'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            filterName: '',
            filterType: '',
            filterStatus: '',
            statusList: [],
            typeList: [],
            columns: [
                {title: '商户编号', key: 'businessCode'},
                {title: '商户名称', key: 'businessName'},
                {title: '商户类型', key: 'merchantsType'},
                {title: '配置状态', key: 'status'},
                {
                    title: '操作',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '合同参数配置',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.onEditClick(row)
                                }
                            }
                        }, {
                            label: '启用',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.onStatusChange(row)
                                }
                            }
                        }])
                    }
                }
            ],
            tableData: [],
            totalNum: 0,
            currentPage: 1,
            diaShow: false,
            diaTitle: '配置签约信息',
            modal_loading: false,
            formRef: 'addmerchants',
            contractItems: {},
            ruleValidate: {
                username: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^\w+$/, message: '只能包含字母、数字、_', trigger: 'blur'}
                ],
                nickname: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, message: '只能包含中文、字母、数字、_', trigger: 'blur'}
                ],
                roles: [{required: true, message: '必填项', trigger: 'blur'}]
            },
            businessSceneList: [],
            tradeTypeList: [],
            payTypeList: [],
            payTypeCollectionList: [],
            channelList: [],
            payLimitList: [],
            refundLimitList: []
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: to.name,
                icon: 'icon-qudaoguanli'
            })
        })
    },
    created () {
        this.searchContractList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onSearchClick () {},
        handleCurrentChange (v) {},
        onEditClick (row) {
            this.contractItems = {...row}
            this.diaTitle = '修改商户基本信息'
            this.diaShow = true
            this.formRef = 'editmerchants'
        },
        onCancelClick (name) {
            this.$refs[name].resetFields()
            this.diaShow = false
            this.diaTitle = '配置签约信息'
            this.formRef = 'addmerchants'
        },
        onSubmitClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!')
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        searchContractList () {
            channelApi.searchContractList().then(({data: {result, code, msg}}) => {
                this.tableData = result.constractList
                this.totalNum = result.total
            })
        }
    }
}
</script>
<style lang="less" scoped>
</style>
