<template>
    <div class="table-switch">
        <iSwitch size="large" v-model="value" @on-change="handleChange">
            <span slot="open">启用</span>
            <span slot="close">停用</span>
        </iSwitch>
    </div>
</template>
<script>
export default {
    name: 'table-switch',
    props: {
        value: {
            type: Boolean,
            default: true,
            required: true
        }
    },
    methods: {
        handleChange (v) {
            this.$emit('on-change', v)
        }
    }
}
</script>
<style scoped>
</style>
