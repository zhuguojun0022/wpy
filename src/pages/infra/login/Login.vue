<template>
<div class="login-page">
    <header>
        <div class="logo-box">
            logo 区域
        </div>
    </header>
    <main class="content">
        <div class="main">
            <h1><i class="iconfont icon-shebao"></i> 社保卡线上平台</h1>
            <div class="login">
                <h2>登录</h2>
                <Form :label-width="0" :model="form">
                    <FormItem>
                        <Input id="t" size="large" autocomplete="off" placeholder="请输入用户名" v-model="form.username"></Input>
                        
                    </FormItem>
                    <FormItem>
                        <!-- <i class="iconfont icon-eye_none eye-icon"></i> -->
                        <Input size="large" autocomplete="off" placeholder="请输入密码" type="password" v-model="form.passwd"></Input>
                        
                    </FormItem>
                    <FormItem>
                        <Input class="vcode" size="large" placeholder="请输入验证码" v-model="form.vcode" @on-enter="handleSubmit()">
                            <img slot="append" :src="imgCode" @click="getImgVCode">
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button size="large" class="login-btn f-w" type="primary" @click="handleSubmit()">立即登录</Button>
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
    background-image: url('../../../../static/loginbg.jpg');
    background-repeat: no-repeat;
    // background-position: center;
    background-size: 100%;

    height: 100%;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-height: 100%;

    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px white inset !important;
    }
    input:-webkit-autofill {
        transition: background-color 5000s ease-in-out 0s;
    }

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

        .main {
            width: 400px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            padding: 30px 20px 30px 80px;
            color: white;
            font-size: 30px;
            position: relative;
            
            i {
                position: absolute;
                    left: 50px;
                    top: 10px;
                    font-size: 60px;
            }
        }

        .login {
            width: 400px;
            margin: 0 auto;
            background: #fff;
            padding: 40px 60px;
            border-radius: 4px;

            h2 {
                color: rgb(91, 10, 241);
                font-size: 22px;
                border-bottom: 3px solid rgb(91, 10, 241);
                text-align: center;
                width: 45px;
                margin: 0 auto;
                margin-bottom: 20px;
            }

            .ivu-form-item {
                margin-bottom: 0;
            }

            .ivu-form-item-content {
                .eye-icon {
                    position: absolute;
                    right: 6px;
                    z-index: 10;
                    font-size: 12px;
                    top: 7px;
                    color: #b7b7b7;
                }
                .ivu-input-icon {
                    color: #b7b7b7;
                }
                .ivu-input-icon-clear {
                    display: block;
                }
            }

            .ivu-input {
                border: none;
                border-bottom: 2px solid #eeeeee;
                border-radius: 0;
                &:focus {
                    box-shadow: none;
                }
            }
            .ivu-input.ivu-input-large {
                height: 42px;
                color: rgba(0, 0, 0, .65);
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

            .login-btn {
                margin-top: 40px;
                background: #5b0af1;
                letter-spacing: 10px;

                &:hover {
                    background: lighten(#5b0af1, 10%);
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