<template>
<div class="table-bar">
    <h4 class="title">{{title}}</h4>
    <div class="tools clearfix">
        <Tooltip content="刷新" @click.native="onRefresh" placement="top" class="pull-left top">
            <Button class="btn-refresh" type="ghost" icon="refresh"></Button>
        </Tooltip>
        <div class="pull-right top">
            <Button icon="plus-round" v-show="primaryBtnShow" type="primary" @click.native="onClickPrimaryBtn">{{primaryBtnLabel}}</Button>
            <Dropdown v-if="showMoreMenus">
                <Button icon="navicon-round" class="btn-more"></Button>
                <slot name="operations" slot="list"></slot>
            </Dropdown>
        </div>
        <div class="searchs">
            <slot name="searchs"></slot>
        </div>
    </div>
</div>
</template>
<script>
export default {
    props: {
        title: null,
        primaryBtnLabel: {
            default: '添加',
            type: String
        },
        primaryBtnShow: {
            type: Boolean,
            default: true
        },
        refTable: Object
    },
    computed: {
        showMoreMenus () {
            return this.$slots.operations
        }
    },
    methods: {
        onClickPrimaryBtn () {
            this.$emit('onClickPrimaryBtn')
        },
        onRefresh () {
            if (this.refTable) {
                this.refTable.loadData()
            }
            this.$emit('onRefresh')
        }
    }
}
</script>
<style lang="less">
.table-bar {
    padding: 10px 0px;

    .title {
        font-size: 18px;
        font-weight: 500;
    }

    .tools {
        margin-top: 10px;
        position: relative;

        > .top {
            z-index: 100;
        }

        .btn-refresh, .btn-more{
            .ivu-icon {
                margin-right: 0px;
            }
        }
        .searchs {
            display: inline-block;
            position: absolute;
            left: 52px;
            right: 126px;
        }
    }
}
</style>