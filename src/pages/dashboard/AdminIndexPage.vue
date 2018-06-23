<template>
    <div class="main" :style="{height:height,width:width}">
        <div class="content">
            <div class="icon"><i class="iconfont icon-shebao"></i></div>
            <div class="title">欢迎进入电子社保卡线上平台</div>
            <div class="img">
                <img src="../../../static/icon_shouye.png" alt="暂无图片" >
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            height: '',
            width: ''
        }
    },
    created () {
        this.height = (window.innerHeight - 44) + 'px'
        this.width = (window.innerWidth - 240) + 'px'
    },
    methods: {}
}
</script>

<style lang="less" scoped>
    .main {
        position: absolute;
        top: 44px;
        right: 0;
        padding: 0 20px;
        box-sizing: border-box;
        // background:url(../../../static/mapbg.png) no-repeat left top;
        background: rgb(229, 241, 237);
        .content {
            position: absolute;
            width: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            .icon {
            height: 40px;
            text-align: center;
            color: #0888F2;
                .iconfont {
                    font-size: 40px;
                }
            }
            .title {
               margin-top: 15px;
               text-align: center;
               font-size: 16px;
               color: #0888F2;
            }
            .img {
                margin-top: 30px;
                background: url(../../../static/mapbg.png) no-repeat center;
                background-size: contain;
                padding: 2% 0 10% 0;
                img {
                    width: 45%;
                    margin-left: 26%;
                    vertical-align: center;
                }
            }
        }
    }
</style>