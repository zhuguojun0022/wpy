<template>
<div class="login-page">
    <header>
        <div class="logo-box">
            <img src="(../../../../static/logo.png" alt="">
        </div>
    </header>
    <main class="content">
        <div>
        <h1>全国电子社保卡管理平台</h1>
        <div class="main">
            <div class="loginContent"></div>
            <div class="login">
                <div>
                <h2>账号密码登录</h2>
                <Form :label-width="0" :model="form">
                    <FormItem>
                        <Input id="t" size="large" autocomplete="off" placeholder="用户名" v-model="form.username"></Input>
                    </FormItem>
                    <FormItem>
                        <Input size="large" autocomplete="off" placeholder="密码" type="password" v-model="form.passwd"></Input>
                    </FormItem>
                    <FormItem>
                        <Input class="vcode" size="large" placeholder="验证码" v-model="form.vcode" @on-enter="handleSubmit()">
                            <img slot="append" :src="imgCode" width="105" height="36" @click="getImgVCode">
                        </Input>
                    </FormItem>
                    <div class="forget">忘记密码</div>
                    <FormItem>
                        <Button size="large" class="login-btn f-w" type="primary" @click="handleSubmit()">登录</Button>
                    </FormItem>
                </form>
                </div>
            </div>
        </div>
        </div>
    </main>
    <!-- <footer class="footer">
        <div class="links">
        </div>
        <div class="copyright">
            Copyright <i class="icon"></i> XXXXXXX公司
        </div>
    </footer> -->
</div>
</template>
<script>
import sha256 from 'js-sha256'
import {infraApi} from 'Apis/'
import {setLoginUser} from '../../../common/loginUser'
import {randomStr} from '../../../common/utils/randomString'

export default {
    data () {
        return {
            imgCode: null,
            form: {
                username: '',
                passwd: '',
                vcode: ''
            },
            randomString: ''
        }
    },
    beforeMount () {
        this.getImgVCode()
    },
    methods: {
        getImgVCode () {
            this.randomString = randomStr(true, 8, 10)
            console.log(this.randomString, 'random')
            let img = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8088'
            this.imgCode = `${img}/auth/captcha/genImage?cid=${this.randomString}`
        },
        handleSubmit () {
            if (!this.form.username || !this.form.passwd || !this.form.vcode) {
                this.$Message.warning('请填写完整登陆信息')
                return
            }
            const hash = sha256.create()
            hash.update(this.form.passwd)
            infraApi.login(this.form.username, hash.hex(), this.randomString, this.form.vcode).then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    setLoginUser(result)
                    this.$router.push('/')
                } else {
                    this.$Message.error(msg)
                    this.getImgVCode()
                }
            })
        }
    }
}
</script>
<style lang="less">
.login-page {
    background:url(../../../../static/loginbg.png) no-repeat;
    width:100%;
    height:100%;
    background-size:100% 100%;
    position:absolute;
    filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='../../../../static/loginbg.png',sizingMethod='scale');

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
            // width: 200px;
            height: 40px;
            position: relative;
            background:#061e39;;
            // background-size:100% 100%;
            // padding: 10px 20px;
        }
    }

    main {
        // padding: 100px 0 24px;
        flex: 1 1 0%;
        display: flex;
        justify-content:center;
        align-items:Center;

        .main {
            width: 570px;
            display: flex;
            // margin: 0 auto;
        }
         .loginContent{
                width: 285px;
                height: 345px;
                background:url(../../../../static/loginContent.png) no-repeat;
                background-size:100% 100%;
                float: left
            }

        h1 {
            text-align: left;
            padding: 0px 20px 25px 30px;
            color: white;
            font-size: 30px;
            position: relative;
            i {
                position: absolute;
                left: 30px;
                top: 10px;
                font-size: 60px;
            }
        }

        .login {
            width: 285px;
            // margin: 0 auto;
            background: #fff;
            // padding: 40px 60px;
             display: flex;
             justify-content:center;
             align-items:Center;

            h2 {
                color: black;
                font-size: 16px;
                // border-bottom: 3px solid rgb(91, 10, 241);
                text-align: left;
                width: 100px;
                // margin: 0 auto;
                margin-bottom: 24px;
            }
            .forget {
                text-align: right;
                color: #1e7be3;
                font-size: 14px;
                line-height: 100%;
                padding-top: 10px;
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
                // border: none;
                width: 220px;
                height: 35px;
                margin-bottom: 10px;
                border: 2px solid #cccccc;
                border-radius: 0;
                &:focus {
                    box-shadow: none;
                }
            }
            .ivu-input.ivu-input-large {
                height: 35px;
                color: rgba(0, 0, 0, .65);
                background-color: #fff;
            }

            .ivu-btn.ivu-btn-large {
                height: 35px;
            }

            .vcode {
                position: relative;
                input.ivu-input {
                    // padding-right: 100px;
                    width: 105px;
                }

                .ivu-input-group-append {
                    padding: 0;
                    border: none;
                    position: absolute;
                    right: 25px;
                    top: 1px;
                    z-index: 100;
                    width: 80px;
                    background-color: transparent;
                    &:hover {
                        cursor: pointer;
                    }
                    img {
                        height: 34px;
                        display: inline-block;
                    }
                }
            }

            .login-btn {
                margin-top: 16px;
                width: 220px;
                height: 10px;
                background: #e54a49;
                letter-spacing: 10px;
                // border-color:  white!important;

                // &:hover {
                //     background: lighten(#5b0af1, 10%);
                // }
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