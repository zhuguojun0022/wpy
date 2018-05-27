<template>
<GPage bg>
    <table-header>
        <template slot="left">
            <Button type="primary" @click="onCreateNewMerchant">新增商户</Button>
        </template>
        <template slot="right">
            <Input v-model="filterName" placeholder="渠道名称" style="width: 200px" clearable></Input>
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
        <Form :model="merchantsItems" :label-width="120" :rules="ruleValidate" :ref="formRef" class="new-merchants-form">
            <FormItem prop="merchantsName" label="客户名称" required>
                <Input v-model.trim="merchantsItems.merchantsName" placeholder="请输入渠道名称"></Input>
            </FormItem>
            <FormItem prop="merchantsType" label="商户类型" required>
                <Select v-model="merchantsItems.merchantsType">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="yCode" label="医疗机构编码" required>
                <Input v-model.trim="merchantsItems.yCode" placeholder="请输入医疗机构编码"></Input>
            </FormItem>
            <FormItem prop="sCode" label="社保地区码" required>
                <Input v-model.trim="merchantsItems.sCode" placeholder="请输入社保地区码"></Input>
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
import {TableHeader, TableFooter, TableSwitch} from '../../../components/table'
import {channelApi} from '../../../apis/'
import {mapMutations} from 'vuex'

export default {
    components: {TableHeader, TableFooter, TableSwitch},
    data () {
        return {
            filterName: '',
            filterType: '',
            filterStatus: '',
            statusList: [],
            typeList: [],
            columns: [
                {title: '商户编号', key: 'merchantsCode'},
                {title: '商户名称', key: 'merchantsName'},
                {title: '商户类型', key: 'merchantsType'},
                {title: '配置状态', key: 'status'},
                {
                    title: '操作',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '修改',
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
            diaTitle: '新增商户',
            modal_loading: false,
            formRef: 'addmerchants',
            merchantsItems: {},
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
            }
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
        this.searchMerchantsList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onCreateNewMerchant () {
            this.diaShow = true
        },
        onSearchClick () {},
        handleCurrentChange (v) {},
        onEditClick (row) {
            this.merchantsItems = {...row}
            this.diaTitle = '修改商户基本信息'
            this.diaShow = true
            this.formRef = 'editmerchants'
        },
        onCancelClick (name) {
            this.$refs[name].resetFields()
            this.diaShow = false
            this.diaTitle = '新增商户'
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
        searchMerchantsList () {
            channelApi.searchMerchantsList().then(({data: {result, code, msg}}) => {
                this.tableData = result.userList
                this.totalNum = result.totalNum
            })
        }
    }
}
</script>
<style lang="less" scoped>
</style>
