<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Button type="primary">新增角色</Button>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="18"><Table highlight-row :columns="columns" :data="tableData" @on-current-change="singleClick"></Table></Col>
        <Col span="6" class="authorize">
            <span>授权功能</span>
            <Button type="primary" v-if="clickRole">保存</Button>
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
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="onCancelClick(formRef)">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitClick(formRef)">提交</Button>
        </div>
    </Modal>
</GPage>
</template>
<script>
import { TableHeader } from '../../../components/table'
import {userStatus} from '../../../common/consts'
import {mapMutations} from 'vuex'
import {infraApi, systemApi} from '../../../apis'
export default {
    components: {TableHeader},
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
                                    this.reviseClick(row.id)
                                }
                            }
                        }, {
                            label: '授权用户',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.authorizedUserClick(row.id)
                                }
                            }
                        }, {
                            label: '删除',
                            type: 'error',
                            on: {
                                click: () => {
                                    this.deleteClick(row.id)
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
            modal_loading: false,
            formRef: 'addrole',
            newRole: {},
            ruleValidate: {
                roleName: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/, message: '只能包含中文、字母、数字、_', trigger: 'blur'}
                ]
            },
            userStatus: userStatus
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
                content: `您将${row.status ? '启用' : '停用'}该用户，是否继续？`,
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
        }
    },
    mounted () {
        this.loadData()
    }
}
</script>

<style  lang="less" scoped>
.authorize{
    border: 1px solid #dddee1;
    span {
        font-weight: bold;
        height: 40px;
        line-height: 40px;
    }
    button {
        float: right;
        margin-top: 6px;
    }
}
</style>
