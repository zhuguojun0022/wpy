<template>
    <div class="main" :style="{width:width,height:height}">
        <div class="content">
            <!-- <div class="icon"><i class="iconfont icon-shebao"></i></div> -->
            <!-- <div class="title">欢迎进入电子社保卡管理平台</div> -->
            <!-- <div class="title">欢迎</div> -->
            <div class="img">
                <img src="../../../static/welcome.png" alt="暂无图片" >
            </div>
        </div>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
    data () {
        return {
            width: '',
            height: ''
        }
    },
    created () {
        this.clearBreadcrumb()
        this.width = (window.innerWidth - 200) + 'px'
        this.height = (window.innerHeight - 50) + 'px'
    },
    methods: {
        ...mapMutations(['clearBreadcrumb'])
    }
}
</script>

<style lang="less" scoped>
    .main {
        position: relative;
        // width: 100%;
        background:url(../../../static/loginbg.png) no-repeat;
        background-size:100% 100%;
        .content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 70%;
            .icon {
                height: 40px;
                text-align: center;
                color: #0888F2;
                .iconfont {
                    font-size: 50px;
                }
            }
            .title {
                margin-top: 30px;
                text-align: center;
                font-size: 32px;
                color: #0888F2;
            }
            .img {
                margin: 40px auto;
                width: 300px;
                height: auto;
                background: url(../../../static/loginbg.png) no-repeat center;
                background-size: contain;
                text-align: center;
                img {
                    width: 100%;
                    // margin-left: 26%;
                    vertical-align: center;
                }
            }
        }
    }
</style>