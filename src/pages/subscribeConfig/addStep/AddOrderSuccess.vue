<template>
    <div class="done-com bg-white">
        <div class="text-center p-y-2">
            <Icon type="ios-checkmark" size="50" color="#00C957"></Icon>
            <p class="text-center lab m-y-t-1">
                <span>完成</span>
            </p>
            <p class="text-center z">{{ c }}秒后将自动返回首页...</p>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            c: 30
        }
    },
    mounted () {
        this.timer = setInterval(() => {
            if (this.c-- <= 1 && this.timer) {
                clearInterval(this.timer)
                this.timer = null
                this.done()
            }
        }, 1000)
    },
    methods: {
        done () {
            this.$router.push({
                name: 'orderConfig',
                params: {
                    callerId: this.$route.params.callerId,
                    appId: this.$route.params.appId
                }
            })
        }
    },
    beforeDestroy () {
        if (this.timer) {
            clearInterval(this.timer)
        }
    }
}
</script>
<style lang="less">
    .done-com {
        .icon {
            line-height: 1;
            font-size: 80px!important;
            color: #2BCA71;
        }
        .lab {
            font-size: 18px;
            color: #1F2D3D;
            line-height: 2;
        }
        .z {
            font-size: 12px;
            color: #475669;
        }
    }
</style>