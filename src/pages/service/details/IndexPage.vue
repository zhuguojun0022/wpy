<template>
    <GPage class="service-manage-page" bg>
        <!-- tab切换组件 -->
        <GTab :options="options" :value="value" @input="onChange"></GTab>
        <router-view></router-view>
    </GPage>
</template>

<script>
import GTab from '../../../components/GTab'
export default {
    components: {GTab},
    data () {
        return {
            options: [{
                label: '基础信息',
                value: 1
            }, {
                label: '订阅信息',
                value: 2
            }],
            value: 1
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            if (to.name === 'serviceDetailsBase') {
                vm.value = 1
            } else if (to.name === 'serviceDetailsOrder') {
                vm.value = 2
            }
        })
    },
    methods: {
        onChange (value) {
            if (value === 1) {
                this.$router.replace({
                    name: 'serviceDetailsBase'
                })
            } else if (value === 2) {
                this.$router.replace({
                    name: 'serviceDetailsOrder'
                })
            }
        }
    }
}
</script>

<style lang="less">

</style>
