<template>
    <div class="menu-comp">
        <!-- 常态下 -->
        <div class="normal-box">
            <!-- 最外层ul -->
            <ul class="normal-out-ul">
                <!-- 一级菜单li -->
                <li class="normal-p-li" v-for="pItem in menuList" :key="pItem.menuId">
                    <!-- 一级菜单 title -->
                    <div class="menu-title" v-if="!isCollapsed"
                        :class="{'p-active-leaf': pActiveLeafId === pItem.menuId, 'p-active-branche': pActiveBranche === pItem.menuId}"
                        @click="firstLevalClick(pItem)">
                        <!-- <i class="p-x-r iconfont" :class="[pItem.menuIcon]"></i> -->
                        {{pItem.menuTitle}}

                        <i
                            class="ivu-icon ivu-icon-ios-arrow-down arrow-icon"
                            :class="{'open-ul': openedMenuId === pItem.menuId}"
                            v-if="pItem.children.length !== 0"></i>

                    </div>

                     <div class="menu-titles" v-if="isCollapsed"
                        :class="{'p-active-leaf': pActiveLeafId === pItem.menuId, 'p-active-branche': pActiveBranche === pItem.menuId}"
                        @click="firstLevalClick(pItem)">
                        <!-- <i class="p-x-r iconfont" :class="[pItem.menuIcon]"></i> -->
                        <div class="new-title">
                        {{pItem.menuTitle.slice(0,2)}} </div>

                        <!-- <i
                            class="ivu-icon ivu-icon-ios-arrow-down arrow-icon"
                            :class="{'open-ul': openedMenuId === pItem.menuId}"
                            v-if="pItem.children.length !== 0"></i> -->

                    </div>
                    <!-- iview 展开动画组件 -->
                    <collapse-transition>
                        <!-- 二级菜单ul -->
                        <ul class="normal-in-ul" v-show="openedMenuId === pItem.menuId">

                            <li class="normal-c-li" v-for="cItem in pItem.children" :key="cItem.menuId">
                                <!-- 二级菜单 title -->
                                <div class="menu-title"
                                    :class="{'c-active-leaf': cActiveLeafId === cItem.menuId}"
                                    @click="secondLevalClick(cItem)"
                                    >
                                    <i class="p-x-r iconfont" :class="[pItem.menuIcon]"></i>
                                    {{cItem.menuTitle}}
                                </div>
                            </li>
                        </ul>
                    </collapse-transition>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import CollapseTransition from 'iview/src/components/base/collapse-transition'
import {infraApi} from '../../apis'
import {mapGetters} from 'vuex'

export default {
    components: {
        CollapseTransition
    },
    computed: {
        ...mapGetters({
            breadcrumbData: 'getBreadcrumbData'
        })
    },
    props: {
        isCollapsed: {
            type: Boolean,
            default: true
        }
    },
    data () {
        infraApi.getMenu().then(({data: {result}}) => {
            let menuList = result.children
            this.init(menuList)
        })
        return {
            menuList: [],
            pActiveLeafId: null, // 一级菜单 激活状态下的Id
            pActiveBranche: null, // 一级菜单 其二级菜单有激活状态下的Id
            openedMenuId: null, // 二级菜单 展开下，其父菜单的Id
            cActiveLeafId: null, // 二级菜单 激活状态下的Id
            clickedMenuId: null // 被点击的菜单Id
        }
    },
    watch: {
        '$route' (route, old) {
            if (route.name === old.name) return
            this.init()
        }
        // isCollapsed: function () {
        //     if
        // }
    },
    // computed: {},
    created () {},
    mounted () {},
    methods: {
        init (menu) {
            let menuList = []
            if (this.menuList.length !== 0) {
                menuList = this.menuList
            } else {
                menuList = menu
            }
            let nowMenuName = this.$route.name
            menuList.forEach(e => {
                if (e.menuRouter === nowMenuName) {
                    this.pActiveLeafId = e.menuId
                    this.openedMenuId = null
                    this.cActiveLeafId = null
                    this.pActiveBranche = null
                }
                if (e.children.length > 0) {
                    e.children.forEach(el => {
                        if (el.menuRouter === nowMenuName) {
                            this.cActiveLeafId = el.menuId
                            this.pActiveLeafId = null
                            this.pActiveBranche = el.menuPid
                            this.openedMenuId = el.menuPid
                        }
                    })
                }
            })
            this.menuList = menuList
            console.log(this.menuList, 'menuList')
        },
        firstLevalClick (pItem) {
            if (pItem.children.length === 0) {
                this.clickedMenuId = pItem.menuId
                this.pActiveLeafId = this.clickedMenuId
            }
            // 如果已有展开的菜单，则清除，并跳出
            if (this.openedMenuId && pItem.menuId === this.openedMenuId) {
                this.openedMenuId = null
                return
            }
            if (pItem.children.length === 0) {
                this.$router.push({
                    name: pItem.menuRouter
                })
            } else {
                this.openedMenuId = pItem.menuId
            }
        },
        secondLevalClick (cItem) {
            this.clickedMenuId = cItem.menuId
            this.cActiveLeafId = this.clickedMenuId
            this.$router.push({
                name: cItem.menuRouter
            })
        }
    }
}
</script>

<style lang="less">
.menu-comp {
    height: calc(~"100% - 64px");
    // color: rgba(226, 222, 222, 0.698);
    color: black;
    .normal-box {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;

        .new-title {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #e9f0f8;
            line-height: 250%;
            color: #115c76;
            font-size: 12px;
            text-align: center;
        }

        .normal-out-ul {
            overflow-y: auto;
            overflow-x: hidden;
            margin-bottom: 50px;

            .normal-p-li {
                overflow-x: hidden;
                cursor: pointer;
                font-size: 14px;

                .menu-title {
                    width: 200px;
                    padding: 20px 20px 20px 19px;
                    // font-weight: 600;
                    // &:hover {
                    //     color: #ffffff;
                    // }

                    .arrow-icon {
                        position: relative;
                        float: right;
                        top: 4px;
                        transition: transform .2s ease-in-out;
                    }

                    .open-ul {
                        transform: rotate(180deg);
                    }
                }
                .menu-titles {
                    width: 200px;
                    padding: 20px 20px 10px 10px;
                    // font-weight: 600;
                    // &:hover {
                    //     color: #ffffff;
                    // }

                    .arrow-icon {
                        position: relative;
                        float: right;
                        top: 4px;
                        transition: transform .2s ease-in-out;
                    }

                    .open-ul {
                        transform: rotate(180deg);
                    }
                }
                .p-active-leaf {
                    background: #0888f2;
                    color:  #cccccc;
                }
                .p-active-branche {
                    color:  black;
                }

                .normal-in-ul {
                    overflow-y: auto;
                    // background: #363e4f;
                    overflow-x: hidden;

                    .normal-c-li {
                        .menu-title {
                            padding: 10px 0 10px 16px;
                            line-height: 24px;
                            font-size: 14px;
                            color: grey;
                            box-sizing: border-box;
                            border-left: white 4px solid;
                        }

                        .c-active-leaf {
                            background: #fdf1f1;
                            color: #e54a49;
                            // outline: #e54a49 4px solid;
                            box-sizing: border-box;
                            border-left: #e54a49 4px solid;
                        }
                    }
                }
            }
        }
    }
}
</style>