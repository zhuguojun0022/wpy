<template>
    <span class="form-label">
        {{label}}
        <Tooltip :placement="placement" transfer>
            <div class="form-label-tip-content" slot="content">
                <slot>{{info}}</slot>
            </div>
            <i class="ivu-icon ivu-icon-information-circled"></i>
        </Tooltip>
    </span>
</template>

<script>
export default {
    name: 'form-label',
    props: {
        label: {
            type: String,
            default: ''
        },
        info: {
            type: String,
            default: ''
        },
        placement: {
            type: String,
            default: 'top'
        }
    }
}
</script>

<style lang="less" scoped>
.form-label {
    .ivu-icon {
        opacity: .5;
        transition: all 0.5s;
        &:hover {
            opacity: 1;
            cursor: pointer;
        }
    }
}
.form-label-tip-content {
        overflow: hidden;
        display: inline-block;
        max-width: 226px;
        word-wrap: break-word;
        word-break: break-all;
        white-space: normal;
        a {
            color: white;
            text-decoration: underline;

            &:hover {
                color: #dddddd;
            }
        }
    }
</style>
