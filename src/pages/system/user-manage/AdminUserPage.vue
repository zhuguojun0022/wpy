<template>
<GPage bg>
    <table-header>
        <template slot="left">
            <Button type="primary">新建用户</Button>
            <Button type="ghost">删除</Button>
        </template>
        <template slot="right">
            <Input v-model="filterName" placeholder="用户名/姓名" style="width: 200px" clearable></Input>
            <Select v-model="filterRole" style="width: 200px">
                <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="filterStatus" style="width: 200px">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary">查询</Button>
        </template>
    </table-header>

    <Table :columns="columns" :data="tableData"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

    <Modal v-model="addUserModalShow" title="添加用户" loading @on-ok="onNewUserSubmint" ref="modal">
        <Form :model="newUser" :label-width="70" :rules="ruleValidate" ref="form" class="new-user-form">
            <FormItem prop="username" label="用户名" required>
                <Input v-model.trim="newUser.username" placeholder="请输入用户名">
                </Input>
            </FormItem>
            <FormItem prop="nickname" label="昵称" required>
                <Input v-model.trim="newUser.nickname" placeholder="请输入昵称">
                </Input>
            </FormItem>
             <FormItem label="角色" prop="roles" required>
                <Select v-model="newUser.roles">
                    <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
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
                                    this.onStatusChange(row.id, val)
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
                                    this.editClick(row.id)
                                }
                            }
                        }, {
                            label: '重置密码',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.resetPasswordClick(row.id)
                                }
                            }
                        }])
                    }
                }
            ],
            tableData: [],
            totalNum: 0,
            currentPage: 1,
            addUserModalShow: false,
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
        systemApi.searchUserList().then(({data: {result, code, msg}}) => {
            this.tableData = result.userList
            this.totalNum = result.totalNum
        })
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onClickPrimaryBtn () {},
        onNewUserSubmint () {},
        handleCurrentChange (v) {},
        onStatusChange (id, val) {}
    }
}
</script>
<style lang="less" scoped>
.new-user-form {
    margin-right: 40px;
}
</style>
