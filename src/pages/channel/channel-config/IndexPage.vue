<template>
<GPage bg>
    <table-header>
        <template slot="left">
            <Button type="primary" @click="onCreateNewChannel">新增渠道</Button>
        </template>
        <template slot="right">
            <Input v-model="filterName" placeholder="渠道名称" style="width: 200px" clearable></Input>
            <Input v-model="filterCode" placeholder="渠道编码" style="width: 200px" clearable></Input>
            <Select v-model="filterStatus" style="width: 200px" placeholder="配置状态">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>

    <Table :columns="columns" :data="tableData"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

    <Modal v-model="diaShowBaseInfo" :title="diaTitleBaseInfo" ref="modal">
        <Form :model="channelItems" :label-width="80" :rules="ruleValidateBaseInfo" :ref="formRefBaseInfo" class="new-channel-form">
            <FormItem prop="channelName" label="渠道名称" required>
                <Input v-model.trim="channelItems.channelName" placeholder="请输入渠道名称"></Input>
            </FormItem>
            <FormItem prop="contact" label="联系人" required>
                <Input v-model.trim="channelItems.contact" placeholder="请输入联系人姓名"></Input>
            </FormItem>
            <FormItem prop="contactMode" label="联系方式" required>
                <Input v-model.trim="channelItems.contactMode" placeholder="请输入联系方式"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="onCancelBaseClick(formRefBaseInfo)">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitBaseClick(formRefBaseInfo)">提交</Button>
        </div>
    </Modal>
    <Modal v-model="diaShowConfigInfo" :title="diaTitleConfigInfo" ref="modal">
        <Form :model="configItems" :label-width="80" :rules="ruleValidateConfigInfo" :ref="formRefConfigInfo" class="config-channel-form">
            <FormItem prop="channelName" label="渠道名称" required>
                <Input v-model.trim="configItems.channelName" :disabled="true" placeholder=""></Input>
            </FormItem>
            <FormItem prop="sign" label="算法签名" required>
                <Select v-model="configItems.sign">
                    <Option v-for="item in signList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="salt" label="签名盐值" required>
                <Input v-model.trim="configItems.salt" placeholder="请输入签名盐值"></Input>
            </FormItem>
            <FormItem prop="channelSecret" label="渠道密钥" required>
                <Input v-model.trim="configItems.channelSecret" placeholder="请输入渠道密钥"></Input>
            </FormItem>
            <FormItem prop="encryptionSecret" label="加密密钥" required>
                <Input v-model.trim="configItems.encryptionSecret" placeholder="请输入加密密钥"></Input>
            </FormItem>
            <FormItem prop="signStatus" label="验签开关" required>
                <iSwitch size="large" v-model="configItems.signStatus">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </iSwitch>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="onCancelConfigClick(formRefConfigInfo)">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitConfigClick(formRefConfigInfo)">提交</Button>
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
            filterCode: '',
            filterStatus: '',
            statusList: [],
            columns: [
                {title: '渠道编号', key: 'channelCode'},
                {title: '渠道名称', key: 'channelName'},
                {title: '配置状态', key: 'phoneNum'},
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
                            label: '渠道配置',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.onChannelConfigClick(row)
                                }
                            }
                        }])
                    }
                }
            ],
            tableData: [],
            totalNum: 0,
            currentPage: 1,
            diaShowBaseInfo: false,
            diaTitleBaseInfo: '新增渠道',
            modal_loading: false,
            formRefBaseInfo: 'addChannel',
            channelItems: {},
            diaShowConfigInfo: false,
            diaTitleConfigInfo: '新增渠道配置',
            formRefConfigInfo: 'addChannelConfig',
            configItems: {},
            ruleValidateBaseInfo: {
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
            ruleValidateConfigInfo: {},
            signList: []
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
        channelApi.searchChannelList().then(({data: {result, code, msg}}) => {
            this.tableData = result.userList
            this.totalNum = result.totalNum
        })
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onCreateNewChannel () {
            this.diaShowBaseInfo = true
        },
        onSearchClick () {},
        handleCurrentChange (v) {},
        onEditClick (row) {
            this.channelItems = {...row}
            this.diaTitleBaseInfo = '修改渠道基本信息'
            this.diaShowBaseInfo = true
        },
        onChannelConfigClick (row) {
            this.channelItems = {...row}
            this.diaTitleConfigInfo = '修改渠道基本信息'
            this.diaShowConfigInfo = true
        },
        onCancelBaseClick (name) {
            this.$refs[name].resetFields()
            this.diaShowBaseInfo = false
            this.diaTitleBaseInfo = '新增渠道'
        },
        onSubmitBaseClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!')
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        onCancelConfigClick (name) {
            this.$refs[name].resetFields()
            this.diaShowConfigInfo = false
            this.diaTitleConfigInfo = '新增渠道配置'
        },
        onSubmitConfigClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!')
                } else {
                    this.$Message.error('Fail!')
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
</style>
