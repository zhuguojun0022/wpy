<template>
<div class="ivu-breadcrumb breadcrumb">
    <span v-for="(data) in breadcrumbData" :key="data.name">
        <a class="ivu-breadcrumb-item-link">
            <i class="iconfont" :class="data.icon"></i>{{data.name}}
        </a>
        <span class="ivu-breadcrumb-item-separator">/</span>
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
<style lang="less" scoped>
.breadcrumb {
    height: 32px;
    line-height: 32px;
    padding: 1px 20px;

    a {
        &:hover {
            color: #495060;
            cursor: default;
        }
    }

    .iconfont {
        margin-right: 5px;
        font-size: 12px;
    }
}
</style>
