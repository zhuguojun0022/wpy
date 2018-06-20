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

    <Modal v-model="diaShowBaseInfo" :mask-closable="false" :closable="false" :title="diaTitleBaseInfo" ref="modal">
        <Form :model="channelItems" :label-width="100" :rules="ruleValidateBaseInfo" :ref="formRefBaseInfo" class="new-channel-form">
            <FormItem prop="AAZ570" label="渠道编码" required>
                <Input v-model.trim="channelItems.AAZ570" placeholder="请输入渠道编码"></Input>
            </FormItem>
            <FormItem prop="AAZ571" label="渠道名称" required>
                <Input v-model.trim="channelItems.AAZ571" placeholder="请输入渠道名称"></Input>
            </FormItem>
            <FormItem prop="AAZ573" label="渠道类型" required>
                <Select v-model="channelItems.AAZ573">
                    <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="AAZ572" label="渠道等级" required>
                <Select v-model="channelItems.AAZ572">
                    <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="accessType" label="渠道接入类型" required v-show="accessTypeVisibility">
                <RadioGroup v-model="channelItems.accessType" @on-change="handleAccessTypeChange">
                    <Radio v-for="item in accessTypeList" :label="item.value" :key="item.value">{{ item.label }}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem prop="regionIdList" label="限定区划" required v-show="regionVisibility">
                <div style="position:relative">
                    <Select v-model="channelItems.regionIdList" :multiple="true" :filterable="true" :remote="true"
                    :remote-method="searchRegionList" :loading="regionLoading">
                        <Option v-for="item in regionList" :value="item.regionId" :key="item.regionId">{{ item.regionName }}</Option>
                    </Select>
                    <Tooltip :content="regionHint" style="position:absolute; left:370px; top:2px" placement="top">
                        <Icon type="information-circled" ></Icon>
                    </Tooltip>
                </div>
            </FormItem>
            <FormItem prop="channelUser" label="联系人" required>
                <Input v-model.trim="channelItems.channelUser" placeholder="请输入联系人"></Input>
            </FormItem>
            <FormItem prop="channelUserMobile" label="联系方式" required>
                <Input v-model.trim="channelItems.channelUserMobile" placeholder="请输入联系方式"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="onCancelBaseClick(formRefBaseInfo)">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitBaseClick(formRefBaseInfo)">提交</Button>
        </div>
    </Modal>
    <Modal v-model="diaShowConfigInfo" :mask-closable="false" :closable="false" :title="diaTitleConfigInfo" ref="modal">
        <Form :model="channelItems" :label-width="80" :rules="ruleValidateConfigInfo" :ref="formRefConfigInfo" class="config-channel-form">
            <FormItem prop="AAZ571" label="渠道名称">
                <Input v-model.trim="channelItems.AAZ571" :disabled="true" placeholder=""></Input>
            </FormItem>
            <FormItem prop="signAlgorithm" label="算法签名" required>
                <Select v-model="channelItems.signAlgorithm">
                    <Option v-for="item in signList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="channelAccessKey" label="渠道AK" required>
                <Input v-model.trim="channelItems.channelAccessKey" placeholder="请输入渠道AK"></Input>
            </FormItem>
            <FormItem prop="channelSecretKey" label="渠道SK" required>
                <Input v-model.trim="channelItems.channelSecretKey" placeholder="请输入渠道SK"></Input>
            </FormItem>
            <FormItem prop="checkSwitch" label="验签开关" required>
                <iSwitch size="large" v-model="channelItems.checkSwitch" :true-value="1" :false-value="0" >
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
import {TableHeader, TableFooter} from '../../../components/table'
import {channelApi} from '../../../apis/'
import {mapMutations} from 'vuex'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            filterName: '',
            filterCode: '',
            filterStatus: '',
            regionVisibility: false,
            accessTypeVisibility: true,
            regionLoading: false,
            regionHint: '输入名称进行模糊检索',
            typeList: [{
                value: 0,
                label: '第三方人社'
            }, {
                value: 1,
                label: '地方人社'
            }, {
                value: 2,
                label: '银行'
            }, {
                value: 3,
                label: '政府'
            }, {
                value: 4,
                label: '部平台'
            }],
            statusList: [{
                value: -1,
                label: '全部'
            }, {
                value: 0,
                label: '待配置'
            }, {
                value: 1,
                label: '已启用'
            }, {
                value: 2,
                label: '已停用'
            }],
            levelList: [{
                value: 1,
                label: '一级'
            }, {
                value: 2,
                label: '二级'
            }, {
                value: 3,
                label: '三级'
            }],
            accessTypeList: [{
                value: 0,
                label: '非限定渠道'
            }, {
                value: 1,
                label: '限定渠道'
            }],
            regionList: [],
            columns: [
                {title: '渠道编号', key: 'AAZ570', width: 100},
                {title: '渠道名称', key: 'AAZ571'},
                {
                    title: '渠道类型',
                    key: 'AAZ573',
                    width: 100,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: this.channelType(row.AAZ573)
                        }])
                    }
                },
                {
                    title: '渠道等级',
                    key: 'AAZ572',
                    width: 100,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: this.channelLevel(row.AAZ572)
                        }])
                    }
                },
                {
                    title: '渠道限定区划',
                    key: 'regionList',
                    render: (h, {column, index, row}) => {
                        let regionStr = ''
                        row.regionList.forEach(element => {
                            regionStr = regionStr + element.regionName + '、'
                        })
                        return this.getCellRender(h, [{
                            label: regionStr,
                            type: 'primary',
                            style: {
                                color: '#000000'
                            }
                        }])
                    }
                },
                {title: '联系人', key: 'channelUser'},
                {title: '联系电话', key: 'channelUserMobile'},
                {
                    title: '配置状态',
                    key: 'confStatus',
                    width: 100,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: row.confStatus === 2 ? '已停用' : row.confStatus === 0 ? '待配置' : '已启用',
                            style: {
                                color: row.confStatus === 2 ? '#000000' : row.confStatus === 0 ? '#FF4949' : '#10AD57'
                            }
                        }])
                    }
                },
                {
                    title: '操作',
                    width: 300,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            type: 'primary',
                            label: '修改',
                            on: {
                                click: () => {
                                    this.onEditChannelClick(row)
                                }
                            }
                        }, {
                            type: 'primary',
                            label: row.confStatus === 0 ? '渠道配置' : '修改配置',
                            on: {
                                click: () => {
                                    this.onEditChannelConfigClick(row)
                                }
                            }
                        }, {
                            type: 'primary',
                            label: row.confStatus === 2 ? '启用' : row.confStatus === 1 ? '停用' : '',
                            style: {
                                color: row.confStatus === 2 ? '#10AD57' : row.confStatus === 1 ? '#FF4949' : ''
                            },
                            on: {
                                click: () => {
                                    if (row.confStatus === 2) {
                                        this.startUse(row)
                                    } else if (row.confStatus === 1) {
                                        this.stopUse(row)
                                    }
                                }
                            }
                        }])
                    }
                }
            ],
            tableData: [],
            pageSize: 20,
            totalNum: 0,
            currentPage: 1,
            diaShowBaseInfo: false,
            diaTitleBaseInfo: '新增渠道',
            modal_loading: false,
            formRefBaseInfo: 'addChannel',
            regionId: '',
            regionNo: '',
            regionName: '',
            channelItems: {
                channelId: '',
                AAZ570: '',
                AAZ571: '',
                AAZ572: '',
                AAZ573: '',
                accessType: '',
                channelUser: '',
                channelUserMobile: '',
                regionIdList: []
            },
            diaShowConfigInfo: false,
            diaTitleConfigInfo: '新增渠道配置',
            formRefConfigInfo: 'addChannelConfig',
            configItems: {},
            ruleValidateBaseInfo: {
                AAZ570: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^\w+$/, message: '只能包含字母、数字、_', trigger: 'blur'}
                ],
                AAZ571: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, message: '只能包含中文、字母、数字、_', trigger: 'blur'}
                ],
                channelUser: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, message: '只能包含中文、字母、数字、_', trigger: 'blur'}
                ],
                channelUserMobile: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^1\d{10}$/, message: '联系方式不正确', trigger: 'blur'}
                ]
            },
            ruleValidateConfigInfo: {
                channelAccessKey: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^\w+$/, message: '只能包含字母、数字、_', trigger: 'blur'}
                ],
                channelSecretKey: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^\w+$/, message: '只能包含字母、数字、_', trigger: 'blur'}
                ]
            },
            signList: [{
                value: 'RSA256',
                label: 'RSA256'
            }]
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '渠道配置',
                icon: 'icon-qudaoguanli'
            })
        })
    },
    created () {
        this.searchChannelList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        channelType (type) {
            if (type === 0) {
                return '第三方人社'
            } else if (type === 1) {
                return '地方人社'
            } else if (type === 2) {
                return '银行'
            } else if (type === 3) {
                return '政府'
            } else if (type === 4) {
                return '部平台'
            }
        },
        channelLevel (level) {
            if (level === 1) {
                return '一级'
            } else if (level === 2) {
                return '二级'
            } else if (level === 3) {
                return '三级'
            }
        },
        onCreateNewChannel () {
            this.formRefBaseInfo = 'addChannel'
            this.diaShowBaseInfo = true
        },
        onSearchClick () {
            this.searchChannelList()
        },
        handleCurrentChange (v) {
            this.currentPage = v
            this.searchChannelList()
        },
        onEditChannelClick (row) {
            this.formRefBaseInfo = 'editChannel'
            this.channelItems = {...row}
            if (this.channelItems.accessType === 1) {
                this.regionVisibility = true
            } else {
                this.regionVisibility = false
            }
            this.accessTypeVisibility = false
            this.regionList = row.regionList
            let list = []
            row.regionList.forEach(element => {
                list.push(element.regionId)
            })
            this.channelItems.regionIdList = list
            this.diaTitleBaseInfo = '修改渠道基本信息'
            this.diaShowBaseInfo = true
        },
        onEditChannelConfigClick (row) {
            this.formRefConfigInfo = 'editChannelConfig'
            this.channelItems = {...row}
            this.diaTitleConfigInfo = '修改渠道配置信息'
            this.diaShowConfigInfo = true
        },
        onChannelConfigClick (row) {
            this.channelItems = {...row}
            this.diaTitleConfigInfo = '修改渠道基本信息'
            this.diaShowConfigInfo = true
        },
        // 新增、修改渠道取消事件
        onCancelBaseClick (name) {
            this.$refs[name].resetFields()
            this.diaShowBaseInfo = false
            this.diaTitleBaseInfo = '新增渠道'
            this.regionVisibility = false
            this.accessTypeVisibility = true
        },
        // 新增渠道commit事件
        onSubmitBaseClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let {AAZ570, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile, accessType, regionIdList} = {
                        ...this.channelItems
                    }
                    this.modal_loading = true
                    if (name === 'addChannel') {
                        channelApi.addChannel(AAZ570, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile, accessType, regionIdList).then(
                            ({data: {result, resultCode, msg}}) => {
                                this.modal_loading = false
                                if (resultCode === '000000') {
                                    this.$Message.success(msg)
                                    this.onCancelConfigClick(name)
                                    this.currentPage = 1
                                    this.searchChannelList()
                                } else {
                                    this.$Message.error(msg)
                                }
                            }
                        ).catch(() => {
                            this.modal_loading = false
                        })
                    } else {
                        let channelId = this.channelItems.channelId
                        channelApi.updateChannel(channelId, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile, regionIdList).then(
                            ({data: {result, resultCode, msg}}) => {
                                this.modal_loading = false
                                if (resultCode === '000000') {
                                    this.$Message.success(msg)
                                    this.onCancelConfigClick(name)
                                    this.currentPage = 1
                                    this.searchChannelList()
                                } else {
                                    this.$Message.error(msg)
                                }
                            }
                        ).catch(() => {
                            this.modal_loading = false
                        })
                    }
                    this.accessTypeVisibility = true
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        onCancelConfigClick (name) {
            this.formRefConfigInfo = 'addChannelConfig'
            this.$refs[name].resetFields()
            this.diaShowConfigInfo = false
            this.diaTitleConfigInfo = '新增渠道配置'
        },
        // 配置渠道commit事件
        onSubmitConfigClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let {channelId, signAlgorithm, channelAccessKey, channelSecretKey, checkSwitch} = {
                        ...this.channelItems
                    }
                    this.modal_loading = true
                    channelApi.updateChannelConfig(channelId, signAlgorithm, channelAccessKey, channelSecretKey, checkSwitch).then(
                        ({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.onCancelConfigClick(name)
                                this.currentPage = 1
                                this.searchChannelList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }
                    ).catch(() => {
                        this.modal_loading = false
                    })
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        searchChannelList () {
            this.openLoading()
            channelApi.searchChannelList(
                this.currentPage,
                this.pageSize,
                this.filterStatus,
                this.filterCode,
                this.filterName
            ).then(({data: {result, resultCode, msg}}) => {
                this.closeLoading()
                if (resultCode === '000000') {
                    this.tableData = result.list
                    this.totalNum = result.total
                } else {
                    this.$message.error(msg)
                }
            }).catch(() => {
                this.closeLoading()
            })
        },
        handleAccessTypeChange (v) {
            if (v === 1) {
                this.regionVisibility = true
            } else {
                this.regionVisibility = false
            }
        },
        searchRegionList (query) {
            if (query !== '') {
                this.regionLoading = true
                channelApi.searchRegionList(this.regionId, this.regionNo, query).then(({data: {result, resultCode, msg}}) => {
                    this.regionLoading = false
                    this.regionList = result.list
                })
            } else {
                this.regionList = []
            }
        },
        startUse (row) {
            this.channelItems = {...row}
            this.updateChannelStatus(true)
        },
        stopUse (row) {
            this.channelItems = {...row}
            this.updateChannelStatus(false)
        },
        updateChannelStatus (status) {
            let {channelId} = {...this.channelItems}
            this.modal_loading = true
            channelApi.updateChannelStatus(channelId, status).then(
                ({data: {result, resultCode, msg}}) => {
                    this.modal_loading = false
                    this.$Message.success(msg)
                    this.searchChannelList()
                }
            )
        }
    }
}
</script>
<style lang="less" scoped>
</style>
