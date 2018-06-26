<template>
<GPage bg>
    <table-header>
        <template slot="left">
            <Button type="primary" @click="onCreateNewChannel">新增渠道</Button>
        </template>
        <template slot="right">
            <Input v-model="filterName" placeholder="渠道名称" style="width: 200px" clearable></Input>
            <Input v-model="filterCode" placeholder="渠道编号" style="width: 200px" clearable></Input>
            <Select v-model="filterStatus" style="width: 200px" placeholder="配置状态">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>
    <Table :columns="columns" :data="tableData" :height="tableHeihgt"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

    <Modal v-model="diaShowBaseInfo" :mask-closable="false" :closable="false" :title="diaTitleBaseInfo" ref="modal">
        <Form :model="channelItems" :label-width="100" :rules="ruleValidateBaseInfo" :ref="formRefBaseInfo" class="new-channel-form">
            <FormItem prop="AAZ570" label="渠道编码" required>
                <div style="position:relative">
                    <Input v-model.trim="channelItems.AAZ570" :maxlength="10" placeholder="请输入渠道编码"></Input>
                    <Tooltip style="position:absolute; left:370px; top:2px;" placement="right">
                        <div slot="content">
                            <p>渠道编号编码规则：</p>
                            <p>1.10位数字字符。</p>
                            <p>2.地方APP（含地方人社、地方政府、地方部门、医院）：</p>
                            <p>前6位为行政区划代码，后4位为序号，顺序分配（0001—9999）。</p>
                            <p>3.全国统一的APP（如中央政府及政府各部门、银行总行、</p>
                            <p>第三方可信渠道、第三方其他渠道APP）单独编码。</p>
                            <p style="text-indent:20px">3.1 中央政府、政府各部门000001+4位序号（0001—9999）</p>
                            <p style="text-indent:20px">3.2 银行类APP：9100**+4位序号（0001—9999）**为银行</p>
                            <p style="text-indent:20px">大类；对于地方类银行，大类为地方商业银行</p>
                            <p style="text-indent:20px">3.3 第三方可信渠道APP：9200+6位序号（000001—999999）</p>
                            <p style="text-indent:20px">3.4 第三方其他渠道APP：9300+6位序号（000001—999999）</p>
                        </div>
                        <Icon type="information-circled" ></Icon>
                    </Tooltip>
                </div>
            </FormItem>
            <FormItem prop="AAZ571" label="渠道名称" required>
                <Input v-model.trim="channelItems.AAZ571" :maxlength="16" placeholder="请输入渠道名称"></Input>
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
            <!-- 延签开关隐藏，20180621汤老师提出 -->
            <FormItem prop="checkSwitch" label="验签开关" required v-show="switchVisibility">
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
import {TableHeader, TableFooter, Expand} from '../../../components/table'
import {channelApi} from '../../../apis/'
import {mapMutations} from 'vuex'

export default {
    components: {TableHeader, TableFooter, Expand},
    data () {
        return {
            filterName: '',
            filterCode: '',
            filterStatus: '',
            switchVisibility: false,
            typeList: [{
                value: 0,
                label: '地方渠道'
            }, {
                value: 1,
                label: '地中央政府或部门'
            }, {
                value: 2,
                label: '银行'
            }, {
                value: 3,
                label: '第三方可信渠道'
            }, {
                value: 4,
                label: '第三方其他渠道'
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
            }],
            columns: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(Expand, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {title: '渠道编号', key: 'AAZ570', minWidth: 110},
                {title: '渠道名称', key: 'AAZ571', minWidth: 180},
                {
                    title: '渠道类型',
                    key: 'AAZ573',
                    minWidth: 130,
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
                    minWidth: 90,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: this.channelLevel(row.AAZ572)
                        }])
                    }
                },
                {title: '联系人', key: 'channelUser', minWidth: 90},
                {title: '联系电话', key: 'channelUserMobile', minWidth: 110},
                {
                    title: '配置状态',
                    key: 'confStatus',
                    minWidth: 100,
                    render: (h, {column, index, row}) => {
                        // return this.getCellRender(h, [{
                        //     label: row.confStatus === 2 ? '已停用' : row.confStatus === 0 ? '待配置' : '已启用',
                        //     style: {
                        //         color: row.confStatus === 2 ? '#000000' : row.confStatus === 0 ? '#FF4949' : '#10AD57'
                        //     }
                        // }])
                        return this.getCellRender(h, [{
                            tag: 'Tag',
                            label: row.confStatus === 2 ? '已停用' : row.confStatus === 0 ? '待配置' : '已启用',
                            color: row.confStatus === 2 ? 'grey' : row.confStatus === 0 ? 'red' : 'green'
                        }])
                    }
                },
                {
                    title: '操作',
                    width: 200,
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
                                    this.$Modal.confirm({
                                        title: '操作确认',
                                        content: `您将${row.confStatus === 2 ? '启用' : '停用'}该渠道，是否继续?`,
                                        closable: false,
                                        loading: true,
                                        onOk: () => {
                                            this.$Modal.remove()
                                            if (row.confStatus === 2) {
                                                this.startUse(row)
                                            } else if (row.confStatus === 1) {
                                                this.stopUse(row)
                                            }
                                        },
                                        onCancel: () => {}
                                    })
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
            channelItems: {
                channelId: '',
                AAZ570: '',
                AAZ571: '',
                AAZ572: '',
                AAZ573: '',
                channelUser: '',
                channelUserMobile: ''
            },
            diaShowConfigInfo: false,
            diaTitleConfigInfo: '新增渠道配置',
            formRefConfigInfo: 'addChannelConfig',
            configItems: {},
            ruleValidateBaseInfo: {
                AAZ570: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^\d{10}$/, message: '渠道编码只能为10位数字编码', trigger: 'blur'}
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
                    {pattern: /^1\d{10}$/, message: '联系方式为11位手机号码', trigger: 'blur'}
                ]
            },
            ruleValidateConfigInfo: {
                channelAccessKey: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^([\s\S]{1,32})$/, message: '长度不能超过32位', trigger: 'blur'}
                ],
                channelSecretKey: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^([\s\S]{1,32})$/, message: '长度不能超过32位', trigger: 'blur'}
                ]
            },
            signList: [{
                value: 'AES128',
                label: 'AES128'
            }],
            tableHeihgt: ''
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '渠道管理',
                icon: 'icon-qudaoguanli'
            })
        })
    },
    created () {
        this.searchChannelList()
        this.tableHeihgt = window.innerHeight - 224
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        channelType (type) {
            if (type === 0) {
                return '地方渠道'
            } else if (type === 1) {
                return '中央政府或部门'
            } else if (type === 2) {
                return '银行'
            } else if (type === 3) {
                return '第三方可信渠道'
            } else if (type === 4) {
                return '第三方其他渠道'
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
            this.currentPage = 1
            this.searchChannelList()
        },
        handleCurrentChange (v) {
            this.currentPage = v
            this.searchChannelList()
        },
        onEditChannelClick (row) {
            this.formRefBaseInfo = 'editChannel'
            this.channelItems = {...row}
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
        },
        // 新增渠道commit事件
        onSubmitBaseClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let {AAZ570, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile} = {
                        ...this.channelItems
                    }
                    this.modal_loading = true
                    if (name === 'addChannel') {
                        channelApi.addChannel(AAZ570, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile).then(
                            ({data: {result, resultCode, msg}}) => {
                                this.modal_loading = false
                                if (resultCode === '000000') {
                                    this.$Message.success(msg)
                                    this.onCancelBaseClick(name)
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
                        channelApi.updateChannel(channelId, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile).then(
                            ({data: {result, resultCode, msg}}) => {
                                this.modal_loading = false
                                if (resultCode === '000000') {
                                    this.$Message.success(msg)
                                    this.onCancelBaseClick(name)
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
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        onCancelConfigClick (name) {
            this.formRefConfigInfo = 'addChannelConfig'
            this.$refs[name].resetFields()
            this.channelItems = {}
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
                    if (result.list.length > 0) {
                        result.list[0]['_expanded'] = true
                    }
                    this.tableData = result.list
                    this.totalNum = result.total
                } else {
                    this.$message.error(msg)
                }
            }).catch(() => {
                this.closeLoading()
            })
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
