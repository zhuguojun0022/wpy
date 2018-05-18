<template>
    <GPage bg>
        <Button type="primary" @click="onCreateNewMenuNode">新建菜单</Button>
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
                        <FormItem prop="title" label="菜单标题" required>
                            <Input v-model.trim="menuItems.title" placeholder="请输入标题名称"></Input>
                        </FormItem>
                        <FormItem prop="menuCode" label="菜单编码" required>
                            <Input v-model.trim="menuItems.menuCode" :disabled="true" placeholder="菜单编码"></Input>
                        </FormItem>
                        <FormItem prop="menuPid" label="所属父级菜单" required>
                            <Select v-model="menuItems.menuPid">
                                <Option v-for="item in selectNodeParentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="menuIcon" label="菜单图标" required>
                            <Input v-model.trim="menuItems.menuIcon" placeholder="请输入图标类名"></Input>
                        </FormItem>
                        <FormItem prop="menuIndex" label="菜单序号" required>
                            <Input v-model.trim="menuItems.menuIndex" placeholder="请输入菜单序号"></Input>
                        </FormItem>
                        <FormItem prop="routeName" label="路由名称" required>
                            <Input v-model.trim="menuItems.routeName" placeholder="请输入菜单路由"></Input>
                        </FormItem>
                        <FormItem prop="menuDescription" label="菜单描述" required>
                            <Input v-model.trim="menuItems.menuDescription" type="textarea" placeholder="请输入描述信息"></Input>
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
            formRef: 'editform',
            ruleValidate: {},
            modal_loading: false
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: to.name,
                icon: 'home'
            })
        })
    },
    created () {
        systemApi.searchMenuList().then(({data: {result, code, msg}}) => {
            this.menuList = this.dataFilter(result)
        })
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onCreateNewMenuNode () {
            this.$refs[name].resetFields()
        },
        onSelectChange (data) {
            this.menuItems = {...data[0]}
        },
        dataFilter (list) {
            let tree = []
            list.forEach(p => {
                if (p.leaf) {
                    tree.push({
                        ...p,
                        title: p.menuName,
                        expand: false
                    })
                } else {
                    let child = []
                    p.subMenu.forEach(c => {
                        child.push({
                            ...c,
                            title: c.menuName
                        })
                    })
                    tree.push({
                        ...p,
                        title: p.menuName,
                        children: [...child],
                        expand: true
                    })
                }
            })
            return tree
        },
        onCancelClick (name) {
            this.$refs[name].resetFields()
        },
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
<style lang="less" scoped>
.col {
    >div {
        border: 1px solid #eeeeee;
        padding: 20px;
    }
}
</style>
