<template>
<div class="table-footer clearfix">
    <Page :total="total" transfer :current="current"
        :page-size="pageSize" @on-change="onChange"></Page>
</div>
</template>
<script>
export default {
    props: {
        total: 0,
        pageSize: {
            type: Number,
            default: 20
        },
        current: {
            type: Number,
            default: 1
        }
    },
    methods: {
        onChange (v) {
            this.$emit('pageChange', v)
        }
    }
}
</script>
<style lang="less">
.table-footer {
    position: relative;
    padding: 10px 0px;
    text-align: center;
}
</style>
