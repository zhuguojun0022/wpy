<template>
<GPage bg>
    <div class="bgwhite">
    <table-header>
        <template slot="right">
            <Button type="primary"  @click="onCreateNewUser"><Icon type="plus"></Icon> 新建用户</Button>
            <!-- <Button type="ghost" @click="onDeleteClick">删除</Button> -->
        </template>
        <template slot="left">
            <div class="filter pull-left">
                <Input  v-model="filterName" placeholder="用户名/姓名" style="width: 170px" clearable></Input>
                <Select v-model="filterRole" style="width: 170px" placeholder="角色" clearable>
                    <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
                </Select>
                <Select v-model="filterStatus" clearable style="width: 170px" placeholder="状态">
                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <p v-if="isFilter" class="m-y-t-1">
                    <Input  v-model="filterName" placeholder="用户名/姓名" style="width: 170px" clearable></Input>
                    <Select v-model="filterRole" style="width: 170px" placeholder="角色" clearable>
                        <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
                    </Select>
                    <Select v-model="filterStatus" clearable style="width: 170px" placeholder="状态">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </p>
            </div>
            <div class=" pull-left">
                <!-- <Button type="primary" @click="onSearchClick">展开筛选</Button> -->
                <div class="in-b fillter" @click="isFilterClick(isFilter)">展开筛选 <i class="ivu-icon ivu-icon-ios-arrow-down arrow-icon" :class="{'open-ul': isFilter}"></i></div>
                <Button type="primary" @click="onSearchClick">查询</Button>
                <Button  class="Reset" @click="onSearchClick">重置</Button>
            </div>
        </template>
    </table-header>

    <Table  border stripe  :columns="columns" :data="tableData" @on-selection-change="onSelectionChange" ref="selection" :height="tableHeihgt"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange" size="small" show-elevator></table-footer>

    <Modal v-model="diaShow" :mask-closable="false" :closable="false" :title="diaTitle" ref="modal">
        <Form :model="newUser" :label-width="80" :rules="ruleValidate" :ref="formRef" class="new-user-form" >
            <FormItem prop="userAdminName" label="用户名" required>
                <Input v-model.trim="newUser.userAdminName" placeholder="请输入用户名" :disabled="disabled" ></Input>
            </FormItem>
            <FormItem label="角色" prop="roleIds" required>
                <Select v-model="newUser.roleIds" :multiple="true">
                    <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option>
                </Select>
            </FormItem>
            <!-- <FormItem label="行政区划" prop="userAdminProvince"  required >
                <Select v-model="newUser.userAdminProvince" filterable placeholder="请输入行政区划"  @on-change="handleMockdel">
                    <Option v-for="item in prov" :value="item.REGION_ID" :key="item.REGION_ID">{{ item.REGION_NAME }}</Option>
                </Select>
            </FormItem> -->
            <FormItem label="行政区划" prop="userAdminProvince"  required >
                <Select v-model="newUser.userAdminProvince" filterable placeholder="请输入行政区划" ref='select'>
                    <Option v-for="item in prov" :value="item.REGION_ID" :key="item.REGION_ID">{{ item.REGION_NAME }}</Option>
                </Select>
            </FormItem>
            <!-- <FormItem label="市" prop="userAdminCity"  >
                <Select v-model="newUser.userAdminCity"  >
                    <Option v-for="item in city" :value="item.REGIONID" :key="item.REGIONID">{{ item.REGIONNAME }}</Option>
                </Select>
            </FormItem> -->
            <FormItem prop="userAdminMobile" label="手机号">
                <Input v-model.trim="newUser.userAdminMobile" :maxlength="11" placeholder="请输入手机号（可选）"></Input>
            </FormItem>
            <FormItem prop="userAdminEmail" label="邮箱">
                <Input v-model.trim="newUser.userAdminEmail" placeholder="请输入邮箱（可选）"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button class="Reset" @click="onCancelClick(formRef)">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitClick(formRef)">提交</Button>
        </div>
    </Modal>
    </div>
</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../../components/table'
import {systemApi} from '../../../apis/'
// import {infraApi} from '../../../apis'
import {userStatus} from '../../../common/consts'
import {mapMutations} from 'vuex'
import {formatDateTime} from '../../../common/utils'
// import eventVue from '../../../components/VueEvent.js'

export default {
    name: 'userManage',
    components: {TableHeader, TableFooter},
    data () {
        return {
            accept: false,
            isFilter: false,
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
                // {type: 'selection', width: 50, align: 'center'},
                {title: '用户名', width: 100, key: 'userAdminName'},
                {title: '行政区划', width: 100, key: 'regionName'},
                // {title: '行政区划', key: 'regionId'},
                {title: '手机号', key: 'userAdminMobile', width: 120},
                {title: '邮箱', width: 100, key: 'userAdminEmail'},
                {
                    title: '角色',
                    width: 100,
                    key: 'roles',
                    render: (h, {column, index, row}) => {
                        let roles = row.roles.map(e => e.roleName)
                        let roleStr = roles.join(',')
                        // console.log(roleStr, 'wpy')
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: roleStr
                        }])
                    }
                },
                {
                    title: '角色',
                    width: 100,
                    key: 'roles',
                    render: (h, {column, index, row}) => {
                        let roles = row.roles.map(e => e.roleName)
                        let roleStr = roles.join(',')
                        // console.log(roleStr, 'wpy')
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: roleStr
                        }])
                    }
                },
                {
                    title: '角色',
                    width: 100,
                    key: 'roles',
                    render: (h, {column, index, row}) => {
                        let roles = row.roles.map(e => e.roleName)
                        let roleStr = roles.join(',')
                        // console.log(roleStr, 'wpy')
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: roleStr
                        }])
                    }
                },
                {
                    title: '创建时间',
                    width: 170,
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
                            }, '启用'),
                            h('span', {
                                slot: 'close'
                            }, '停用')
                        ])
                    }
                },
                {
                    title: '操作',
                    width: 210,
                    fixed: 'right',
                    className: 'demo-table-info-column',
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
                        }, {
                            label: '删除',
                            type: 'error',
                            on: {
                                click: () => {
                                    this.onEditClick(row)
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
                userAdminEmail: '',
                // userAdminProvince: ''
                userAdminProvince: ''
                // userAdminCity: 0
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
                roleIds: [{required: true, type: 'array', message: '必填项', trigger: 'change'}],
                userAdminProvince: [{required: true, message: '必填项', trigger: 'change', type: 'number'}]
                // userAdminCity: [{trigger: 'change', type: 'number'}]
            },
            userStatus: userStatus,
            selectedRows: [],
            tableHeihgt: '',
            disabled: false,
            prov: [],
            city: [],
            params: ''
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
        this.tableHeihgt = window.innerHeight - 215
        this.tableWidth = window.innerWidth - 255
        // infraApi.getProvinceID().then(res => {
        //     const data = res.data.result
        //     this.prov = data
        //     this.prov.unshift({'REGION_ID': 0, 'REGION_NAME': '全国'})
        // })
        this.accepts()
    },
    // watch: {
    //     accept: function () {
    //         if (this.accept) {
    //             // this.tableWidth = window.innerWidth - 225
    //             this.tableWidth = 100
    //             console.log('1')
    //             console.log(this.tableWidth, 'tableWidth')
    //         } else {
    //             console.log('2')
    //             this.tableWidth = '222'
    //             console.log(this.tableWidth, 'tableWidth')
    //         }
    //     }
    // },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        // accepts () {
        //     // console.log('2')
        //     eventVue.$on('myFun', (message) => {
        //         this.accept = message
        //     })
        // },
        isFilterClick (isFilter) {
            this.isFilter = !isFilter
            if (this.isFilter) {
                this.tableHeihgt = window.innerHeight - 262
            } else {
                this.tableHeihgt = window.innerHeight - 217
            }
        },
        onCreateNewUser () {
            let query = this.$refs['select'].$data.query
            if (query) {
                this.$refs['select'].$data.query = ''
            }
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
            this.currentPage = 1
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
            let query = this.$refs['select'].$data.query
            if (query) {
                this.$refs['select'].$data.query = ''
            }
            this.formRef = 'edituser'
            this.newUser = {...row}
            let roleIds = this.newUser.roles.map(e => e.roleId)
            this.newUser.roleIds = roleIds
            this.newUser.userAdminId = row.userAdminId
            this.newUser.userAdminProvince = Number(row.regionId)
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
                    let {userAdminName, userAdminEmail, userAdminMobile, roleIds, userAdminProvince} = {
                        ...this.newUser
                    }
                    let roleIdsStr = roleIds.join(',')
                    this.modal_loading = true
                    // let regionId = userAdminProvince
                    // if (regionId === 0 || regionId === undefined) {
                    //     regionId = userAdminProvince
                    // }
                    if (name === 'adduser') {
                        systemApi.addUserInfo(userAdminName, userAdminEmail, userAdminMobile, roleIdsStr, userAdminProvince).then(({data: {result, resultCode, msg}}) => {
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
                        systemApi.updateUserInfo(userAdminId, userAdminName, userAdminEmail, userAdminMobile, roleIdsStr, userAdminProvince).then(({data: {result, resultCode, msg}}) => {
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
.bgwhite{
    background: white;
    font-size: 14px!important;
    padding: 15px 15px 0px;
    z-index: 10;
    overflow: auto;
}
.new-user-form {
    margin-right: 40px;
}
.ivu-select-input {
    line-height: 24px !important;
}
.filter {
    display: inline-block;
    width: 548px;
    height: auto;
}
 .arrow-icon {
    position: relative;
    float: right;
    top: 4px;
    transition: transform .2s ease-in-out;
}

 .open-ul {
     transform: rotate(180deg);
 }
 .fillter {
    color:#2d8cf0;
    i {
        // width: 14px;
        margin-left: 10px;
    }
 }
Table {
    overflow: hidden
}
.demo-table-info-column {
    background: white
}
</style>
