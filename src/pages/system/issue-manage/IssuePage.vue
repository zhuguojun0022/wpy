<template>
<GPage bg>
    <table-header>
        <template slot="right">
            <Input v-model="region" placeholder="医保行政区划代码/名称" style="width: 200px" clearable></Input>
            <Button type="primary" @click="onSearchClick">查询</Button>
        </template>
    </table-header>

    <Table :columns="columns" :data="tableData" no-data-text="暂无数据"></Table>

    <table-footer :total-num="totalNum" :current-page="currentPage" @on-change="handleCurrentChange"></table-footer>

    <Modal v-model="diaShow" :mask-closable="false" :closable="false" class-name="vertical-center-modal" :title="diaTitle" ref="modal">
        <Form  :label-width="100"  class="new-channel-form">
            <FormItem prop="regionIdList" label="渠道名称" required>
                <div style="position:relative">
                    <Select v-model="channelList" :multiple="true" :filterable="true" :remote="true"
                    :remote-method="searchchannelList" :loading="channelLoading" placeholder="请输入渠道名称">
                        <Option v-for="item in channelName" :value="item.channelId+'$r$'+item.AAZ570" :key="item.AAZ570">{{item.AAZ571}}</Option>
                    </Select>
                    <Tooltip :content="channelHint" style="position:absolute; left:370px; top:2px" placement="top">
                        <Icon type="information-circled" ></Icon>
                    </Tooltip>
                </div>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="ghost" @click="onCancelClick()">取消</Button>
            <Button type="primary" :loading="modal_loading" @click="onSubmitClick()">提交</Button>
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
            region: '',
            columns: [
                {type: 'index', title: '序号', align: 'center', width: 60},
                {title: '医保行政区划代码', key: 'regionNo', align: 'center', width: 150},
                {title: '医保行政区划名称', key: 'regionName', align: 'center', width: 150},
                {
                    title: '授权状态',
                    key: 'status',
                    width: 120,
                    render: (h, {row}) => {
                        return h('iSwitch', {
                            props: {
                                trueValue: 1,
                                falseValue: 0,
                                value: row.regionStatus,
                                size: 'large'
                            },
                            on: {
                                'on-change': (val) => {
                                    this.onStatusChange(row, val)
                                }
                            }
                        }, [
                            h('span', {
                                slot: 'open'
                            }, '开'),
                            h('span', {
                                slot: 'close'
                            }, '关')
                        ])
                    }
                },
                {
                    title: '已授权渠道',
                    key: 'roles',
                    render: (h, {column, index, row}) => {
                        return h('div', [
                            h('div', row.regionChannel.map(item => {
                                return h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.onDeleteClick(row, item)
                                        }
                                    }
                                }, item.aaz571 + '　×')
                            }).concat([
                                h('Button', {
                                    props: {
                                        type: 'dashed',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addChannel(row)
                                        }
                                    }
                                }, '＋ 添加授权渠道')
                            ]))
                        ])
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
            issueInfo: {},
            channelLoading: false,
            channelList: [],
            channelName: [],
            channelHint: '输入名称进行模糊检索'
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
        onDeleteClick (row, item) {
            this.$Modal.confirm({
                title: '删除信息确认',
                content: `您是否确认删除选中的此条数据？`,
                closable: false,
                loading: true,
                onOk: () => {
                    // TODO 刷新数据
                    systemApi.deleteIssueInfo(row.regionId, item.channelId).then(({data: {result, resultCode, msg}}) => {
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
        // 弹出框-取消
        onCancelClick () {
            this.channelList = []
            this.diaShow = false
        },
        // 更改授权状态
        onStatusChange (row, val) {
            let {regionId, regionNo} = {...row}
            let authStatus = val
            systemApi.changeIssueInfo(regionId, regionNo, authStatus).then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    this.$Message.success(msg)
                } else {
                    this.$Message.error(msg)
                    this.$nextTick(() => {
                        row.regionStatus = val ? 0 : 1
                    })
                }
            }).catch(() => {
                this.$Modal.remove()
                this.$nextTick(() => {
                    row.regionStatus = val ? 0 : 1
                })
            })
        },
        // 添加授权渠道
        addChannel (row) {
            this.diaShow = true
            this.issueInfo = row
        },
        // 模糊搜索渠道名称
        searchchannelList (query) {
            if (query !== '') {
                this.channelLoading = true
                systemApi.searchchannelList(query).then(({data: {result, resultCode, msg}}) => {
                    if (resultCode === '000000') {
                        this.channelLoading = false
                        this.channelName = result
                    } else {
                        this.channelLoading = false
                        this.$Message.error(msg)
                    }
                })
            } else {
                this.channelName = []
            }
        },
        // 新增授权渠道
        onSubmitClick () {
            if (this.channelList.length < 1) {
                this.$Message.error('请至少选择一个授权渠道')
                return
            }
            let {regionId, regionNo} = {...this.issueInfo}
            let channelList = this.channelList.map(el => {
                let arr = el.split('$r$')
                return {
                    regionId: regionId,
                    regionNo: regionNo,
                    channelId: arr[0],
                    aaz570: arr[1],
                    authStatus: 1
                }
            })
            systemApi.addIssueInfo(channelList).then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    this.$Message.success(msg)
                    this.onCancelClick()
                    this.searchRegionList()
                } else {
                    this.$Message.error(msg)
                }
            })
        },
        // 获取数据
        searchRegionList () {
            this.openLoading()
            systemApi.searchIssueList(
                this.pageSize,
                this.currentPage,
                this.region
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
