<template>
    <div class="gui-tabs">
        <RadioGroup type="button" v-model="currentValue" @on-change="onChange">
            <Radio v-for="item in options" :key="item.value" :label="item.value">{{item.label}}</Radio>
        </RadioGroup>
        <slot></slot>
    </div>
</template>
<script>
import {RadioGroup, Radio} from 'iview'
export default {
    name: 'GTab',
    components: {RadioGroup, Radio},
    props: {
        options: {
            type: Array,
            default: () => []
        },
        value: {
            type: [String, Number]
        }
    },
    data () {
        return {
            currentValue: this.value
        }
    },
    watch: {
        value () {
            this.currentValue = this.value
        }
    },
    methods: {
        onChange (v) {
            this.$emit('input', v)
        }
    }
}
</script>
<style lang="less">
.gui-tabs {
    .ivu-radio-group-button {
        .ivu-radio-wrapper {
            border: none;
            padding: 0px 25px;
            text-align: center;
            border-bottom: 1px solid transparent;
            background-color: transparent;
            &:before, &:after {
                background-color: transparent;
                display: none;
            }
            &:first-child, &:last-child {
                border-radius: 0px;
                border-left: none;
            }
            &.ivu-radio-wrapper-checked {
                border-color: transparent;
                border-bottom-color: #2d8cf0;
                box-shadow: none;
                &:before {
                    background-color: transparent;
                    opacity: 0;
                    display: none;
                }
                &.ivu-radio-focus {
                    box-shadow: none;
                    border-left-color: transparent;
                }
            }
        }
    }
}
</style>
