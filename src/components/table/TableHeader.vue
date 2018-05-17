<template>
<div class="table-header clearfix">
    <div class="left pull-left">
        <slot name="left"></slot>
    </div>
    <div class="right pull-right">
        <slot name="right"></slot>
    </div>
</div>
</template>
<script>
export default {
    name: 'table-header',
    props: {},
    computed: {},
    methods: {}
}
</script>
<style lang="less" scoped>
.table-header {
    padding-bottom: 15px;

    .left {
        button, div {
            margin-right: 10px;
        }
    }
    .right {
        button, div {
            margin-left: 10px;
        }
    }
}
</style>