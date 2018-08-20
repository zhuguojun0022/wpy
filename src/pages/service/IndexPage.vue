<template>
    <GPage class="service-manage-page" bg>
        <!-- tab切换组件 -->
        <GTab :options="options" :value="removed" @input="onChange">
            <Button class="add-sg-btn pull-right" type="primary" @click="onAddSGClick">新增服务组</Button>
        </GTab>
        <!-- 主要内容展示区域 -->
        <section class="main-content p-y">
            <service-group
                v-for="(item, index) in serviceGroupList"
                :key="item.id"
                :index="index"
                :sg-removed="removed"
                :sg-info="item"
                @onEditSGClick="onEditSGClick"
                @onDeleteSGClick="onDeleteSGClick"></service-group>
        </section>
        <!-- 服务组新增、修改dia -->
        <Modal
            v-model="sgDiaShow"
            :title="sgTitle"
            :closable="false"
            :transfer="false"
            :mask-closable="false">
            <Form :ref="sgFormRef" :model="sgForm" :label-width="100" class="sg-from-box" :rules="sgRules">
                <FormItem label="组名称" prop="name">
                    <Input v-model.trim="sgForm.name" :maxlength="16" type="text" placeholder="请输入服务组名称" auto-complete="off"></Input>
                </FormItem>
                <FormItem label="组路径" prop="groupPath">
                    <form-label slot="label" label="组路径" info="组路径用于拼接调用路径，例如：组路径为'/api'，API前端路径为‘/getInfo’，那么最终的调用路径为‘/api/getInfo’"></form-label>
                    <Input v-model.trim="sgForm.groupPath" :maxlength="16" type="text" placeholder="请输入服务组路径" auto-complete="off"></Input>
                    <Alert class="alert-dia" show-icon>组路径请以 ‘/’ 开头， 例如：'/api'</Alert>
                    <Alert class="alert-dia" type="warning" show-icon v-show="sgFormRef === 'sgEdit'">修改服务组的路径，将会影响服务API对外的调用路径，修改请慎重！</Alert>
                </FormItem>
                <!-- <FormItem label="路由类型" prop="routerType">
                    <Select v-model="sgForm.routerType">
                        <Option v-for="item in routerTypeList" :value="item.type" :key="item.type">{{ item.typeName }}</Option>
                    </Select>
                </FormItem> -->
                <FormItem label="路由" prop="router">
                    <Input v-model.trim="sgForm.router" type="text" placeholder="请输入路由" auto-complete="off"></Input>
                    <!-- <Input v-model.trim="sgForm.router" v-show="sgForm.routerType === 1" type="textarea" :autosize="{minRows: 2, maxRows: 6}" placeholder="请输入ip地址" auto-complete="off"></Input> -->
                    <Alert class="alert-dia" show-icon>静态地址输入格式：http://10.0.0.1:8080/rkjs-home</Alert>
                </FormItem>
                <!-- <FormItem label="并发限制" prop="concurrentRequest">
                    <i-switch
                        v-model="sgForm.concurrentRequestJudge"
                        :disabled="sgForm.routerType === 2"
                        size="large"
                        @on-change="switchChangeEvent">
                        <span slot="open">限制</span>
                        <span slot="close">不限</span>
                    </i-switch>
                    <InputNumber v-if="sgForm.concurrentRequestJudge" :precision="0" :min="1" :step="1" size="small" v-model.trim="sgForm.concurrentRequest"></InputNumber>
                </FormItem> -->
            </Form>
            <div slot="footer">
                <Button type="text" @click="onChannelClick(sgFormRef)">取消</Button>
                <Button type="primary" @click="onSubmitClick(sgFormRef)" :loading="diaLoading">确认</Button>
            </div>
        </Modal>
    </GPage>
</template>

<script>
import GTab from '../../components/GTab'
import FormLabel from '../../components/form/FormLabel'
import ServiceGroup from './ServiceGroup'
import { mapMutations } from 'vuex'
import {serviceApi} from '../../apis'
export default {
    components: {
        GTab,
        FormLabel,
        ServiceGroup
    },
    data () {
        let routerRule = (rule, value, callback) => {
            // const ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]):([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
            const url = /[a-zA-Z]+:\/\/[^\s]*/
            // let routerType = this.sgForm.routerType
            if (!value) {
                callback(new Error('路由不可为空，请输入'))
            } else {
                // if (routerType === 1) {
                //     value = value.split('\n')
                //     value.forEach((elem, index) => {
                //         if (!ip.test(elem)) {
                //             callback(new Error(`您输入的第 ${index + 1} 个IP地址有误，请重新输入`))
                //         } else if (index + 1 === value.length && ip.test(elem)) {
                //             callback()
                //         }
                //     })
                // } else if (routerType === 2) {
                //     if ((!url.test(value))) {
                //         callback(new Error('路由格式不正确，请重新输入'))
                //     } else {
                //         callback()
                //     }
                // }
                if ((!url.test(value))) {
                    callback(new Error('路由格式不正确，请重新输入'))
                } else {
                    callback()
                }
            }
        }
        return {
            removed: 1,
            closeNum: 0,
            sgDiaShow: false,
            sgTitle: '新增服务组',
            sgFormRef: 'sgAdd',
            diaLoading: false,
            sgForm: {
                id: '',
                name: '',
                groupPath: '',
                // routerType: 1,
                router: ''
                // concurrentRequestJudge: false,
                // concurrentRequest: -1
            },
            sgRules: {
                name: [{required: true, trigger: 'blur', message: '服务组名称不能为空'}],
                groupPath: [
                    {required: true, trigger: 'blur', message: '组路径不能为空，请输入'},
                    {pattern: /^\//, trigger: 'blur', message: '组路径必须以 ‘/’ 开头，请重新输入'},
                    {pattern: /(?<!\/)$/, trigger: 'blur', message: '组路径不可以 ‘/’ 结尾，请重新输入'},
                    {pattern: /^[^`~!@#$%^&*()+=|{}':;',[\].<>?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+$/, trigger: 'blur', message: '组路径不可以包含特殊字符，请重新输入'},
                    {pattern: /^[^\u4e00-\u9fa5]+$/, trigger: 'blur', message: '组路径不可以包含中文字符，请重新输入'}
                ],
                router: [{required: true, trigger: 'blur', validator: routerRule}]
            },
            // routerTypeList: [{
            //     type: 1,
            //     typeName: '地址列表'
            // }, {
            //     type: 2,
            //     typeName: '静态路径'
            // }],
            serviceGroupList: []
        }
    },
    computed: {
        options () {
            return [{
                label: '所有组',
                value: 1
            }, {
                label: `已删除组(${this.closeNum})`,
                value: 2
            }]
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '服务管理',
                icon: 'icon-fuwuguanli'
            })
        })
    },
    created () {
        this.getSGListInterface()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onChange (val) {
            this.removed = val
            this.getSGListInterface()
        },
        onAddSGClick () {
            this.sgDiaShow = true
        },
        // switchChangeEvent (val) {
        //     if (val) {
        //         this.sgForm.concurrentRequest = 10
        //     } else {
        //         this.sgForm.concurrentRequest = -1
        //     }
        // },
        onEditSGClick (sgInfo) {
            // let router = (sgInfo.router && sgInfo.routerType === 1) ? sgInfo.router.split(',').join('\n') : sgInfo.router
            this.sgTitle = '编辑服务组'
            this.sgFormRef = 'sgEdit'
            this.sgForm = {
                ...sgInfo,
                concurrentRequestJudge: sgInfo.concurrentRequest !== -1
            }
            this.sgDiaShow = true
        },
        onDeleteSGClick (sgInfo) {
            this.$Modal.confirm({
                title: '提示',
                content: `您将删除服务组： ${sgInfo.name}，是否确认删除？`,
                cancelText: '取消',
                loading: true,
                onOk: () => {
                    serviceApi.deleteServiceGroup(sgInfo.id).then(({data: {msg, result, resultCode}}) => {
                        this.$Modal.remove()
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                            // 处理逻辑
                            this.getSGListInterface()
                        } else {
                            this.$Message.warning(msg)
                        }
                    }).catch(() => {
                        this.$Modal.remove()
                        this.$Message.error('删除失败，请重试')
                    })
                }
            })
        },
        onChannelClick (name) {
            console.log(name)
            this.sgDiaShow = false
            this.$refs[name].resetFields()
        },
        onSubmitClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.diaLoading = true
                    // let router = this.sgForm.routerType === 1 ? this.sgForm.router.split('\n').join(',') : this.sgForm.router
                    let params = {
                        ...this.sgForm
                    }
                    if (name === 'sgAdd') {
                        this.addSGInterface(params, name)
                    } else {
                        this.editSGInterface(params, name)
                    }
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        getSGListInterface () {
            serviceApi.getOpenServiceGroupList(this.removed).then(({data: {msg, result, resultCode}}) => {
                this.serviceGroupList = result
            })
            if (this.removed === 1) {
                serviceApi.getClosedServiceGroupNum(this.removed).then(({data: {msg, result, resultCode}}) => {
                    this.closeNum = result
                })
            }
        },
        addSGInterface (param, name) {
            this.diaLoading = true
            serviceApi.addServiceGroup(param).then(({data: {msg, result, resultCode}}) => {
                this.diaLoading = false
                if (resultCode === '000000') {
                    this.onChannelClick(name)
                    this.getSGListInterface()
                    this.$Message.success({
                        content: msg
                    })
                } else {
                    this.$Message.warning({
                        content: msg
                    })
                }
            }).catch(() => {
                this.diaLoading = false
            })
        },
        editSGInterface (param, name) {
            this.diaLoading = true
            serviceApi.updateServiceGroup(param).then(({data: {msg, result, resultCode}}) => {
                this.diaLoading = false
                if (resultCode === '000000') {
                    this.onChannelClick(name)
                    this.getSGListInterface()
                    this.$Message.success({
                        content: msg
                    })
                } else {
                    this.$Message.warning({
                        content: msg
                    })
                }
            }).catch(() => {
                this.diaLoading = false
            })
        }
    }
}
</script>

<style lang="less">
.service-manage-page {
    .alert-dia {
        margin-bottom: 0;
        margin-top: 5px;
    }
}
</style>
