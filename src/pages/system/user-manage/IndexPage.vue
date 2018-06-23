<template>
<GPage bg>
    <table-header>
        <template slot="left">
            <Button type="primary" @click="onCreateNewUser">新建用户</Button>
            <Button type="ghost" @click="onDeleteClick">删除</Button>
        </template>
        <template slot="right">
            <Input v-model="filterName" placeholder="用户名/姓名" style="width: 200px" clearable></Input>
            <Select v-model="filterRole" style="width: 200px" placeholder="角色" clearable>
                <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
            </Select>
            <Select v-model="filterStatus" clearable style="width: 200px" placeholder="状态">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>

    <Table :columns="columns" :data="tableData" @on-selection-change="onSelectionChange" ref="selection" :height="tableHeihgt"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

    <Modal v-model="diaShow" :mask-closable="false" :closable="false" :title="diaTitle" ref="modal">
        <Form :model="newUser" :label-width="80" :rules="ruleValidate" :ref="formRef" class="new-user-form">
            <FormItem prop="userAdminName" label="用户名" required>
                <Input v-model.trim="newUser.userAdminName" placeholder="请输入用户名" :disabled="disabled" ></Input>
            </FormItem>
            <FormItem label="角色" prop="roleIds" required>
                <Select v-model="newUser.roleIds" :multiple="true">
                    <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="userAdminMobile" label="手机号">
                <Input v-model.trim="newUser.userAdminMobile" :maxlength="11" placeholder="请输入手机号（可选）"></Input>
            </FormItem>
            <FormItem prop="userAdminEmail" label="邮箱">
                <Input v-model.trim="newUser.userAdminEmail" placeholder="请输入邮箱（可选）"></Input>
            </FormItem>
            <!-- <FormItem prop="userAdminStatus" label="状态" required>
                <iSwitch size="large" v-model="newUser.userAdminStatus">
                    <span slot="open">启用</span>
                    <span slot="close">停用</span>
                </iSwitch>
            </FormItem> -->
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
import {userStatus} from '../../../common/consts'
import {mapMutations} from 'vuex'
import {formatDateTime} from '../../../common/utils'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            filterName: '',
            filterRole: '',
            filterStatus: '',
            roleList: [],
            statusList: [{
                value: 1,
                label: '启用'
            }, {
                value: 0,
                label: '停用'
            }],
            columns: [
                {type: 'selection', width: 50, align: 'center'},
                {title: '用户名', key: 'userAdminName'},
                {title: '手机号', key: 'userAdminMobile', width: 120},
                {title: '邮箱', key: 'userAdminEmail'},
                {
                    title: '角色',
                    key: 'roles',
                    render: (h, {column, index, row}) => {
                        let roles = row.roles.map(e => e.roleName)
                        let roleStr = roles.join(',')
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: roleStr
                        }])
                    }
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: formatDateTime(row.createTime)
                        }])
                    }
                },
                {
                    title: '状态',
                    key: 'userAdminStatus',
                    width: 100,
                    render: (h, {row}) => {
                        return h('iSwitch', {
                            props: {
                                trueValue: 1,
                                falseValue: 0,
                                value: row.userAdminStatus,
                                size: 'large'
                            },
                            on: {
                                'on-change': (val) => {
                                    this.onStatusChange(row, val)
                                }
                            }
                        }, [
                            h('span', {
                                slot: 'open'
                            }, '开启'),
                            h('span', {
                                slot: 'close'
                            }, '停用')
                        ])
                    }
                },
                {
                    title: '操作',
                    width: 150,
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
                            label: '重置密码',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.onResetPasswordClick(row)
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
            diaTitle: '新建用户',
            modal_loading: false,
            formRef: 'adduser',
            newUser: {
                roleIds: [],
                userAdminName: '',
                userAdminMobile: '',
                userAdminEmail: ''
            },
            ruleValidate: {
                userAdminName: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^([a-zA-Z0-9_]{1,16})$/, message: '只能包含大小写字母、数字和下划线_，且长度不能超过16位', trigger: 'blur'}
                ],
                userAdminMobile: [
                    {pattern: /^1\d{10}$/, message: '手机号码不正确', trigger: 'blur'}
                ],
                userAdminEmail: [
                    {pattern: /^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{1,65}$/, message: '邮件格式不正确或长度过长', trigger: 'blur'}
                ],
                roleIds: [{required: true, type: 'array', message: '必填项', trigger: 'change'}]
            },
            userStatus: userStatus,
            selectedRows: [],
            tableHeihgt: '',
            disabled: false
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '用户管理',
                icon: 'icon-xitongguanli'
            })
        })
    },
    created () {
        this.searchUserList()
        this.searchDownRoleList()
        this.tableHeihgt = window.innerHeight - 224
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        onCreateNewUser () {
            this.diaShow = true
            this.disabled = false
            this.$refs.selection.selectAll(false)
        },
        onDeleteClick () {
            if (this.selectedRows.length === 0) {
                this.$Modal.warning({
                    title: '删除信息提示',
                    content: `您还没有选中想要删除的数据`
                })
                return
            }
            this.$Modal.confirm({
                title: '删除信息确认',
                content: `您是否删除选中的${this.selectedRows.length}条数据？`,
                closable: false,
                loading: true,
                onOk: () => {
                    // TODO 刷新数据
                    let arr = this.selectedRows.map(e => e.userAdminId)
                    let userIdsStr = arr.join(',')
                    systemApi.deleteUserInfo(userIdsStr).then(({data: {result, resultCode, msg}}) => {
                        this.$Modal.remove()
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                            this.searchUserList()
                        } else {
                            this.$Message.error(msg)
                        }
                    }).catch(() => {
                        this.$Modal.remove()
                    })
                },
                onCancel: () => {
                    this.selectedRows = []
                    this.$refs.selection.selectAll(false)
                }
            })
        },
        onSearchClick () {
            this.searchUserList()
        },
        handleCurrentChange (v) {
            this.currentPage = v
            this.searchUserList()
        },
        onSelectionChange (selection) {
            this.selectedRows = selection
        },
        onStatusChange (row, val) {
            row.userAdminStatus = val ? 1 : 0
            this.$Modal.confirm({
                title: '状态信息修改确认',
                content: `您将${row.userAdminStatus ? '启用' : '停用'}该用户，是否继续？`,
                closable: false,
                loading: true,
                onOk: () => {
                    // TODO 刷新数据
                    systemApi.updateUserState(row.userAdminId, val ? 1 : 0).then(({data: {result, resultCode, msg}}) => {
                        this.$Modal.remove()
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                        } else {
                            this.$Message.success(msg)
                            this.$nextTick(() => {
                                row.userAdminStatus = val ? 0 : 1
                            })
                        }
                    }).catch(() => {
                        this.$Modal.remove()
                        this.$nextTick(() => {
                            row.userAdminStatus = val ? 0 : 1
                        })
                    })
                },
                onCancel: () => {
                    this.$nextTick(() => {
                        row.userAdminStatus = val ? 0 : 1
                    })
                }
            })
        },
        onEditClick (row) {
            this.formRef = 'edituser'
            this.newUser = {...row}
            let roleIds = this.newUser.roles.map(e => e.roleId)
            this.newUser.roleIds = roleIds
            this.newUser.userAdminId = row.userAdminId
            this.diaTitle = '修改用户'
            this.diaShow = true
            this.disabled = true
        },
        onResetPasswordClick (row) {
            this.$Modal.confirm({
                title: '用户密码重置确认',
                content: `您将重置该用户密码，是否继续？`,
                closable: false,
                loading: true,
                onOk: () => {
                    // TODO 刷新数据
                    systemApi.resetUserPwd(row.userAdminId).then(({data: {result, resultCode, msg}}) => {
                        this.$Modal.remove()
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                        } else {
                            this.$Message.error(msg)
                        }
                    }).catch(() => {
                        this.$Modal.remove()
                    })
                },
                onCancel: () => {}
            })
        },
        onCancelClick (name) {
            this.$refs[name].resetFields()
            this.diaShow = false
            this.diaTitle = '新建用户'
            this.formRef = 'adduser'
        },
        onSubmitClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let {userAdminName, userAdminEmail, userAdminMobile, roleIds} = {
                        ...this.newUser
                    }
                    let roleIdsStr = roleIds.join(',')
                    this.modal_loading = true
                    if (name === 'adduser') {
                        systemApi.addUserInfo(userAdminName, userAdminEmail, userAdminMobile, roleIdsStr).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.onCancelClick(name)
                                this.currentPage = 1
                                this.searchUserList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }).catch(() => {
                            this.modal_loading = false
                        })
                    } else {
                        let userAdminId = this.newUser.userAdminId
                        systemApi.updateUserInfo(userAdminId, userAdminName, userAdminEmail, userAdminMobile, roleIdsStr).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.onCancelClick(name)
                                this.searchUserList()
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
        searchUserList () {
            this.openLoading()
            systemApi.searchUserList(
                this.pageSize,
                this.currentPage,
                this.filterName,
                this.filterRole,
                this.filterStatus
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
        searchDownRoleList () {
            systemApi.searchDownRoleList().then(({data: {result, resultCode, msg}}) => {
                this.roleList = result
            })
        }
    }
}
</script>
<style lang="less" scoped>
.new-user-form {
    margin-right: 40px;
}
</style>
