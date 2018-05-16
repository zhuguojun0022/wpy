<template>
<div class="header-bar">
    <div class="user-box">
        <Dropdown>
            <a class="name"><Icon type="person"></Icon>{{user.nickname}}</a>
            <Icon type="arrow-down-b"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem @click.native="onLogout"><Icon type="android-exit"></Icon>退出</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
</div>
</template>
<script>
export default {
    data () {
        this.$getLoginUser().then((user) => {
            this.user = user
        })
        return {
            user: {}
        }
    },
    methods: {
        onLogout () {
            this.$router.replace('/login')
        }
    }
}
</script>
<style lang="less">
@header-height:52px;
.header-bar {
    background: #fff;
    height: @header-height;
    border-bottom: 1px solid #f3f3f3;

    .user-box {
        float: right;
        height: @header-height;
        padding: 10px;
        width: 120px;
        line-height: 32px;
        text-align: center;
        .name {
            font-weight: bold;
            color: #777;
        }
        .ivu-icon {
            color: #777;
            margin-right: 5px;
        }

        &:hover {
            background-color: #f0f0f0;
            cursor: pointer;
        }
    }
}
</style>
