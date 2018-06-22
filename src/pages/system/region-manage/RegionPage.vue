<template>
<GPage bg>
    <table-header>
        <template slot="left">
            <Button type="primary" @click="onCreateNewRegion">新增医保行政区划</Button>
        </template>
        <template slot="right">
            <Input v-model="regionName" placeholder="医保行政区划代码/名称" style="width: 200px" clearable></Input>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>

    <Table :columns="columns" :data="tableData" no-data-text="暂无数据"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

    <Modal v-model="diaShow" :mask-closable="false" :closable="false" class-name="vertical-center-modal" :title="diaTitle" ref="modal">
        <Form :model="newUser" :label-width="150" :rules="ruleValidate" :ref="formRef" class="new-user-form">
            <FormItem prop="regionNo" label="医保行政区划代码" required>
                <Input v-model.trim="newUser.regionNo" placeholder="请输入医保行政区划代码"></Input>
            </FormItem>
            <FormItem prop="regionName" label="医保行政区划名称" required>
                <Input v-model.trim="newUser.regionName" placeholder="请输入医保行政区划名称"></Input>
            </FormItem>
            <FormItem  prop="nopswAmountLimit" label="免密支付额度" required>
                <Input v-model.trim="newUser.nopswAmountLimit" placeholder="请输入免密支付额度"></Input>
            </FormItem>
            <FormItem label="有银行卡未激活可换新卡开通缴费支付功能" >
                <i-switch v-model="cardAuth" @on-change="changeStatus">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </i-switch >
            </FormItem>
            <FormItem label="无银行卡可换新卡开通缴费支付功能" >
                <i-switch v-model="noCardAuth" @on-change="changeStatus2">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </i-switch >
            </FormItem>
            <FormItem prop="messageTips" label="签发异常提示语" required>
                <Input v-model.trim="newUser.messageTips" type="textarea"  placeholder="请输入签发异常提示语"></Input>
            </FormItem>
            <FormItem prop="faceMsg" label="人脸失败提示语" required>
                <Input v-model.trim="newUser.faceMsg" type="textarea"  placeholder="请输入人脸失败提示语"></Input>
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
import {systemApi} from '../../../apis/'
import {mapMutations} from 'vuex'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            regionName: '',
            cardAuth: false,
            noCardAuth: false,
            columns: [
                {type: 'index', title: '序号', align: 'center'},
                {title: '医保行政区划代码', key: 'regionNo', align: 'center'},
                {title: '医保行政区划名称', key: 'regionName', align: 'center'},
                {title: '免密支付额度', key: 'nopswAmountLimit', align: 'center'},
                {
                    title: '有银行卡未激活可换新卡开通缴费支付功能',
                    key: 'cardAuth',
                    align: 'center',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: row.cardAuth === 1 ? '是' : '否'
                        }])
                    }
                },
                {
                    title: '无银行卡可换新卡开通缴费支付功能',
                    key: 'noCardAuth',
                    align: 'center',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: row.noCardAuth === 1 ? '是' : '否'
                        }])
                    }
                },
                {title: '签发异常提示语', key: 'messageTips'},
                {title: '人脸失败提示语', key: 'faceMsg'},
                {
                    title: '操作',
                    align: 'center',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '编辑',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.onEditClick(row)
                                }
                            }
                        }, {
                            label: '删除',
                            type: 'error',
                            on: {
                                click: () => {
                                    this.onDeleteClick(row)
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
            diaShow: false,
            diaTitle: '新增医保行政区划',
            modal_loading: false,
            formRef: 'adduser',
            newUser: {},
            ruleValidate: {
                regionNo: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^\d{6}$/, message: '要求为6位纯数字', trigger: 'blur'}
                ],
                regionName: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                nopswAmountLimit: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^[0-9]*$/, message: '只能填写数字', trigger: 'blur'}
                ],
                messageTips: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                faceMsg: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ]
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '区划管理',
                icon: 'icon-xitongguanli'
            })
        })
    },
    created () {
        this.searchRegionList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        onCreateNewRegion () {
            this.diaShow = true
            this.cardAuth = false
            this.noCardAuth = false
            this.newUser.cardAuth = 0
            this.newUser.noCardAuth = 0
        },
        // 删除数据
        onDeleteClick (row) {
            this.$Modal.confirm({
                title: '删除信息确认',
                content: `您是否确认删除选中的此条数据？`,
                closable: false,
                loading: true,
                onOk: () => {
                    // TODO 刷新数据
                    systemApi.deleteRegionInfo(row.regionId).then(({data: {result, resultCode, msg}}) => {
                        this.$Modal.remove()
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                            this.searchRegionList()
                        } else {
                            this.$Message.error(msg)
                        }
                    }).catch(() => {
                        this.$Modal.remove()
                    })
                },
                onCancel: () => {
                }
            })
        },
        // 查询数据
        onSearchClick () {
            this.searchRegionList()
        },
        // 页数查询
        handleCurrentChange (v) {
            this.currentPage = v
            this.searchRegionList()
        },
        // 编辑数据
        onEditClick (row) {
            this.formRef = 'edituser'
            this.cardAuth = row.cardAuth === 1
            this.noCardAuth = row.noCardAuth === 1
            this.newUser = {...row}
            this.newUser.nopswAmountLimit = String(this.newUser.nopswAmountLimit)
            this.diaTitle = '修改医保行政区划'
            this.diaShow = true
        },
        // 弹出框-取消
        onCancelClick (name) {
            this.$refs[name].resetFields()
            this.diaShow = false
            this.diaTitle = '新增医保行政区划'
            this.formRef = 'adduser'
        },
        // 新增或编辑后提交数据
        onSubmitClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let {regionId, regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg} = {
                        ...this.newUser
                    }
                    this.modal_loading = true
                    if (name === 'adduser') {
                        systemApi.addRegionInfo(regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.onCancelClick(name)
                                this.currentPage = 1
                                this.searchRegionList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }).catch(() => {
                            this.modal_loading = false
                        })
                    } else {
                        systemApi.updateRegionInfo(regionId, regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.onCancelClick(name)
                                this.searchRegionList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }).catch(() => {
                            this.modal_loading = false
                        })
                    }
                } else {
                    this.$Message.error('校验失败!')
                }
            })
        },
        // 获取数据
        searchRegionList () {
            this.openLoading()
            systemApi.searchRegionList(
                this.pageSize,
                this.currentPage,
                this.regionName
            ).then(({data: {result, resultCode, msg}}) => {
                this.closeLoading()
                if (resultCode === '000000') {
                    this.tableData = result.list
                    this.totalNum = result.total
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
                this.closeLoading()
            })
        },
        // 改变有银行卡未激活可换新卡开通缴费支付功能状态
        changeStatus (status) {
            if (status) {
                this.newUser.cardAuth = '1'
            } else {
                this.newUser.cardAuth = '0'
            }
        },
        // 改变无银行卡可换新卡开通缴费支付功能状态
        changeStatus2 (status) {
            if (status) {
                this.newUser.noCardAuth = '1'
            } else {
                this.newUser.noCardAuth = '0'
            }
        }

    }
}
</script>
<style lang="less">
.new-user-form {
    margin-right: 40px;
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
        top: 0;
    }
}
</style>
