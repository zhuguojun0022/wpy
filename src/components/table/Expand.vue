<template>
    <div>
        <Row class="expand-row">
            <Col span="7">
                <label class="expand-key">渠道AK
                    <Tooltip content="渠道后台系统调用部平台接口的接入用户名" placement="top-start">
                        <Icon class="info" type="information-circled"></Icon>
                    </Tooltip>: </label>
                <span class="expand-value">{{ row.channelAccessKey }}</span>
            </Col>
            <Col span="7">
                <label class="expand-key">渠道SK
                    <Tooltip content="渠道后台系统调用部平台接口的接入密钥" placement="top-start">
                        <Icon class="info" type="information-circled"></Icon>
                    </Tooltip>: </label>
                <span class="expand-value">{{ row.channelSecretKey }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="7">
                <label class="expand-key">签名算法
                    <Tooltip content="渠道APP与部平台H5页面交互时的算法" placement="top-start">
                        <Icon class="info" type="information-circled"></Icon>
                    </Tooltip>: </label>
                <span class="expand-value">{{ row.signAlgorithm }}</span>
            </Col>
            <Col span="7">
                <label class="expand-key">数据密钥
                    <Tooltip content="渠道APP与部平台H5页面交互时的密钥" placement="top-start">
                        <Icon class="info" type="information-circled"></Icon>
                    </Tooltip>: </label>
                <span class="expand-value">{{ row.encryptKey }}</span>
                <Tooltip content="切换数据密钥" placement="top-start">
                    <Icon class="expend-icon" :class="{'run': isRun}" :type="refreshIcon" @click.native="refresh(row)"></Icon>
                </Tooltip>
            </Col>
        </Row>
    </div>
</template>
<script>
import {channelApi} from '../../apis/'

export default {
    props: {
        row: Object
    },
    data () {
        return {
            isRun: false,
            refreshIcon: 'refresh'
        }
    },
    methods: {
        refresh (v) {
            if (this.isRun) return
            this.$Modal.confirm({
                title: '信息确认',
                content: `您将切换数据密钥，是否继续？`,
                closable: false,
                loading: true,
                onOk: () => {
                    this.$Modal.remove()
                    this.isRun = true
                    this.refreshIcon = 'load-c'
                    let {channelId} = {...v}
                    channelApi.updateEncryptKey(channelId).then(
                        ({data: {result, resultCode, msg}}) => {
                            this.isRun = false
                            this.refreshIcon = 'refresh'
                            v.encryptKey = result
                        }
                    ).catch(() => {
                        this.isRun = false
                        this.refreshIcon = 'refresh'
                    })
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.expand-row{
    margin-bottom: 16px;
}
.info {
    color: rgb(212, 212, 212);
    padding-right: 5px;
}
.expand-key {
    font-weight: 700;
    width: 80px;
    text-align: right;
    display: inline-block;
    margin-right: 10px;
}
.expend-icon {
    color: #2d8cf0;
    cursor: pointer;
    font-size: 16px;
    margin-left: 10px;
}
@-webkit-keyframes rotation{
    from {-webkit-transform: rotate(0deg);}
    to {-webkit-transform: rotate(360deg);}
}

.run {
    -webkit-transform: rotate(360deg);
    animation: rotation 1s linear infinite;
    -moz-animation: rotation 1s linear infinite;
    -webkit-animation: rotation 1s linear infinite;
    -o-animation: rotation 1s linear infinite;
}
</style>
