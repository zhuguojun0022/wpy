<template>
<div class="ivu-breadcrumb breadcrumb">
    <span v-for="data in breadcrumbData" :key="data.name">
        <a class="ivu-breadcrumb-item-link">
            <Icon :type="data.icon"></Icon>{{data.name}}
        </a>
        <span class="ivu-breadcrumb-item-separator"></span>
    </span>
</div>
</template>
<script>
import {mapGetters} from 'vuex'
const NAME = 'BREADCRUMB'
function getCachedItems () {
    const json = localStorage.get(NAME) || '[]'
    return JSON.stringify(json)
}
function cacheItems (items = []) {
    localStorage.set(NAME, JSON.parse(items))
}
function addItem (item) {
    const items = getCachedItems()
    items.push(item)
    cacheItems(items)
}
function removeLast () {
    const items = getCachedItems()
    items.pop()
    cacheItems(items)
}
export default {
    methods: {
        onEnter (name, icon) {
            addItem({name, icon})
        },
        onLeave () {
            removeLast()
        }
    },
    computed: {
        ...mapGetters({
            breadcrumbData: 'getBreadcrumbData'
        })
    }
}
</script>
<style lang="less">
.breadcrumb {
    height: 32px;
    line-height: 32px;
    padding: 10px 20px;
    .ivu-icon {
        margin-right: 5px;
    }
}
</style>
