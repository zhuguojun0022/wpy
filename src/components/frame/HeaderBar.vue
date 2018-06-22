<template>
<div class="header-bar">
    <div class="user-box">
        <Dropdown>
            <a class="name"><Icon type="person"></Icon>{{userAdminName}}</a>
            <Icon type="arrow-down-b"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem @click.native="onLogout"><Icon type="android-exit"></Icon>退出</DropdownItem>
                <DropdownItem @click.native="changePwd"><Icon type="android-settings"></Icon>修改密码</DropdownItem>
            </DropdownMenu>
        </Dropdown>
        <Modal v-model="diaShow" :mask-closable="false" :closable="false" class-name="vertical-center-modal" :title="diaTitle" ref="modal">
        <Form :model="password" :label-width="90" :rules="ruleValidate" :ref="formRef" class="new-user-form">
            <FormItem prop="userAdminPwdOld" label="旧密码" required>
                <Input v-model.trim="password.userAdminPwdOld" placeholder="请输入旧密码" clearable></Input>
            </FormItem>
            <FormItem prop="userAdminPwd" label="新密码" required>
                <Input v-model.trim="password.userAdminPwd" placeholder="请输入新密码" clearable></Input>
            </FormItem>
            <FormItem  prop="userAdminPwdAgain" label="新密码确认" required>
                <Input v-model.trim="password.userAdminPwdAgain" placeholder="请再次输入新密码" clearable></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="onCancelClick(formRef)">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitClick(formRef)">提交</Button>
        </div>
    </Modal>
    </div>
</div>
</template>
<script>
import {loginOut} from '../../common/utils'
import {infraApi} from '../../apis/index'
import sha256 from 'js-sha256'
export default {
    name: 'header-bar',
    data () {
        return {
            diaShow: false,
            diaTitle: '修改密码',
            password: {},
            modal_loading: false,
            formRef: 'pwd',
            userAdminName: window.sessionStorage.getItem('USERNAME'),
            ruleValidate: {
                userAdminPwdOld: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                userAdminPwd: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/, message: '必须包含大写字母、小写字母、数字，长度为8-16位', trigger: 'blur'}
                ],
                userAdminPwdAgain: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ]
            }
        }
    },
    mounted () {},
    methods: {
        onLogout () {
            loginOut()
            this.$router.replace('/login')
        },
        changePwd () {
            this.diaShow = true
        },
        onCancelClick (name) {
            this.$refs[name].resetFields()
            this.diaShow = false
        },
        onSubmitClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let {userAdminPwdOld, userAdminPwd, userAdminPwdAgain} = {
                        ...this.password
                    }
                    let userAdminId = sessionStorage.getItem('USERID')
                    if (userAdminPwd === userAdminPwdOld) {
                        this.$Message.error('新密码不能与旧密码相同')
                        return
                    }
                    if (userAdminPwd !== userAdminPwdAgain) {
                        this.$Message.error('两次输入的新密码不一致')
                        return
                    }
                    let o = sha256.create()
                    let n = sha256.create()
                    o.update(userAdminPwdOld)
                    n.update(userAdminPwd)
                    userAdminPwdOld = o.hex()
                    userAdminPwd = n.hex()
                    this.modal_loading = true
                    infraApi.changePwd(userAdminId, userAdminPwdOld, userAdminPwd).then(({data: {result, resultCode, msg}}) => {
                        this.modal_loading = false
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                            this.onCancelClick(name)
                        } else {
                            this.$Message.error(msg)
                        }
                    }).catch(() => {
                        this.modal_loading = false
                    })
                } else {
                    this.$Message.error('校验失败!')
                }
            })
        }
    }
}
</script>
<style lang="less">
@header-height:44px;
.header-bar {
    background: #fff;
    height: @header-height;
    border-bottom: 1px solid #f3f3f3;

    .user-box {
        float: right;
        height: @header-height;
        // padding: 10px;
        width: 120px;
        line-height: @header-height;
        text-align: center;
        .name {
            font-weight: bold;
            color: #777;
        }
        .ivu-icon {
            color: #777;
            margin-right: 5px;
        }

        &:hover {
            background-color: #f0f0f0;
            cursor: pointer;
        }
    }
}
</style>
