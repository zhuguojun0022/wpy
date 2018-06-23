<template>
    <div class="main" :style="{height:height}">
        <div class="content">
            <div class="title">人社部电子社保卡管理系统</div>
            <div class="info">欢迎使用</div>
        </div>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
    data () {
        return {
            height: ''
        }
    },
    created () {
        this.height = (window.innerHeight - 88) + 'px'
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '首页',
                icon: 'icon-xitongguanli'
            })
        })
    },
    methods: {
        ...mapMutations(['resetBreadcrumb'])
    }
}
</script>

<style lang="less" scoped>
    .main {
        background: #7c857c;
    }
    .content {
        position: absolute;
        top: 30%;
        left: 50%;
    }
    .title {
        text-align: center;
        font-size: 30px;
        color: #bd8888;
    }
    .info {
        margin-top: 80px;
        text-align: center;
        font-size: 40px;
        color: #fff;
    }
</style>