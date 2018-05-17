<template>
<div class="gui-page" :class="{'gui-page-bg': bg}">
    <h1 v-show="title">{{title}}</h1>
    <slot></slot>
</div>
</template>
<script>
export default {
    props: {
        title: String,
        bg: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="less">
.gui-page {
    &.gui-page-bg {
        padding: 20px 16px;
        background-color: #fff;
        border-radius: 3px;
        box-shadow: 0px 1px 5px 0 rgba(0,0,0, 0.05);
        min-height: 220px;
    }
}
</style>