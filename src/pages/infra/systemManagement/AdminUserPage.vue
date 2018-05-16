<template>
<GPage bg title="用户管理（Admin）">

    userManage

    <!-- <TableBar @onRefresh="onRefresh" @onClickPrimaryBtn="onClickPrimaryBtn">
        <Row slot="searchs" :gutter="10">
            <Col span="3">
                <Select v-model="queryParams.status" @on-change="statusChange">
                    <Option v-for="item in userStatus" :value="item.code" :key="item.code">{{item.name}}</Option>
                </Select>
            </Col>
            <Col span="8">
                <Input icon="search" placeholder="搜索用户名或者昵称" v-model="queryParams.search" @keydown.enter.native="onEnter"></Input>
            </Col>
        </Row>
    </TableBar>
    <BaseTable :columns="columns" :apiFunction="tableDataApi" :query="queryParams" ref="usersTable"></BaseTable>

    <Modal v-model="addUserModalShow" title="添加用户" loading @on-ok="onNewUserSubmint" ref="modal">
        <Form :model="newUser" :label-width="70" :rules="ruleValidate" ref="form" class="new-user-form" v-show="!initPwd">
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
                    <Option v-for="role in roles" :value="role.code" :key="role.code">{{role.desc}}</Option>
                </Select>
            </FormItem>
        </Form>
        <div v-show="initPwd" class="init-pwd">
            <Icon type="locked"></Icon> 初始化密码：{{initPwd}}
        </div>
    </Modal> -->
</GPage>
</template>
<script>
import {TableBar, BaseTable} from '../../../components/table'
import {infraApi} from '../../../apis/'
import {userStatus} from '../../../common/consts'
const colorMap = function (code) {
    if (code === 'Sys_Admin') {
        return 'red'
    } else if (code.startsWith('Ptr_')) {
        return 'blue'
    } else if (code.startsWith('Agency_')) {
        return 'yellow'
    } else {
        return 'default'
    }
}
function roleRender (h, data) {
    const vnodes = []
    data.row.roles.forEach(role => {
        vnodes.push(h(
            'Tag', {props: {
                color: colorMap(role.code),
                checkable: false
            }}, role.desc
        ))
    })
    return h('div', vnodes)
}
function nameRender (h, data) {
    const isAdmin = data.row.username === 'admin'
    if (isAdmin) {
        return h('span', data.row.username)
    }
    return h('router-link', {
        props: {
            to: `adminUserProfile/${data.row.id}`
        }
    }, data.row.username)
}
function statusRender (h, data) {
    const status = data.row.status
    return h('Tag', {
        props: {
            color: status === 1 ? 'green' : (status === 4 ? 'default' : 'red')
        }
    }, userStatus[status].name)
}
export default {
    components: {TableBar, BaseTable},
    data () {
        return {
            columns: [
                {title: '用户名', key: 'username', render: nameRender},
                {title: '昵称', key: 'nickname'},
                {title: '角色', key: 'roles', render: roleRender},
                {title: '创建时间', key: 'createDate'},
                {title: '状态', key: 'status', render: statusRender}
            ],
            queryParams: {
                search: null,
                status: 1
            },
            addUserModalShow: false,
            newUser: {},
            roles: [],
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
            initPwd: ''
        }
    },
    beforeCreate () {
        infraApi.getAllRoles().then(({data: {result}}) => {
            this.roles = result.filter(r => r.code !== 'Sys_Admin')
        })
    },
    methods: {
        tableDataApi (query, page) {
            return infraApi.searchAdminUser(page, query.search, query.status)
        },
        onRefresh () {
            this.$refs.usersTable.loadData()
        },
        statusChange () {
            this.onRefresh()
        },
        onEnter () {
            this.onRefresh()
        },
        onClickPrimaryBtn () {
            this.newUser = {}
            this.initPwd = ''
            this.addUserModalShow = true
        },
        onNewUserSubmint () {
            if (!this.initPwd) {
                this.$refs.form.validate(v => {
                    if (v) {
                        infraApi.addUser(this.newUser).then(({data}) => {
                            if (data.code === '2000') {
                                this.initPwd = data.result
                            }
                            this.$refs.modal.buttonLoading = false
                        })
                    }
                })
            } else {
                this.addUserModalShow = false
                this.onRefresh()
            }
        }
    }
}
</script>
<style lang="less" scoped>
.new-user-form {
    margin-right: 40px;
}
.init-pwd {
    font-size: 20px;
    text-align: center;
    color: #999;
    font-weight: bold;
}
</style>
