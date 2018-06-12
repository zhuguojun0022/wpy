<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Button type="primary" @click="onCreateNewRole">新增角色</Button>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="19">
            <Table highlight-row :columns="columns" :data="tableData" @on-row-dblclick="singleClick"></Table>
            <table-footer :total-num="totalNum" :current-page="currentPage" :page-size="pageSize" @on-change="handleMainChange"></table-footer>
        </Col>
        <Col span="5" class="authorize">
            <span class="authorize-title">授权功能</span>
            <Button type="primary" v-if="clickRole" class="authorize-save" @click="updateTree">保存</Button>
            <Tree :data="treeData" show-checkbox v-if="clickRole" :ref='trees'></Tree>
        </Col>
    </Row>
    <Modal v-model="newRoleShow" :title="newRoleTitle" ref="modal">
        <Form :model="newRole" :label-width="80" :rules="ruleValidate" :ref="formRef" class="new-role-form">
            <FormItem prop="roleName" label="角色名称" required>
                <Input v-model.trim="newRole.roleName" placeholder="请输入角色名称"></Input>
            </FormItem>
            <FormItem prop="roleRemark" label="角色描述" required>
                <Input v-model.trim="newRole.roleRemark" type="textarea" placeholder="请输入角色描述"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="onCancelClick(formRef)">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitClick(formRef)">提交</Button>
        </div>
    </Modal>
    <Modal v-model="authorizedUserShow" :title="authorizedUserTitle" ref="modal">
        <table-header>
            <div slot="left">
                <Select
                    v-model="nameKey"
                    filterable
                    remote
                    clearable
                    :remote-method="filterName"
                    :loading="loadings"
                    style="width: 200px">
                    <Option v-for="(option, index) in userNameList" :value="option.userAdminId" :key="index">{{option.userAdminName}}</Option>
                </Select>
                <Button type="primary" @click="updateUser">授权用户</Button>
            </div>
        </table-header>
        <Table :columns="userColumns" :data="tableUserData" :loading="modalLoading"></Table>
        <table-footer :total-num="totalNumAuthorizedUser" :current-page="currentPageAuthorizedUser" @on-change="handleCurrentChange"></table-footer>
    </Modal>
    <Modal v-model="reNewRoleShow" ref="modal">

    </Modal>
</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../../components/table'
import {mapMutations} from 'vuex'
import {systemApi} from '../../../apis'
import {formatDateTime} from '../../../common/utils'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            tableData: [],
            columns: [
                {title: '角色名称', key: 'roleName'},
                {title: '角色描述', key: 'roleRemark'},
                {title: '角色ID', key: 'roleId', width: 100},
                {title: '创建人', key: 'createUserNo', width: 100},
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
                    key: 'status',
                    render: (h, {row}) => {
                        return h('iSwitch', {
                            props: {
                                trueValue: 1,
                                falseValue: 0,
                                value: row.roleStatus,
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
                    width: 200,
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '修改',
                            type: 'primary',
                            on: {
                                click: (e) => {
                                    e.stopPropagation()
                                    this.reviseClick(row)
                                }
                            }
                        }, {
                            label: '授权用户',
                            type: 'primary',
                            on: {
                                click: (e) => {
                                    e.stopPropagation()
                                    this.authorizedUserClick(row)
                                }
                            }
                        }, {
                            label: '删除',
                            type: 'error',
                            on: {
                                click: (e) => {
                                    e.stopPropagation()
                                    this.deleteClick(row)
                                }
                            }
                        }])
                    }
                }
            ],
            trees: 'checked',
            modalLoading: '',
            userNameList: [],
            treeData: [],
            clickRole: false,
            newRoleShow: false,
            loadings: false,
            newRoleTitle: '新建角色',
            reNewRoleShow: false,
            modal_loading: false,
            formRef: 'addrole',
            newRole: {},
            ruleValidate: {
                roleName: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, message: '只能包含中文、字母、数字、_', trigger: 'blur'}
                ],
                roleRemark: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, message: '只能包含中文、字母、数字、_', trigger: 'blur'}
                ]
            },
            authorizedUserShow: false,
            authorizedUserTitle: '授权用户',
            currentPage: 1,
            pageSize: 20,
            totalNum: 0,
            currentPageAuthorizedUser: 1,
            totalNumAuthorizedUser: 10,
            tableUserData: [],
            nameKey: '',
            currentRoleId: '',
            highlightRoleId: '',
            userColumns: [
                {title: '已授权用户名(姓名)', key: 'userAdminName'},
                {
                    title: '操作',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '删除',
                            type: 'error',
                            on: {
                                click: () => {
                                    this.deleteUserClick(row)
                                }
                            }
                        }])
                    }
                }
            ]
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '角色管理',
                icon: 'icon-xitongguanli'
            })
        })
    },
    created () {
        this.searchRoleList()
        // this.searchRoleList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        filterName (value) {
            if (!value) {
                this.userNameList = []
                return
            }
            this.loadings = true
            setTimeout(() => {
                systemApi.searchUnAuthorizedUserList(this.currentRoleId, value).then(({data: {result, resultCode, msg}}) => {
                    this.loadings = false
                    if (resultCode === '000000') {
                        this.userNameList = result
                    } else {
                        this.$Message.error(msg)
                    }
                }).catch(() => {
                    this.loadings = false
                })
            }, 200)
        },
        updateUser () {
            systemApi.updateAuthorizedUser(this.currentRoleId, this.nameKey).then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    this.authorizedUserList(this.currentRoleId)
                    this.$Message.success(msg)
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
            })
        },
        handleCurrentChange (v) {
            this.currentPageAuthorizedUser = v
            this.searchUserList()
        },
        handleMainChange (v) {
            this.currentPage = v
            this.searchRoleList()
        },
        filterData (arr) {
            var newArr = []
            arr.map((item) => {
                var childrenArr
                if (item.children !== null && item.children !== []) {
                    childrenArr = this.filterData(item.children)
                } else {
                    childrenArr = []
                }
                newArr.push({
                    title: item.menuTitle,
                    checked: item.selected,
                    children: childrenArr,
                    expand: item.expand,
                    menuId: item.menuId,
                    menuPid: item.menuPid
                })
            })
            return newArr
        },
        loadData (roleId) {
            this.openLoading()
            systemApi.authorizedMenuTree(roleId).then(({data: {result, resultCode, msg}}) => {
                this.closeLoading()
                if (resultCode === '000000') {
                    this.treeData = this.filterData(result)
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
            })
        },
        singleClick (currentRow) {
            this.clickRole = true
            this.highlightRoleId = currentRow.roleId
            this.loadData(currentRow.roleId)
        },
        filterTreeData (arr) {
            var newArr = []
            arr.map((item) => {
                if (item.checked) {
                    newArr.push(item.menuId)
                }
            })
            var menuIds = newArr.join(',')
            return menuIds
        },
        updateTree () {
            let roleId = this.highlightRoleId
            let checkout = this.trees
            let menuIds = this.filterTreeData(this.$refs[checkout].getCheckedNodes())
            this.openLoading()
            systemApi.updateAuthorizedMenuTree(roleId, menuIds).then(({data: {result, resultCode, msg}}) => {
                this.closeLoading()
                if (resultCode === '000000') {
                    this.$Message.success(msg)
                    this.treeData = this.filterData(result)
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
            })
        },
        onStatusChange (row, val) {
            row.roleStatus = val ? 1 : 0
            this.$Modal.confirm({
                title: '状态信息修改确认',
                content: `您将${row.roleStatus ? '启用' : '停用'}该角色，是否继续？`,
                closable: false,
                loading: true,
                onOk: () => {
                    // TODO 刷新数据
                    systemApi.updateRoleState(row.roleId, val ? '1' : '0').then(({data: {result, resultCode, msg}}) => {
                        this.$Modal.remove()
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                        } else {
                            this.$Message.error(msg)
                            this.$nextTick(() => {
                                row.roleStatus = val ? 0 : 1
                            })
                        }
                    }).catch(() => {
                        this.$Modal.remove()
                        this.$nextTick(() => {
                            row.roleStatus = val ? 0 : 1
                        })
                    })
                },
                onCancel: () => {
                    this.$nextTick(() => {
                        row.roleStatus = val ? 0 : 1
                    })
                }
            })
        },
        onCreateNewRole () {
            this.newRoleShow = true
            this.newRoleTitle = '新建角色'
            this.newRole = {}
            this.newRole.status = true
        },
        onCancelClick (role) {
            this.$refs[role].resetFields()
            this.newRoleShow = false
            this.newRoleTitle = '新建角色'
            this.formRef = 'addrole'
        },
        onSubmitClick (role) {
            this.$refs[role].validate((valid) => {
                if (valid) {
                    let {roleName, roleRemark} = {
                        ...this.newRole
                    }
                    this.modal_loading = true
                    if (role === 'addrole') {
                        systemApi.addRoleInfo(
                            roleName,
                            roleRemark
                        ).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.onCancelClick(role)
                                this.currentPage = 1
                                this.searchRoleList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }).catch(() => {
                            this.modal_loading = false
                        })
                    } else {
                        let roleId = this.newRole.roleId
                        systemApi.updateRoleInfo(
                            roleId,
                            roleName,
                            roleRemark
                        ).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.onCancelClick(role)
                                this.searchRoleList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }).catch(() => {
                            this.modal_loading = false
                        })
                    }
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        reviseClick (row) {
            this.newRole = {...row}
            this.newRoleTitle = '修改角色'
            this.newRoleShow = true
            this.formRef = 'editRole'
        },
        deleteUserClick (row) {
            this.$Modal.confirm({
                title: '删除信息确认',
                content: `您是否确认删除选中的此条数据？`,
                closable: false,
                loading: true,
                onOk: () => {
                    // TODO 刷新数据
                    systemApi.deleteRoleUser(row.userAdminRoleId).then(({data: {result, resultCode, msg}}) => {
                        this.$Modal.remove()
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                            this.authorizedUserList(this.currentRoleId)
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
        deleteClick (row) {
            this.$Modal.confirm({
                title: '删除信息确认',
                content: `您是否确认删除选中的此条数据？`,
                closable: false,
                loading: true,
                onOk: () => {
                    // TODO 刷新数据
                    systemApi.deleteRoleInfo(row.roleId).then(({data: {result, resultCode, msg}}) => {
                        this.$Modal.remove()
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                            this.searchRoleList()
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
        authorizedUserClick (row) {
            this.authorizedUserShow = true
            this.nameKey = ''
            this.currentRoleId = row.roleId
            this.userNameList = []
            this.authorizedUserList(row.roleId)
        },
        searchRoleList () {
            this.openLoading()
            systemApi.searchRoleList(
                this.currentPage, this.pageSize
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
        authorizedUserList (roleId) {
            let userAdminName = ''
            this.modalLoading = true
            systemApi.authorizedUserList(
                roleId,
                userAdminName,
                this.currentPageAuthorizedUser,
                this.pageSize
            ).then(({data: {result, resultCode, msg}}) => {
                this.modalLoading = false
                if (resultCode === '000000') {
                    this.tableUserData = result.list
                    this.totalNumAuthorizedUser = result.total
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
                this.modalLoading = false
            })
        }
    },
    computed: {}
}
</script>

<style  lang="less" scoped>
.authorize{
    border: 1px solid #dddee1;
    &-title {
        font-weight: bold;
        height: 40px;
        line-height: 40px;
    }
    &-save {
        float: right;
        margin-top: 6px;
    }
}
</style>
