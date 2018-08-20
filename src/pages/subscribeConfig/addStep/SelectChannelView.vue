<!-- 新增订阅页面 -->
<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Input v-model="channelName" size="small" style="width: 200px;" type="text" placeholder="请输入渠道名称" auto-complete="off"></Input>
            <Button size="small" icon="search" @click="searchClick">查询</Button>
        </div>
        <div slot="right">
            <Button size="small" type="primary" @click="nextStep">下一步</Button>
            <Button size="small" style="min-width: 52px;" @click="back">上一步</Button>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="24">
            <Table highlight-row :columns="columns" :data="notOrderedCallerList" :height="tableHeihgt" @on-selection-change="onSelectionChange"></Table>
        </Col>
    </Row>
</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../../components/table'
import { mapGetters, mapMutations } from 'vuex'
import { subconfigApi } from '../../../apis'
// import server from '../../config/httpConfig'
// import {systemApi} from '../../apis'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            channelName: '',
            notOrderedCallerList: [],
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {title: '渠道编号', key: 'channelId'},
                {title: '渠道名称', key: 'AAZ571'},
                {
                    title: '渠道类型',
                    key: 'AAZ573',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: this.channelType(row.AAZ573)
                        }])
                    }
                },
                {
                    title: '渠道等级',
                    key: 'AAZ572',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: this.channelLevel(row.AAZ572)
                        }])
                    }
                }
            ],
            tableHeihgt: '',
            serverTime: 0,
            activeType: 1
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.pushBreadcrumb({
                name: '新增订阅'
            })
        })
    },
    created () {
        this.tableHeihgt = window.innerHeight - 284
    },
    mounted () {
        this.setChannelInfo([])
        this.getChannelInfo()
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'openLoading', 'closeLoading', 'setStep', 'setApiInfo', 'setChannelInfo', 'gobackStep']),
        channelType (type) {
            if (type === 0) {
                return '地方渠道'
            } else if (type === 1) {
                return '中央政府或部门'
            } else if (type === 2) {
                return '银行'
            } else if (type === 3) {
                return '第三方可信渠道'
            } else if (type === 4) {
                return '第三方其他渠道'
            }
        },
        channelLevel (level) {
            if (level === 1) {
                return '一级'
            } else if (level === 2) {
                return '二级'
            } else if (level === 3) {
                return '三级'
            }
        },
        getChannelInfo (type) {
            let name = ''
            if (type === 'search') {
                name = this.channelName
            }
            this.openLoading()
            this.closeLoading()
            subconfigApi.getChannelInfo({
                name: name
            }).then(({data: {resultCode, result, msg}}) => {
                if (resultCode === '000000') {
                    this.notOrderedCallerList = result
                }
            })
        },
        onSelectionChange (currentRow) {
            // console.log(currentRow)
            this.setChannelInfo(currentRow)
            // this.setApiInfo(currentRow)
        },
        nextStep () {
            if (Object.keys(this.channelInfo).length < 1) {
                this.$Message.warning({
                    content: '您还未选择渠道，请选择',
                    duration: 3
                })
                return false
            }
            this.setStep()
        },
        searchClick () {
            this.getChannelInfo('search')
        },
        back () {
            this.setApiInfo({})
            this.setChannelInfo([])
            this.gobackStep()
        }
    },
    computed: {
        ...mapGetters({
            getStep: 'getStep',
            apiInfo: 'apiInfo',
            channelInfo: 'channelInfo'
        })
    },
    watch: {
    }
}
</script>