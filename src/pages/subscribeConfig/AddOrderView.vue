<template>
    <GPage bg>
        <Row>
            <Col offset = "5" :span="18">
                <Steps :current="getStep">
                    <Step title="选择API"></Step>
                    <Step title="选择渠道"></Step>
                    <Step title="编辑策略"></Step>
                    <Step title="完成"></Step>
                </Steps>
            </Col>
        </Row>
        <component v-bind:is="currentView">
        </component>
    </GPage>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import selectApi from './addStep/SelectApiView'
import selectChannel from './addStep/SelectChannelView'
import edit from './addStep/EditView'
import addSuccess from './addStep/AddOrderSuccess'

export default {
    data () {
        return {}
    },
    computed: {
        ...mapGetters({
            getStep: 'getStep'
        }),
        currentView () {
            let view
            switch (this.getStep) {
            case 0:
                view = selectApi
                break
            case 1:
                view = selectChannel
                break
            case 2:
                view = edit
                break
            case 3:
                view = addSuccess
                break
            default:
                view = selectApi
            }
            return view
        }
    },
    beforeMount () {
        if (this.$route.name === 'copy') {
            this.copyConfigStep()
        }
    },
    mounted () {
        this.resetBreadcrumb({
            name: '订阅配置',
            icon: 'icon-subscribeConfig'
        })
        this.pushBreadcrumb([{
            name: '新增订阅'
        }])
    },
    destroyed () {
        this.resetStep()
        this.setApiInfo({})
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'resetBreadcrumb', 'copyConfigStep', 'resetStep', 'setApiInfo'])
    }
}
</script>
