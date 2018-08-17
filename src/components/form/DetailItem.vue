<template>
    <div class="can-edit-detail">
        <label class="diec-fixed-desc">{{ label }} :</label>
        <div class="detail-info-val" v-show="!isEdit">
            <slot name="displayValue"></slot>
        </div>
        <div class="edit-area" v-show="isEdit">
            <slot name="editOption"></slot>
        </div>
        <span v-show="isEdit">
            <Button class="submit-btn" size="small" type="primary" @click="submit">保存</Button>
            <Button class="cancel-btn" size="small" type="default" @click="cancel">取消</Button>
        </span>
        <Button type="ghost" size="small" v-if="isCanEdit" v-show="!isEdit" class="edit-btn" icon="edit" @click="edit"></Button>
    </div>
</template>
<script>
export default {
    name: 'detail-item-edit',
    props: {
        label: {
            type: String,
            default: ''
        },
        valueObject: {
            type: Object,
            require: true
        },
        valueFields: {
            type: Array,
            require: true
        },
        paramKey: {
            type: String,
            default: ''
        },
        isCanEdit: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            isEdit: false,
            originalValue: {}
        }
    },
    methods: {
        edit () {
            this.isEdit = true
            this.valueFields.forEach(el => {
                this.originalValue[el] = this.valueObject[el]
            })
            this.$emit('edit', this.paramKey)
        },
        cancel () {
            this.isEdit = false
            this.valueFields.forEach(el => {
                this.valueObject[el] = this.originalValue[el]
            })
            this.$emit('cancel', this.paramKey)
        },
        submit () {
            this.$emit('submit', {
                key: this.paramKey,
                valueFields: this.valueFields,
                onSuccess: () => {
                    this.isEdit = false
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.can-edit-detail {
    padding: 10px;

    &:hover {
        .edit-btn {
            opacity: 1;
        }
    }

    label {
        display: inline-block;
    }

    .diec-fixed-desc {
        font-weight: 600;
        font-size: 14px;
        min-width: 120px;
        text-align: right;
    }

    .detail-info-val {
        font-weight: normal;
        padding-left: 20px;
        display: inline-block;
        vertical-align: middle;
    }
    .edit-area {
        display: inline-block;
        padding-left: 20px;
        vertical-align: middle;
    }
    .edit-btn {
        border: none;
        opacity: 0.1;
    }
}
</style>