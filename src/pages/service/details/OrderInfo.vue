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
import {serviceApi} from '../../../apis'
export default {
    data () {
        const statusFilter = (serverTime, row) => {
            if (row.subscribeExpried <= serverTime) {
                return {
                    label: '已过期',
                    color: 'default'
                }
            } else {
                if (row.active) {
                    if (row.subscribeBegin > serverTime) {
                        return {
                            label: '未生效',
                            color: 'default'
                        }
                    } else if (row.subscribeExpried > serverTime && row.subscribeBegin <= serverTime) {
                        return {
                            label: '已生效',
                            color: 'green'
                        }
                    }
                } else {
                    return {
                        label: '未启用',
                        color: 'red'
                    }
                }
            }
        }
        return {
            activeType: 1,
            list: [{}],
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
                title: '订阅方',
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
                        label: '启用',
                        type: 'success',
                        style: {
                            display: !row.active && statusFilter(serverTime, row).label !== '已过期' ? 'inline-block' : 'none'
                        },
                        on: {
                            click: () => {
                                this.onOrderStatusClick(row)
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
        onOrderIdClick (row) {},
        onOrderStatusClick (row) {},
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
