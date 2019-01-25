<template>
    <GPage bg>
        <div class="bgwhite">
               <table-header>
        <template slot="left">
                <Select  style="width: 170px" placeholder="平安人寿保险股份有限公司" clearable>
                    <!-- <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId">{{ item.roleName }}</Option> -->
                </Select>
                <Button type="primary" @click="onCreateNewMenuNode(formRef)"><Icon type="plus"></Icon> 新建菜单</Button>
        </template>
    </table-header>
        <Row :gutter="16" class="p-y-t">
            <Col class="col" span="6">
            <p>机构列表</p>
                <div>
                    <Tree :data="menuList" @on-select-change="onSelectChange"></Tree>
                </div>
            </Col>
            <Col class="col" span="18">
                <div>
                    <p>菜单管理 — 修改</p>
                    <Form style="width: 80%" :model="menuItems" :label-width="120" :rules="ruleValidate" :ref="formRef" class="new-user-form">
                        <FormItem prop="menuTitle" label="菜单标题" required>
                            <Input v-model.trim="menuItems.menuTitle" placeholder="请输入标题名称"></Input>
                        </FormItem>
                        <FormItem prop="menuPid" label="所属父级菜单">
                            <Select v-model="menuItems.menuPid" :disabled="disabled">
                                <Option v-for="item in selectNodeParentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="menuIcon" label="菜单图标" required>
                            <Input v-model.trim="menuItems.menuIcon" placeholder="请输入图标类名"></Input>
                        </FormItem>
                        <FormItem prop="menuOrder" label="菜单序号">
                            <Input v-model="menuItems.menuOrder" :number="true" placeholder="请输入菜单序号"></Input>
                        </FormItem>
                        <FormItem prop="menuRouter" label="路由名称" required>
                            <Input v-model.trim="menuItems.menuRouter" placeholder="请输入菜单路由"></Input>
                        </FormItem>
                        <FormItem prop="menuRemark" label="菜单描述">
                            <Input v-model.trim="menuItems.menuRemark" type="textarea" placeholder="请输入描述信息"></Input>
                        </FormItem>
                        <FormItem>
                            <Button class="Reset" @click="onCancelClick(formRef)">取消</Button>
                            <Button type="primary" :loading="modal_loading" @click="onSubmitClick(formRef)">提交</Button>
                        </FormItem>
                    </Form>
                </div>
            </Col>
        </Row>
        </div>
    </GPage>
</template>
<script>
import {systemApi} from '../../../apis/'
import {mapMutations} from 'vuex'
import {TableHeader} from '../../../components/table'
export default {
    components: {TableHeader},
    name: 'menuManage',
    data () {
        return {
            menuList: [],
            menuItems: {},
            selectNodeParentList: [],
            formRef: 'newform',
            ruleValidate: {
                menuTitle: [
                    {required: true, message: '必填项', trigger: 'blur'},
                    {max: 16, message: '长度不能超过16位', trigger: 'blur'},
                    {pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/, message: '不能包含特殊字符', trigger: 'blur'}
                ],
                menuPid: [
                    {required: true, type: 'number', message: '必选项', trigger: 'blur'}
                ],
                menuOrder: [
                    {required: true, type: 'number', message: '必填项,且为数字', trigger: 'blur'}
                ],
                menuIcon: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ],
                menuRouter: [
                    {required: true, message: '必填项', trigger: 'blur'}
                ]
            },
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
                        expand: false
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
        // border: 1px solid #eeeeee;
        padding: 10px;
    }
}
p {font-weight: 700;padding: 10px;}
.bgwhite{
    background: white;
    padding: 20px 15px 0px;
    z-index: 10;
    font-size: 14px;
}
Form {
    padding: 10px;

    FormItem {
        width: 100%;
    }
}
</style>
