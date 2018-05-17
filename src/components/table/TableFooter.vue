<template>
    <footer class="table-footer">
        <Page
            class="text-center"
            :total="totalNum"
            :current="currentPage"
            :page-size="pageSize"
            placeholder="top"
            show-total
            @on-change="handleCurrentChange"
        ></Page>
    </footer>
</template>
<script>
export default {
    name: 'table-footer',
    props: {
        totalNum: {
            type: Number,
            default: 0,
            required: true
        },
        pageSize: {
            type: Number,
            default: 20
        },
        currentPage: {
            type: Number,
            default: 1,
            required: true
        }
    },
    methods: {
        handleCurrentChange (v) {
            this.$emit('on-change', v)
        }
    }
}
</script>
<style lang="less">
.table-footer {
    padding: 15px 15px 0;
}
</style>
