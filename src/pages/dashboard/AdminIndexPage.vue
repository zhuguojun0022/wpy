<template>
    <div class="main">
        <div class="content">
            <div class="icon"><i class="iconfont icon-shebao"></i></div>
            <div class="title">欢迎进入电子社保卡线上平台</div>
            <div class="img">
                <img src="../../../static/mapbg2.png" alt="暂无图片" >
            </div>
        </div>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
    data () {
        return {}
    },
    created () {
        this.clearBreadcrumb()
    },
    methods: {
        ...mapMutations(['clearBreadcrumb'])
    }
}
</script>

<style lang="less" scoped>
    .main {
        padding: 100px 0 0;
        .content {
            .icon {
                height: 40px;
                text-align: center;
                color: #0888F2;
                .iconfont {
                    font-size: 50px;
                }
            }
            .title {
                margin-top: 15px;
                text-align: center;
                font-size: 32px;
                color: #0888F2;
            }
            .img {
                margin-top: 30px;
                // background: url(../../../static/mapbg2.png) no-repeat center;
                // background-size: contain;
                padding: 2% 0 0;
                text-align: center;
                img {
                    width: 70%;
                    // margin-left: 26%;
                    vertical-align: center;
                }
            }
        }
    }
</style>