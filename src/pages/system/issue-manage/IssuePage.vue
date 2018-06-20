<template>
<GPage bg>
    <table-header>
        <template slot="right">
            <Input v-model="regionName" placeholder="医保行政区划代码/名称" style="width: 200px" clearable></Input>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>

    <Table :columns="columns" :data="tableData" no-data-text="暂无数据"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

    <Modal v-model="diaShow" :mask-closable="false" :closable="false" class-name="vertical-center-modal" :title="diaTitle" ref="modal">
        <Form :model="newUser" :label-width="150"  :ref="formRef" class="new-user-form">
            <FormItem  label="医保行政区划代码" >
                <Input v-model.trim="newUser.regionNo" placeholder="请输入医保行政区划代码"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="onCancelClick(formRef)">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitClick(formRef)">提交</Button>
        </div>
    </Modal>
</GPage>
</template>
<script>
import {TableHeader, TableFooter} from '../../../components/table'
import {systemApi} from '../../../apis/'
import {mapMutations} from 'vuex'

export default {
    components: {TableHeader, TableFooter},
    data () {
        return {
            regionName: '',
            cardAuth: false,
            noCardAuth: false,
            columns: [
                {type: 'index', title: '序号', align: 'center'},
                {title: '医保行政区划代码', key: 'regionNo', align: 'center'},
                {title: '医保行政区划名称', key: 'regionName', align: 'center'},
                {title: '授权状态', key: 'nopswAmountLimit', align: 'center'},
                {
                    title: '已授权渠道',
                    key: 'cardAuth',
                    align: 'center',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            tag: 'span',
                            label: row.cardAuth === 1 ? '是' : '否'
                        }])
                    }
                }
            ],
            tableData: [],
            pageSize: 20,
            totalNum: 0,
            currentPage: 1,
            diaShow: false,
            diaTitle: '添加授权渠道',
            modal_loading: false,
            formRef: 'adduser',
            newUser: {}
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '签发授权管理',
                icon: 'icon-xitongguanli'
            })
        })
    },
    created () {
        this.searchRegionList()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        // 删除数据
        onDeleteClick (row) {
            this.$Modal.confirm({
                title: '删除信息确认',
                content: `您是否确认删除选中的此条数据？`,
                closable: false,
                loading: true,
                onOk: () => {
                    // TODO 刷新数据
                    systemApi.deleteRegionInfo(row.regionId).then(({data: {result, resultCode, msg}}) => {
                        this.$Modal.remove()
                        if (resultCode === '000000') {
                            this.$Message.success(msg)
                            this.searchRegionList()
                        } else {
                            this.$Message.error(msg)
                        }
                    }).catch(() => {
                        this.$Modal.remove()
                    })
                },
                onCancel: () => {
                }
            })
        },
        // 查询数据
        onSearchClick () {
            this.searchRegionList()
        },
        // 页数查询
        handleCurrentChange (v) {
            this.currentPage = v
            this.searchRegionList()
        },
        // 编辑数据
        onEditClick (row) {
            this.formRef = 'edituser'
            this.cardAuth = row.cardAuth === 1
            this.noCardAuth = row.noCardAuth === 1
            this.newUser = {...row}
            this.newUser.nopswAmountLimit = String(this.newUser.nopswAmountLimit)
            this.diaTitle = '修改医保行政区划'
            this.diaShow = true
        },
        // 弹出框-取消
        onCancelClick (name) {
            this.$refs[name].resetFields()
            this.diaShow = false
            this.diaTitle = '新增医保行政区划'
            this.formRef = 'adduser'
        },
        // 新增或编辑后提交数据
        onSubmitClick (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let {regionId, regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg} = {
                        ...this.newUser
                    }
                    console.log(this.newUser)
                    this.modal_loading = true
                    if (name === 'adduser') {
                        systemApi.addRegionInfo(regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.onCancelClick(name)
                                this.currentPage = 1
                                this.searchRegionList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }).catch(() => {
                            this.modal_loading = false
                        })
                    } else {
                        systemApi.updateRegionInfo(regionId, regionNo, regionName, nopswAmountLimit, messageTips, cardAuth, noCardAuth, faceMsg).then(({data: {result, resultCode, msg}}) => {
                            this.modal_loading = false
                            if (resultCode === '000000') {
                                this.$Message.success(msg)
                                this.onCancelClick(name)
                                this.searchRegionList()
                            } else {
                                this.$Message.error(msg)
                            }
                        }).catch(() => {
                            this.modal_loading = false
                        })
                    }
                } else {
                    this.$Message.error('校验失败!')
                }
            })
        },
        // 获取数据
        searchRegionList () {
            this.openLoading()
            systemApi.searchRegionList(
                this.pageSize,
                this.currentPage,
                this.regionName
            ).then(({data: {result, resultCode, msg}}) => {
                this.closeLoading()
                if (resultCode === '000000') {
                    this.tableData = result.list
                    this.totalNum = result.total
                } else {
                    this.$Message.error(msg)
                }
            }).catch(() => {
                this.closeLoading()
            })
        }
    }
}
</script>
<style lang="less">
.new-user-form {
    margin-right: 40px;
}
.vertical-center-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal{
        top: 0;
    }
}
</style>
