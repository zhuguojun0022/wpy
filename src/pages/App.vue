<template>
    <div class="app layout">
        <Layout>
            <Sider ref="side1" :hide-trigger='isHide' collapsible :collapsed-width="50" width="200" v-model="isCollapsed">
                <div class="logo">
                    <!-- <h1><i class="iconfont icon-shebao"></i>电子社保卡管理平台</h1> -->
                </div>
                <!-- <Menu v-if="!isCollapsed"></Menu> -->
                <Menu :isCollapsed='isCollapsed'></Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <!-- <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px'}" type="navicon-round" size="24"></Icon> -->
                    <!-- <div class="user-box">
                        <Dropdown>
                            <a class="name"><Icon type="person"></Icon>{{user.userAdminName}}</a>
                            <Icon type="arrow-down-b"></Icon>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native="onLogout"><Icon type="android-exit"></Icon>退出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div> -->
                    <header-bar></header-bar>
                </Header>
                <tab v-show="isTab"></tab>
                <!-- <x-breadcrumb></x-breadcrumb> -->
                <Content :style="{margin: '0px', background: '#fff'}">
                    <keep-alive :include="tabName">
                    <router-view></router-view>
                    </keep-alive>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import Vue from 'vue'
import Menu from '../components/frame/Menu'
import Page from '../components/frame/Page'
import HeaderBar from '../components/frame/HeaderBar'
// import {startGetLoginUser} from '../common/loginUser'
import tab from '../components/frame/tab'
// import { loginOut } from '../common/utils'

Vue.component('GPage', Page)
export default {
    components: {
        Menu, HeaderBar, tab
    },
    data () {
        return {
            isCollapsed: false,
            activeRouteCode: null,
            isHide: false,
            isTab: true,
            tabName: []
        }
    },
    mounted () {
        // startGetLoginUser()
        if (this.$route.name === 'home') {
            // console.log(this.$route.name, 'router')
            this.isHide = true
            this.isTab = false
            this.isCollapsed = false
        } else {
            this.isHide = false
            this.isTab = true
        }
    },
    watch: {
        $route () {
            if (this.$route.name === 'home') {
                // console.log(this.$route.name, 'router')
                this.isHide = true
                this.isTab = false
                this.isCollapsed = false
            } else {
                this.isHide = false
                this.isTab = true
            }
        },
        visitedViews () {
            // console.log(this.visitedViews, 'visitedViews')
            let that = this
            this.tabName = []
            this.visitedViews.forEach((val) => {
                that.tabName.push(val.name)
            })
            // console.log(this.tabName, 'tabName')
        }
    },
    computed: {
        // rotateIcon () {
        //     return [
        //         'menu-icon',
        //         this.isCollapsed ? 'rotate-icon' : ''
        //     ]
        // },
        // menuitemClasses () {
        //     return [
        //         'menu-item',
        //         this.isCollapsed ? 'collapsed-menu' : ''
        //     ]
        // }
        visitedViews () { // store中取值
            return this.$store.getters.visitedviews
        }
    },
    methods: {
        // onLogout () {
        //     loginOut()
        //     this.$router.replace('/login')
        // }
    },
    beforeRouteEnter (to, from, next) {
        next((vm) => {
            // if (to.name === 'home') {
            //     vm.isHide = true
            // }
            vm.activeRouteCode = to.meta.menuCode
        })
    },
    beforeRouteUpdate (to, from, next) {
        this.activeRouteCode = to.meta.menuCode
        next()
    }
}
</script>
<style lang="less">
.gui-page.gui-page-bg{
    background-color: #f2f5f9!important;
    padding: 0 10px!important;
    // background: lightgrey;
}
.ivu-layout-sider-trigger {
    color: black;
    background: white;
}
.app {
    height: 100%;
    //  font-size: 20px!important;
    .layout{
        height: 100%;
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .logo {
        width: 200px;
        height: 40px;
        background:  #e54a49;

        h1 {
            height: 64px;
            width: 100%;
            position: relative;
            // color: #fff;
            font-size: 18px;
            padding-left: 20px;
            text-align: center;
            line-height: 64px;

            i {
                font-size: 32px;
                position: absolute;
                left: 8px;
            }
        }
    }
    .user-box {
        float: right;
        height: 64px;;
        // padding: 10px;
        width: 120px;
        line-height: 64px;
        text-align: center;
        .name {
            font-weight: bold;
            color: #777;
        }
        .ivu-icon {
            color: #777;
            margin-right: 5px;
        }

        // &:hover {
        //     background-color: #f0f0f0;
        //     cursor: pointer;
        // }
    }
    .ivu-layout {
        height: 100%;
    }
    .ivu-layout-sider {
        height: 100%;
        background: white !important;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item {
        span {
            display: inline-block;
            overflow: hidden;
            width: 69px;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
            transition: width .2s ease .2s;
        }

        i {
            transform: translateX(0px);
            transition: font-size .2s ease, transform .2s ease;
            vertical-align: middle;
            font-size: 16px;
        }
    }
    .collapsed-menu {
        span {
            width: 0px;
            transition: width .2s ease;
        }

        i {
            transform: translateX(5px);
            transition: font-size .2s ease .2s, transform .2s ease .2s;
            vertical-align: middle;
            font-size: 22px;
        }
    }
}
</style>
