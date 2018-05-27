<template>
<GPage bg>
    <table-header>
        <template slot="left">
            <Button type="primary" @click="onCreateNewUser">新建用户</Button>
            <Button type="ghost" @click="onDeleteClick">删除</Button>
        </template>
        <template slot="right">
            <Input v-model="filterName" placeholder="用户名/姓名" style="width: 200px" clearable></Input>
            <Select v-model="filterRole" style="width: 200px" placeholder="角色">
                <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="filterStatus" style="width: 200px" placeholder="状态">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>

    <Table :columns="columns" :data="tableData" @on-selection-change="onSelectionChange"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

    <Modal v-model="diaShow" :title="diaTitle" ref="modal">
        <Form :model="newUser" :label-width="80" :rules="ruleValidate" :ref="formRef" class="new-user-form">
            <FormItem prop="userCode" label="用户名" required>
                <Input v-model.trim="newUser.userCode" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem prop="userName" label="姓名" required>
                <Input v-model.trim="newUser.userName" placeholder="请输入姓名"></Input>
            </FormItem>
             <FormItem label="角色" prop="roles" required>
                <Select v-model="newUser.roles">
                    <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="phoneNum" label="手机号" required>
                <Input v-model.trim="newUser.phoneNum" placeholder="请输入手机号（可选）"></Input>
            </FormItem>
            <FormItem prop="email" label="邮箱" required>
                <Input v-model.trim="newUser.email" placeholder="请输入邮箱（可选）"></Input>
            </FormItem>
            <FormItem prop="status" label="邮箱" required>
                <iSwitch size="large" v-model="newUser.status">
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
</GPage>
</template>
<script>
import {TableHeader, TableFooter, TableSwitch} from '../../../components/table'
import {systemApi} from '../../../apis/'
import {userStatus} from '../../../common/consts'
import {mapMutations} from 'vuex'

export default {
    components: {TableHeader, TableFooter, TableSwitch},
    data () {
        return {
            filterName: '',
            filterRole: '',
            filterStatus: '',
            roleList: [],
            statusList: [],
            columns: [
                {type: 'selection', width: 60, align: 'center'},
                {title: '用户名', key: 'userCode'},
                {title: '姓名', key: 'userName'},
                {title: '手机号', key: 'phoneNum'},
                {title: '邮箱', key: 'email'},
                {title: '角色', key: 'roles'},
                {title: '创建时间', key: 'createDate'},
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
                                    this.onResetPasswordClick(row.id)
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
            diaTitle: '新建用户',
            modal_loading: false,
            formRef: 'adduser',
            newUser: {},
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
            userStatus: userStatus,
            selectedRows: []
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: to.name,
                icon: 'icon-xitongguanli'
            })
        })
    },
    created () {
        this.searchUserList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onCreateNewUser () {
            this.diaShow = true
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
                onOk: () => {
                    this.$Modal.remove()
                    // TODO 刷新数据
                },
                onCancel: () => {
                    this.selectedRows = []
                }
            })
        },
        onSearchClick () {},
        handleCurrentChange (v) {},
        onSelectionChange (selection) {
            this.selectedRows = selection
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
        },
        onEditClick (row) {
            this.newUser = {...row}
            this.diaTitle = '修改用户'
            this.diaShow = true
        },
        onResetPasswordClick (id) {},
        onCancelClick (name) {
            this.$refs[name].resetFields()
            this.diaShow = false
            this.diaTitle = '新建用户'
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
        searchUserList () {
            systemApi.searchUserList().then(({data: {result, code, msg}}) => {
                this.tableData = result.userList
                this.totalNum = result.totalNum
            })
        },
        addUserInfo () {
            systemApi.addUserInfo().then(({data: {result, code, msg}}) => {
                // TODO
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
