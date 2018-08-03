<template>
    <div class="service-group-item p-y">
        <Card>
            <div class="option-area">
                <Button size="small" type="text" class="expend-btn" :loading="loading" @click="onExpandClick" :icon="expendIcon"></Button>
                <Tooltip content="点击 查看/编辑 服务组" placement="top" class="sgi-sg-name-tip">
                    <span class="sgi-sg-name"><a @click="onEditSGClick">{{sgInfo.name}}</a></span>
                </Tooltip>
                <Tooltip content="组路径" placement="top" class="sgi-sg-name-tip">
                    <Tag class="sgi-sg-grouppath m-x" type="border">{{sgInfo.groupPath}}</Tag>
                </Tooltip>
                <Tooltip content="删除" placement="top" class="sgi-sg-name-tip">
                    <Button size="small" type="text" class="delete-sg-btn" @click="onDeleteSGClick" icon="trash-a"></Button>
                </Tooltip>
            </div>
            <collapse-transition>
                <div class="api-area" v-if="condition">
                    <div class="api-option-area p-y">
                        <RadioGroup v-model="removed" type="button" size="small">
                            <Radio :label="1">{{`运行中（${openApiNum}）`}}</Radio>
                            <Radio :label="2">{{`已删除（${closedApiNum}）`}}</Radio>
                        </RadioGroup>
                        <Button size="small" type="primary" class="add-api-btn pull-right" @click="onAddApiClick" icon="plus-round">新增Api</Button>
                    </div>
                    <Table class="api-table" :columns="columns" :data="apiList" size="small"></Table>
                </div>
            </collapse-transition>
        </Card>
        <Modal
            v-model="apiDiaShow"
            :title="apiTitle"
            :closable="false"
            :transfer="false"
            :mask-closable="false">
            <Form :ref="apiFormRef" :model="apiForm" :label-width="100" class="api-from-box" :rules="apiRules">
                <FormItem label="API名称" prop="name">
                    <Input v-model.trim="apiForm.name" type="text" placeholder="请输入API名称" auto-complete="off"></Input>
                </FormItem>
                <FormItem label="前端路径" prop="path">
                    <form-label slot="label" label="前端路径" info="描述"></form-label>
                    <Input v-model.trim="apiForm.path" :maxlength="16" type="text" placeholder="请输入服务组路径" auto-complete="off"></Input>
                </FormItem>
                <FormItem label="后端路径" prop="bgPath">
                    <form-label slot="label" label="后端路径" info="描述"></form-label>
                    <Input v-model.trim="apiForm.bgPath" :maxlength="16" type="text" placeholder="请输入服务组路径" auto-complete="off"></Input>
                </FormItem>
                <FormItem label="请求方式" prop="method">
                    <Select v-model="apiForm.method">
                        <Option v-for="item in methodslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="描述" prop="comments">
                    <Input v-model.trim="apiForm.comments" type="text" placeholder="请输入描述" auto-complete="off"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="onChannelClick(apiFormRef)">取消</Button>
                <Button type="primary" @click="onSubmitClick(apiFormRef)" :loading="diaLoading">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import CollapseTransition from 'iview/src/components/base/collapse-transition'
import FormLabel from '../../components/form/FormLabel'
export default {
    components: {CollapseTransition, FormLabel},
    props: {
        sgInfo: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        const statusFilter = (row) => {
            const map = new Map()
                .set(1, {color: 'blue', label: '新建', option: '上线'})
                .set(2, {color: 'green', label: '已上线', option: '下线'})
                .set(3, {color: 'red', label: '已下线', option: '上线'})
            return map.get(row.lifecycle)
        }
        return {
            loading: false,
            condition: true,
            openApiNum: 0,
            closedApiNum: 0,
            removed: 1,
            apiList: [{
                lifecycle: 1,
                name: 1
            }, {
                lifecycle: 2,
                name: 2
            }, {
                lifecycle: 3,
                name: 3
            }],
            openColumns: [{
                title: 'API名称',
                key: 'name',
                render: (h, {column, index, row}) => {
                    return this.getCellRender(h, [{
                        tag: 'a',
                        label: row.name,
                        type: 'text',
                        class: {'table-api-name': true},
                        on: {
                            click: () => {
                                this.onApiNameClick(row)
                            }
                        }
                    }])
                }
            }, {
                title: '被订阅数',
                key: 'subCount',
                minWidth: 100
            }, {
                title: 'API描述',
                key: 'comments',
                minWidth: 120
            }, {
                title: '状态',
                key: 'active',
                width: 95,
                render: (h, {column, index, row}) => {
                    return this.getCellRender(h, [{
                        label: statusFilter(row).label,
                        color: statusFilter(row).color,
                        tag: 'Tag'
                    }])
                }
            }, {
                title: '操作',
                fixed: 'center',
                render: (h, {column, index, row}) => {
                    return this.getCellRender(h, [{
                        label: statusFilter(row).option,
                        type: 'success',
                        disabled: !row.offline,
                        on: {
                            click: () => {
                                this.onApiStatusClick(row)
                            }
                        }
                    }, {
                        label: '删除',
                        type: 'error',
                        disabled: !row.deletable,
                        on: {
                            click: () => {
                                this.onApiDeleteClick(row)
                            }
                        }
                    }, {
                        label: '复制',
                        type: 'primary',
                        on: {
                            click: () => {
                                this.onApiCopyClick(row)
                            }
                        }
                    }])
                }
            }],
            closedColumns: [{
                title: 'API名称',
                key: 'name',
                render: (h, {column, index, row}) => {
                    return this.getCellRender(h, [{
                        label: row.name,
                        type: 'text',
                        on: {
                            click: () => {
                                this.onApiNameClick(row)
                            }
                        }
                    }])
                }
            }, {
                title: 'API描述',
                key: 'comments',
                minWidth: 120
            }, {
                title: '操作',
                fixed: 'center',
                render: (h, {column, index, row}) => {
                    return this.getCellRender(h, [{
                        label: '复制',
                        type: 'primary',
                        on: {
                            click: () => {
                                this.onApiCopyClick(row)
                            }
                        }
                    }])
                }
            }],
            apiDiaShow: false,
            apiTitle: '新增API',
            apiFormRef: 'addApi',
            apiForm: {
                method: 'GET'
            },
            apiRules: {
                name: [{required: true, trigger: 'blur', message: 'API名称不能为空'}],
                path: [
                    {required: true, trigger: 'blur', message: '前端路径不能为空，请输入'},
                    {pattern: /^\//, trigger: 'blur', message: '前端路径必须以 ‘/’ 开头，请重新输入'},
                    {pattern: /(?<!\/)$/, trigger: 'blur', message: '前端路径不可以 ‘/’ 结尾，请重新输入'},
                    {pattern: /^[^`~!@#$%^&*()+=|{}':;',[\].<>?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+$/, trigger: 'blur', message: '前端路径不可以包含特殊字符，请重新输入'},
                    {pattern: /^[^\u4e00-\u9fa5]+$/, trigger: 'blur', message: '前端路径不可以包含中文字符，请重新输入'}
                ],
                bgPath: [
                    {required: true, trigger: 'blur', message: '后端路径不能为空，请输入'},
                    {pattern: /^\//, trigger: 'blur', message: '后端路径必须以 ‘/’ 开头，请重新输入'},
                    {pattern: /(?<!\/)$/, trigger: 'blur', message: '后端路径不可以 ‘/’ 结尾，请重新输入'},
                    {pattern: /^[^`~!@#$%^&*()+=|{}':;',[\].<>?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+$/, trigger: 'blur', message: '后端路径不可以包含特殊字符，请重新输入'},
                    {pattern: /^[^\u4e00-\u9fa5]+$/, trigger: 'blur', message: '后端路径不可以包含中文字符，请重新输入'}
                ]
            },
            methodslist: [
                {label: 'GET', value: 'GET'},
                {label: 'POST', value: 'POST'},
                {label: 'PUT', value: 'PUT'},
                {label: 'DELETE', value: 'DELETE'}
            ],
            diaLoading: false
        }
    },
    computed: {
        expendIcon () {
            return this.condition ? 'chevron-up' : 'chevron-down'
        },
        columns () {
            return this.removed === 1 ? this.openColumns : this.closedColumns
        }
    },
    methods: {
        /**
         * @description 扩展点击事件
         */
        onExpandClick () {
            this.condition = !this.condition
        },
        /**
         * @description 编辑服务组点击事件
         */
        onEditSGClick () {
            this.$emit('onEditSGClick', this.sgInfo)
        },
        /**
         * @description 删除服务组点击事件
         */
        onDeleteSGClick () {
            this.$emit('onDeleteSGClick', this.sgInfo)
        },
        /**
         * @description API列表 名字点击事件
         */
        onApiNameClick (row) {
            this.$router.push({
                name: 'serviceDetailsBase',
                params: {
                    id: row.id
                }
            })
        },
        /**
         * @description API列表 状态修改点击事件
         */
        onApiStatusClick () {},
        /**
         * @description API列表 删除点击事件
         */
        onApiDeleteClick () {},
        /**
         * @description API列表 复制点击事件
         */
        onApiCopyClick () {},
        /**
         * @description 新增api点击事件
         */
        onAddApiClick () {
            this.apiDiaShow = true
        },
        /**
         * @description api弹出框 取消事件
         */
        onChannelClick (name) {
            console.log(name)
            this.apiDiaShow = false
            this.$refs[name].resetFields()
        },
        /**
         * @description api弹出框 确认事件
         */
        onSubmitClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!')
                } else {
                    this.$Message.error('Fail!')
                }
            })
        }
    }
}
</script>

<style lang="less">
.service-group-item {
    .table-api-name {
        color: #2D8cF0;
        cursor: pointer;
        &:hover {
            color: lighten(#2D8cF0, 20%);
        }
    }
}
</style>
