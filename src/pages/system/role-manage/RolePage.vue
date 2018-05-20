<template>
<GPage bg>
    <table-header>
        <div slot="left">
            <Button type="primary">新增角色</Button>
        </div>
    </table-header>
    <Row :gutter="16">
        <Col span="18"><Table highlight-row :columns="columns" :data="tableData"></Table></Col>
        <Col span="6" class="authorize">
            <span>授权功能</span>
            <Button type="primary">保存</Button>
                <Tree :data="treeData" show-checkbox></Tree>
        </Col>
    </Row>
</GPage>
</template>
<script>
import { TableHeader } from '../../../components/table'
import {systemApi} from '../../../apis/'
// import {userStatus} from '../../../common/consts'
import {mapMutations} from 'vuex'
import {infraApi} from '../../../apis'
export default {
    components: {TableHeader},
    data () {
        return {
            tableData: [],
            columns: [
                {title: '角色名称', key: 'roleName'},
                {title: '角色描述', key: 'roleDescribe'},
                {title: '角色ID', key: 'roleId'},
                {title: '创建人', key: 'founder'},
                {title: '创建时间', key: 'creationTime'},
                {
                    title: '状态',
                    key: 'status',
                    render: (h, {row}) => {
                        return h('iSwitch', {
                            props: {
                                value: row.status,
                                size: 'large'
                            },
                            on: {
                                'on-change': (val) => {
                                    this.onStatusChange(row.id, val)
                                }
                            }
                        }, [
                            h('span', {
                                slot: 'open'
                            }, '开启'),
                            h('span', {
                                slot: 'close'
                            }, '停用')
                        ])
                    }
                },
                {
                    title: '操作',
                    render: (h, {column, index, row}) => {
                        return this.getCellRender(h, [{
                            label: '修改',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.reviseClick(row.id)
                                }
                            }
                        }, {
                            label: '授权用户',
                            type: 'primary',
                            on: {
                                click: () => {
                                    this.authorizedUserClick(row.id)
                                }
                            }
                        }, {
                            label: '删除',
                            type: 'error',
                            on: {
                                click: () => {
                                    this.deleteClick(row.id)
                                }
                            }
                        }])
                    }
                }
            ],
            treeData: [
            ]
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
        systemApi.searchRoleList().then(({data: {result, code, msg}}) => {
            this.tableData = result.roleList
        })
    },
    methods: {
        ...mapMutations(['resetBreadcrumb']),
        onClickPrimaryBtn () {},
        onNewUserSubmint () {},
        handleCurrentChange (v) {},
        onStatusChange (id, val) {},
        filterData (arr) {
            var newArr = [];
            arr.map((item)=>{
                var childrenArr;
                if(!item.leaf){
                    childrenArr = this.filterData(item.subMenu)
                }else{
                    childrenArr = [];
                }
                newArr.push({
                    title: item.menuName,
                    leaf: item.leaf,
                    children: childrenArr
                })
            })
            return newArr;
        },
        loadData () {
            infraApi.getMenu().then(({data: {result}}) => {
            result.push(result[0])
            this.treeData = this.filterData(result);
            
        })
        }
    },
    mounted () {
        this.loadData();
    }
}
</script>

<style  lang="less" scoped>
.authorize{
    border: 1px solid #dddee1;
    span {
        font-weight: bold;
        height: 40px;
        line-height: 40px;
    }
    button {
        float: right;
        margin-top: 6px;
    }
}
</style>
