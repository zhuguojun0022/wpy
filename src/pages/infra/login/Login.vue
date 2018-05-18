<template>
<div class="login-page">
    <header>
        <div class="logo-box">
            logo 区域
        </div>
    </header>
    <main class="content">
        <div class="main">
            <h1>管理平台</h1>
            <div class="login">
                <Form :label-width="0" :model="form">
                    <FormItem>
                        <i class="ivu-icon ivu-icon-person"></i>
                        <Input size="large" placeholder="请输入用户名" v-model="form.username"></Input>
                    </FormItem>
                    <FormItem>
                        <i class="ivu-icon ivu-icon-locked"></i>
                        <Input size="large" placeholder="请输入密码" type="password" v-model="form.passwd"></Input>
                    </FormItem>
                    <FormItem>
                        <i class="ivu-icon ivu-icon-checkmark-circled"></i>
                        <Input class="vcode" size="large" placeholder="请输入验证码" v-model="form.vcode" @on-enter="handleSubmit()">
                            <img slot="append" :src="imgCode" @click="getImgVCode">
                        </Input>
                    </FormItem>
                    <FormItem class="forget">
                        <a class="pull-right">忘记密码？</a>
                    </FormItem>
                    <FormItem>
                        <Button size="large" class="f-w" type="primary" @click="handleSubmit()">登录</Button>
                    </FormItem>
                </form>
            </div>
        </div>
    </main>
    <footer class="footer">
        <div class="links">
        </div>
        <div class="copyright">
            Copyright <i class="icon"></i> XXXXXXX公司
        </div>
    </footer>
</div>
</template>
<script>
import sha256 from 'js-sha256'
import {infraApi} from 'Apis/'
import {setLoginUser} from '../../../common/loginUser'
export default {
    data () {
        return {
            imgCode: '',
            form: {
                username: '',
                passwd: '',
                vcode: ''
            }
        }
    },
    beforeMount () {
        this.getImgVCode()
    },
    methods: {
        getImgVCode () {
            infraApi.getImgVCode().then(({data: {result}}) => {
                this.imgCode = 'data:image/png;base64,' + result.imgBase64
                this.imgCodeId = result.id
            })
        },
        handleSubmit () {
            const hash = sha256.create()
            hash.update(this.form.passwd)
            infraApi.login(this.form.username, hash.hex(), this.imgCodeId, this.form.vcode).then(({data}) => {
                if (data.code === '2000') {
                    setLoginUser(data.result)
                    this.$router.push('/')
                } else if (data.code === '4002' || data.code === '4004') {
                    this.imgCode = 'data:image/png;base64,' + data.result.imgBase64
                    this.imgCodeId = data.result.id
                }
            })
        }
    }
}
</script>
<style lang="less">
.login-page {
    background-image: url('../../../../static/bg.svg');
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;

    height: 100%;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-height: 100%;

    header {
        .logo-box {
            width: 800px;
            position: relative;
            padding: 10px 20px;
        }
    }

    main {
        padding: 100px 0 24px;
        flex: 1 1 0%;

        h1 {
            text-align: center;
            padding: 20px;
        }

        .login {
            width: 320px;
            margin: 0 auto;

            .ivu-form-item-content {
                .ivu-icon {
                    position: absolute;
                    left: 15px;
                    z-index: 10;
                    top: 16px;
                    color: #aaa;
                }
            }

            .ivu-input.ivu-input-large {
                height: 42px;
                color: rgba(0, 0, 0, .65);
                padding-left: 40px;
                background-color: #fff;
            }

            .ivu-btn.ivu-btn-large {
                height: 42px;
            }

            .vcode {
                position: relative;
                input.ivu-input {
                    padding-right: 100px;
                }

                .ivu-input-group-append {
                    padding: 0;
                    border: none;
                    position: absolute;
                    right: 1px;
                    top: 1px;
                    z-index: 100;
                    width: 80px;
                    background-color: transparent;
                    &:hover {
                        cursor: pointer;
                    }
                    img {
                        height: 40px;
                        display: inline-block;
                    }
                }
            }

            .forget {
                margin-bottom: 16px;
                margin-top: -8px;

                .ivu-form-item-content {
                    width: 100%;
                }
            }
        }
    }

    .footer {
        padding: 30px 0 20px;
        text-align: center;
        color: #777;

        .copyright {
            text-align: center;
            .icon {
                width: 14px;
                height: 14px;
                display: inline-block;
                font-size: 14px;
                line-height: 1;
                &:before {
                    content: "@";
                }
            }
        }
    }
}
</style>