<template>
    <div class="service-detials-order p-y">
        <!-- <section class="top">
            <RadioGroup v-model="activeType" type="button" size="small">
                <Radio :label="1">全部</Radio>
                <Radio :label="2">已过期</Radio>
            </RadioGroup>
        </section> -->
        <section class="p-y">
            <Table class="order-table-list" :columns="columns" :data="list" size="small"></Table>
        </section>
    </div>
</template>

<script>
import {serviceApi, subconfigApi} from '../../../apis'
export default {
    data () {
        const statusFilter = (serverTime, row) => {
            if (row.active) {
                return {
                    label: '已生效',
                    color: 'green'
                }
            } else {
                return {
                    label: '未启用',
                    color: 'red'
                }
            }
        }
        return {
            activeType: 1,
            list: [],
            columns: [{
                title: '订阅编号',
                key: 'id',
                render: (h, {column, index, row}) => {
                    return this.getCellRender(h, [{
                        tag: 'a',
                        label: row.id,
                        type: 'text',
                        class: {'table-order-id': true},
                        on: {
                            click: () => {
                                this.onOrderIdClick(row)
                            }
                        }
                    }])
                }
            }, {
                title: '渠道',
                key: 'callerName',
                minWidth: 100
            }, {
                title: '状态',
                key: 'active',
                fixed: 'center',
                width: 95,
                render: (h, {column, index, row}) => {
                    let serverTime = this.serverTime
                    return this.getCellRender(h, [{
                        label: statusFilter(serverTime, row).label,
                        color: statusFilter(serverTime, row).color,
                        tag: 'Tag'
                    }])
                }
            }, {
                title: '操作',
                fixed: 'center',
                render: (h, {column, index, row}) => {
                    let serverTime = this.serverTime
                    return this.getCellRender(h, [{
                        label: !row.active && statusFilter(serverTime, row).label !== '已过期' ? '启用' : '停用',
                        type: !row.active && statusFilter(serverTime, row).label !== '已过期' ? 'success' : 'warning',
                        // style: {
                        //     display: !row.active && statusFilter(serverTime, row).label !== '已过期' ? 'inline-block' : 'none'
                        // },
                        on: {
                            click: () => {
                                this.onOrderStatusClick(row)
                            }
                        }
                    }, {
                        label: '删除',
                        type: 'error',
                        disabled: !row.active && statusFilter(serverTime, row).label !== '已过期',
                        // style: {
                        //     display: !row.active && statusFilter(serverTime, row).label !== '已过期' ? 'inline-block' : 'none'
                        // },
                        on: {
                            click: () => {
                                this.onDeleteOrderClick(row)
                            }
                        }
                    }])
                }
            }]
        }
    },
    mounted () {
        let id = this.$route.params.id
        // id = 'first_api_id'
        this.getOrderListByApiId(id)
    },
    methods: {
        onOrderIdClick (row) {
            this.$router.push({
                name: 'subDetails',
                params: {
                    orderId: row.id,
                    apiName: row.apiName,
                    channelName: row.callerName
                }
            })
        },
        onOrderStatusClick (row) {
            this.$Modal.confirm({
                title: '提示',
                content: `您将${row.active ? '停用' : '启用'}该订阅，是否继续？`,
                cancelText: '取消',
                loading: true,
                onOk: () => {
                    subconfigApi.updateStatusOrderedAPI({
                        id: row.id,
                        active: true
                    }).then(({data: {resultCode, msg}}) => {
                        if (resultCode === '000000') {
                            this.$Modal.remove()
                            this.$Message.success({
                                content: msg,
                                duration: 2
                            })
                            row.active = !row.active
                        } else {
                            this.$Modal.remove()
                            this.$Message.error({
                                content: msg,
                                duration: 2
                            })
                        }
                    })
                }
            })
        },
        onDeleteOrderClick (id) {
            this.$Modal.confirm({
                title: '提示',
                content: `您将删除该订阅，是否确认？`,
                cancelText: '取消',
                loading: true,
                onOk: () => {
                    serviceApi.deleteAPI(row.id, 4).then(({data: {msg, result, resultCode}}) => {
                        this.$Modal.remove()
                        // 处理逻辑
                        if (resultCode === '000000') {
                            this.getApiList()
                            this.$Message.success({
                                content: msg
                            })
                        } else {
                            this.$Message.warning({
                                content: msg
                            })
                        }
                    }).catch(() => {
                        this.$Modal.remove()
                    })
                }
            })
        },
        getOrderListByApiId (id) {
            serviceApi.getOrderListByApiId(id).then(({data: {resultCode, msg, result}}) => {
                // TODO
                this.list = result
            })
        }
    }
}
</script>

<style lang="less">

</style>
