<template>
    <GPage bg>
        <Button type="primary" @click="onCreateNewMenuNode(formRef)">新建菜单</Button>
        <Row :gutter="16" class="p-y-t">
            <Col class="col" span="8">
                <div>
                    <Tree :data="menuList" @on-select-change="onSelectChange"></Tree>
                </div>
            </Col>
            <Col class="col" span="16">
                <div>
                    <p>菜单信息维护</p>
                    <Form style="width: 80%" :model="menuItems" :label-width="120" :rules="ruleValidate" :ref="formRef" class="new-user-form">
                        <FormItem prop="menuTitle" label="菜单标题" required>
                            <Input v-model.trim="menuItems.menuTitle" placeholder="请输入标题名称"></Input>
                        </FormItem>
                        <FormItem prop="menuPid" label="所属父级菜单" required>
                            <Select v-model="menuItems.menuPid" :disabled="disabled">
                                <Option v-for="item in selectNodeParentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="menuIcon" label="菜单图标">
                            <Input v-model.trim="menuItems.menuIcon" placeholder="请输入图标类名"></Input>
                        </FormItem>
                        <FormItem prop="menuOrder" label="菜单序号" required>
                            <Input v-model.trim="menuItems.menuOrder" :number="true" placeholder="请输入菜单序号"></Input>
                        </FormItem>
                        <FormItem prop="menuRouter" label="路由名称" :required="required">
                            <Input v-model.trim="menuItems.menuRouter" placeholder="请输入菜单路由"></Input>
                        </FormItem>
                        <FormItem prop="menuRemark" label="菜单描述" required>
                            <Input v-model.trim="menuItems.menuRemark" type="textarea" placeholder="请输入描述信息"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="ghost" @click="onCancelClick(formRef)">取消</Button>
                            <Button type="primary" :loading="modal_loading" @click="onSubmitClick(formRef)">提交</Button>
                        </FormItem>
                    </Form>
                </div>
            </Col>
        </Row>
    </GPage>
</template>
<script>
import {systemApi} from '../../../apis/'
import {mapMutations} from 'vuex'

export default {
    data () {
        return {
            menuList: [],
            menuItems: {},
            selectNodeParentList: [],
            formRef: 'newform',
            ruleValidate: {},
            modal_loading: false,
            disabled: false,
            required: true
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '菜单管理',
                icon: 'icon-xitongguanli'
            })
        })
    },
    created () {
        this.searchMenuList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        onCreateNewMenuNode (name) {
            this.$refs[name].resetFields()
            this.disabled = false
            this.menuItems = {
                menuId: '',
                menuTitle: '',
                menuRouter: '',
                menuRemark: '',
                menuIcon: '',
                menuOrder: '',
                menuPid: ''
            }
            this.formRef = 'newform'
        },
        onSelectChange (data) {
            this.menuItems = {...data[0]}
            if (this.menuItems.menuPid === 0) {
                this.disabled = true
                this.required = false
            } else {
                this.disabled = false
                this.required = true
            }
            this.formRef = 'editform'
        },
        dataFilter (list) {
            let tree = []
            list.forEach(p => {
                if (p.children.length === 0) {
                    tree.push({
                        ...p,
                        title: p.menuTitle,
                        expand: false
                    })
                } else {
                    let child = []
                    p.children.forEach(c => {
                        child.push({
                            ...c,
                            title: c.menuTitle
                        })
                    })
                    tree.push({
                        ...p,
                        title: p.menuTitle,
                        children: [...child],
                        expand: true
                    })
                }
            })
            return tree
        },
        nodeListOption (val) {
            let node = []
            node.push({
                value: 0,
                label: '根菜单'
            })
            val.children.forEach(e => {
                node.push({
                    value: e.menuId,
                    label: e.menuTitle
                })
            })
            return node
        },
        onCancelClick (name) {
            this.$refs[name].resetFields()
            this.formRef = 'newform'
        },
        onSubmitClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.modal_loading = true
                    let {menuId, menuTitle, menuRouter, menuRemark, menuIcon, menuOrder, menuPid} = {...this.menuItems}
                    if (name === 'editform') {
                        systemApi.updateMenuTree(
                            menuId,
                            menuTitle,
                            menuRouter,
                            menuRemark,
                            menuIcon,
                            menuOrder,
                            menuPid
                        ).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.searchMenuList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }).catch(() => {
                            this.modal_loading = false
                        })
                    } else {
                        systemApi.addMenu(
                            menuTitle,
                            menuRouter,
                            menuRemark,
                            menuIcon,
                            menuOrder,
                            menuPid
                        ).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.searchMenuList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }).catch(() => {
                            this.modal_loading = false
                        })
                    }
                } else {
                    this.$Message.error('数据格式校验失败')
                }
            })
        },
        searchMenuList () {
            this.openLoading()
            systemApi.getMenuTree().then(({data: {result, resultCode, msg}}) => {
                this.closeLoading()
                if (resultCode === '000000') {
                    this.menuList = this.dataFilter(result.children)
                    this.selectNodeParentList = this.nodeListOption(result)
                } else {
                    this.$Message.error(msg)
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.col {
    >div {
        border: 1px solid #eeeeee;
        padding: 20px;
    }
}
</style>
