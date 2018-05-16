<template>
<Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
    <MenuItem name="1-1">
        <Icon type="ios-navigate"></Icon>
        <span>Option 1</span>
    </MenuItem>
    <MenuItem name="1-2">
        <Icon type="search"></Icon>
        <span>Option 2</span>
    </MenuItem>
    <MenuItem name="1-3">
        <Icon type="settings"></Icon>
        <span>Option 3</span>
    </MenuItem>
</Menu>
</template>
<script>
export default {
    props: {
        menuitemClasses: {
            type: Array
        }
    }
}
</script>
<style lang="less">
.menu {}
</style>
