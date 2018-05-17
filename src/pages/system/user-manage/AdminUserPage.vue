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
import {TableHeader, TableFooter} from '../../../components/table'
import {systemApi} from '../../../apis/'
import {userStatus} from '../../../common/consts'
import {mapMutations} from 'vuex'

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
// function roleRender (h, data) {
//     const vnodes = []
//     data.row.roles.forEach(role => {
//         vnodes.push(h(
//             'Tag', {props: {
//                 color: colorMap(role.code),
//                 checkable: false
//             }}, role.desc
//         ))
//     })
//     return h('div', vnodes)
// }
function statusRender (h, data) {
    const status = data.row.status
    return h('Tag', {
        props: {
            color: status === 1 ? 'green' : (status === 4 ? 'default' : 'red')
        }
    }, userStatus[status].name)
}
export default {
    components: {TableHeader, TableFooter},
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
                {title: '状态', key: 'status', render: statusRender},
                {title: '操作', render: statusRender}
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
            console.log('>>>>', result)
            this.tableData = result.userList
            this.totalNum = result.totalNum
        })
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onClickPrimaryBtn () {},
        onNewUserSubmint () {},
        handleCurrentChange (v) {}
    }
}
</script>
<style lang="less" scoped>
.new-user-form {
    margin-right: 40px;
}
</style>
