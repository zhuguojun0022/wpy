<template>
    <div class="menu-comp">
        <!-- 常态下 -->
        <div class="normal-box">
            <!-- 最外层ul -->
            <ul class="normal-out-ul">
                <!-- 一级菜单li -->
                <li class="normal-p-li" v-for="pItem in menuList" :key="pItem.menuId">
                    <!-- 一级菜单 title -->
                    <div class="menu-title"
                        :class="{'p-active-leaf': pActiveLeafId === pItem.menuId, 'p-active-branche': pActiveBranche === pItem.menuId}"
                        @click="firstLevalClick(pItem)">

                        <i class="p-x-r iconfont" :class="[pItem.menuIcon]"></i>

                        {{pItem.menuName}}

                        <i
                            class="ivu-icon ivu-icon-ios-arrow-down arrow-icon"
                            :class="{'open-ul': openedMenuId === pItem.menuId}"
                            v-if="!pItem.leaf"></i>

                    </div>
                    <!-- iview 展开动画组件 -->
                    <collapse-transition>
                        <!-- 二级菜单ul -->
                        <ul class="normal-in-ul" v-show="openedMenuId === pItem.menuId">

                            <li class="normal-c-li" v-for="cItem in pItem.subMenu" :key="cItem.menuId">
                                <!-- 二级菜单 title -->
                                <div class="menu-title"
                                    :class="{'c-active-leaf': cActiveLeafId === cItem.menuId}"
                                    @click="secondLevalClick(cItem)"
                                    >
                                    {{cItem.menuName}}
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

export default {
    components: {
        CollapseTransition
    },
    props: {},
    data () {
        infraApi.getMenu().then(({data: {result}}) => {
            this.init(result)
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
            if (route.name === 'nopermission') {
                this.pActiveLeafId = this.clickedMenuId
                this.pActiveBranche = null
                this.cActiveLeafId = this.clickedMenuId
            }
            if (route.name === old.name) return
            this.init()
        }
    },
    computed: {},
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
            console.log(menu, this.$route.name)
            let nowMenuName = this.$route.name
            menuList.forEach(e => {
                if (e.menuUrl === nowMenuName) {
                    this.pActiveLeafId = e.menuId
                    this.openedMenuId = null
                    this.cActiveLeafId = null
                    this.pActiveBranche = null
                }
                if (e.subMenu) {
                    e.subMenu.forEach(el => {
                        if (el.menuUrl === nowMenuName) {
                            this.cActiveLeafId = el.menuId
                            this.pActiveLeafId = null
                            this.pActiveBranche = el.menuPid
                            this.openedMenuId = el.menuPid
                        }
                    })
                }
            })
            this.menuList = menuList
            console.log(menuList, 3333)
        },
        firstLevalClick (pItem) {
            if (pItem.leaf) {
                this.clickedMenuId = pItem.menuId
                this.pActiveLeafId = this.clickedMenuId
            }
            // 如果已有展开的菜单，则清除，并跳出
            if (this.openedMenuId && pItem.menuId === this.openedMenuId) {
                this.openedMenuId = null
                return
            }
            if (pItem.leaf) {
                this.$router.push({
                    name: pItem.menuUrl
                })
            } else {
                this.openedMenuId = pItem.menuId
            }
        },
        secondLevalClick (cItem) {
            this.clickedMenuId = cItem.menuId
            this.cActiveLeafId = this.clickedMenuId
            this.$router.push({
                name: cItem.menuUrl
            })
        }
    }
}
</script>

<style lang="less">
.menu-comp {
    height: calc(~"100% - 64px");
    color: rgba(226, 222, 222, 0.698);
    .normal-box {
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;

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
                    padding: 10px 20px;

                    &:hover {
                        color: #ffffff;
                    }

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
                    color: #ffffff;
                }
                .p-active-branche {
                    color: #ffffff;
                }

                .normal-in-ul {
                    overflow-y: auto;
                    background: #363e4f;
                    overflow-x: hidden;

                    .normal-c-li {
                        .menu-title {
                            padding: 5px 0 5px 50px;
                            font-size: 12px;
                        }

                        .c-active-leaf {
                            background: #0888f2;
                            color: #ffffff;
                        }
                    }
                }
            }
        }
    }
}
</style>