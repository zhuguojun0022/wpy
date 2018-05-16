<template>
<div class="gui-base-table">
    <Table :columns="tableColumns" :data="data"
        @on-selection-change="onSelectedChange" @on-row-dblclick="onRowDbClick"></Table>
    <TableFooter v-if="needFooter" :pageSize="pageSize" :total="total" @pageChange="onPageChange" :current="currentPage"></TableFooter>
</div>
</template>
<script>
import TableFooter from './TableFooter'
import {Table} from 'iview'
export default {
    components: {
        TableFooter, Table
    },
    props: {
        columns: {
            type: Array,
            default: () => []
        },
        pageSize: {
            type: Number,
            default: () => 10
        },
        apiFunction: {
            type: Function,
            default: () => null
        },
        query: {
            type: Object,
            default: () => {
                return {}
            }
        },
        selection: {
            type: Boolean,
            default: () => false
        },
        selectedRows: {
            type: Array,
            default: () => []
        },
        needFooter: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            total: 0,
            currentPage: 1,
            data: []
        }
    },
    computed: {
        tableColumns () {
            const tmpColumns = [...this.columns]
            if (this.selection) {
                tmpColumns.unshift({
                    type: 'selection',
                    width: 60,
                    align: 'center'
                })
            }
            return tmpColumns
        }
    },
    mounted () {
        this.loadData()
    },
    methods: {
        loadData () {
            if (!this.apiFunction) {
                return
            }
            this.apiFunction(this.query, {
                size: this.pageSize || 10,
                current: this.currentPage || 1
            }).then(({data}) => {
                this.data = data.result.records
                this.total = data.result.total
            })
        },
        onPageChange (page) {
            this.currentPage = page
            this.loadData()
        },
        onSelectedChange (rows) {
            if (this.selectedRows && this.selectedRows.length) {
                this.selectedRows.splice(0, this.selectedRows.length)
            }
            if (rows.length && this.selectedRows) {
                this.selectedRows.push.apply(this.selectedRows, rows)
            }
            this.$emit('on-selected-change', rows)
        },
        onRowDbClick (row, index) {
            this.$emit('on-row-dblclick', row, index)
        }
    }
}
</script>