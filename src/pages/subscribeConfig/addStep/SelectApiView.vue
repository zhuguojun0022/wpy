<!-- 新增订阅页面 -->
<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Input v-model="orderApiName" size="small" placeholder="请输入API名称" style="width: 200px" clearable></Input>
            <Button size="small" icon="search" @click="searchClick">查询</Button>
        </div>
        <div slot="right">
            <Button size="small" type="primary" @click="nextStep">下一步</Button>
            <Button size="small" style="min-width: 52px;" @click="back">取消</Button>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="24">
            <Table highlight-row :columns="columns" :data="notOrderedCallerList" :height="tableHeihgt" @on-current-change="onCurrentChange"></Table>
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
            orderApiName: '',
            notOrderedCallerList: [],
            columns: [
                {
                    title: 'API名称',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: row.name,
                            style: {
                                marginRight: '10px',
                                lineHeight: '28px',
                                display: 'block',
                                float: 'left'
                            }
                        }])
                    }
                },
                {title: '描述', key: 'comments'},
                {title: '服务组', key: 'groupName'}
            ],
            tableHeihgt: '',
            activeType: 1,
            apiList: []
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
        this.getOrderApi()
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'openLoading', 'closeLoading', 'setStep', 'setApiInfo']),
        getOrderApi (type) {
            let name
            if (type) {
                name = this.orderApiName
            }
            this.openLoading()
            subconfigApi.getApiList({
                name: name,
                active: true
            }).then(({data: {msg, resultCode, result}}) => {
                this.closeLoading()
                if (resultCode === '000000') {
                    this.notOrderedCallerList = result
                    // this.apiList = this.apiList.length === 0 ? result : this.apiList
                } else {
                    this.$Message.error({
                        content: msg,
                        duration: 3
                    })
                }
            })
        },
        onCurrentChange (currentRow, oldRow) {
            // console.log(currentRow)
            this.setApiInfo(currentRow)
        },
        nextStep () {
            if (Object.keys(this.apiInfo).length < 1) {
                this.$Message.warning({
                    content: '您还未选择API，请选择',
                    duration: 3
                })
                return false
            }
            this.setStep()
        },
        searchClick () {
            this.getOrderApi('search')
        },
        back () {
            this.$router.push({
                name: 'orderConfig'
            })
        }
    },
    computed: {
        ...mapGetters({
            getStep: 'getStep',
            apiInfo: 'apiInfo'
        })
    },
    watch: {
    }
}
</script>
