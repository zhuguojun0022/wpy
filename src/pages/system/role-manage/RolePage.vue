<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Button type="primary" @click="onCreateNewRole">新增角色</Button>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="18">
            <Table highlight-row :columns="columns" :data="tableData" @on-current-change="singleClick"></Table>
        </Col>
        <Col span="6" class="authorize">
            <span class="authorize-title">授权功能</span>
            <Button type="primary" v-if="clickRole" class="authorize-save">保存</Button>
            <Tree :data="treeData" show-checkbox v-if="clickRole"></Tree>
        </Col>
    </Row>
    <Modal v-model="newRoleShow" :title="newRoleTitle" ref="modal">
        <Form :model="newRole" :label-width="80" :rules="ruleValidate" :ref="formRef" class="new-role-form">
            <FormItem prop="roleName" label="角色名称" required>
                <Input v-model.trim="newRole.roleName" placeholder="请输入角色名称"></Input>
            </FormItem>
            <FormItem prop="roleDescription" label="角色描述">
                <Input v-model.trim="newRole.roleDescription" type="textarea" placeholder="请输入角色描述"></Input>
            </FormItem>
            <FormItem prop="status" label="状态">
                <iSwitch size="large" v-model="newRole.status" @on-change="reOnStatusChange(newRole.status)">
                    <span slot="open">启用</span>
                    <span slot="close">停用</span>
                </iSwitch>
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
                <Input icon="ios-search" placeholder="用户名/姓名" style="width: 200px" @on-change="filterName"></Input>
                <Button type="primary" @click="onCreateNewUser">新建用户</Button>
            </div>
        </table-header>
        <Table :columns="userColumns" :data="tableUserData"></Table>
        <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>
    </Modal>
    <Modal v-model="reNewRoleShow" ref="modal">

    </Modal>
</GPage>
</template>
<script>
import { TableHeader, TableFooter } from '../../../components/table'
import {mapMutations} from 'vuex'
import {infraApi, systemApi} from '../../../apis'
export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            tableData: [],
            columns: [
                {title: '角色名称', key: 'roleName'},
                {title: '角色描述', key: 'roleDescription'},
                {title: '角色ID', key: 'roleId'},
                {title: '创建人', key: 'founder'},
                {title: '创建时间', key: 'creationTime'},
                {
                    title: '状态',
                    key: 'status',
                    render: (h, {row}) => {
                        return h('iSwitch', {
                            props: {
                                value: row.status,
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
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '修改',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.reviseClick(row)
                                }
                            }
                        }, {
                            label: '授权用户',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.authorizedUserClick(row)
                                }
                            }
                        }, {
                            label: '删除',
                            type: 'error',
                            on: {
                                click: () => {
                                    this.deleteClick(row)
                                }
                            }
                        }])
                    }
                }
            ],
            treeData: [],
            clickRole: false,
            newRoleShow: false,
            newRoleTitle: '新建角色',
            reNewRoleShow: false,
            modal_loading: false,
            formRef: 'addrole',
            newRole: {},
            ruleValidate: {
                roleName: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, message: '只能包含中文、字母、数字、_', trigger: 'blur'}
                ]
            },
            authorizedUserShow: false,
            authorizedUserTitle: '授权用户',
            currentPage: 1,
            totalNum: 10,
            tableUserData: [],
            userColumns: [
                {title: '已授权用户名(姓名)', key: 'authorizedUserName'},
                {
                    title: '操作',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '删除',
                            type: 'error',
                            on: {
                                click: () => {
                                    this.deleteClick(row)
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
                name: to.name,
                icon: 'home'
            })
        })
    },
    created () {
        systemApi.searchRoleList().then(({data: {result, code, msg}}) => {
            this.tableData = result.roleList
        })
        systemApi.authorizedUserList().then(({data: {result, code, msg}}) => {
            this.tableUserData = result.authorizedUserList
            this.totalNum = result.authorizedUserList.totalNum
            console.log(this.totalNum)
        })
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onClickPrimaryBtn () {},
        onNewUserSubmint () {},
        handleCurrentChange (v) {},
        filterData (arr) {
            var newArr = []
            arr.map((item) => {
                var childrenArr
                if (!item.leaf) {
                    childrenArr = this.filterData(item.subMenu)
                } else {
                    childrenArr = []
                }
                newArr.push({
                    title: item.menuName,
                    leaf: item.leaf,
                    menuIcon: item.menuIcon,
                    children: childrenArr,
                    render: (h, { root, node, data }) => {
                        var c = item.menuIcon
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            }
                        }, [
                            h('span', [
                                h('i', {
                                    attrs: {
                                        class: c + ' iconfont'
                                    },
                                    style: {
                                        marginRight: '8px'
                                    }
                                }),
                                h('span', item.menuName)
                            ])
                        ])
                    }
                })
            })
            return newArr
        },
        loadData () {
            infraApi.getMenu().then(({data: {result}}) => {
                this.treeData = this.filterData(result)
            })
        },
        singleClick () {
            this.clickRole = true
        },
        onStatusChange (row, val) {
            row.status = val
            this.$Modal.confirm({
                title: '状态信息修改确认',
                content: `您将${row.status ? '启用' : '停用'}该角色，是否继续？`,
                closable: false,
                onOk: () => {
                    this.$Modal.remove()
                    // TODO 刷新数据
                },
                onCancel: () => {
                    this.$nextTick(() => {
                        row.status = !val
                    })
                }
            })
        },
        testDd () {
            alert(123)
        },
        reOnStatusChange (val) {
            this.newRole.status = val
            this.$Modal.confirm({
                title: '状态信息修改确认',
                content: `您将${val ? '启用' : '停用'}该角色，是否继续？`,
                closable: false,
                onOk: () => {
                    this.$Modal.remove()
                },
                onCancel: () => {
                    this.newRole.status = !val
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
        },
        onSubmitClick (role) {
            this.$refs[role].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!')
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        reviseClick (row) {
            this.newRole = {...row}
            console.log(this.newRole)
            this.newRoleTitle = '修改角色'
            this.newRoleShow = true
        },
        deleteClick (row) {
            this.$Modal.confirm({
                title: '删除信息确认',
                content: `您是否确认删除选中的此条数据？`,
                closable: false,
                onOk: () => {
                    this.$Modal.remove()
                    // TODO 刷新数据
                },
                onCancel: () => {
                    this.selectedRows = []
                }
            })
        },
        authorizedUserClick (row) {
            this.authorizedUserShow = true
        }
    },
    mounted () {
        this.loadData()
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
