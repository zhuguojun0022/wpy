<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">渠道AK: </span>
                <span class="expand-value">{{ row.channelAccessKey }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">渠道SK: </span>
                <span class="expand-value">{{ row.channelSecretKey }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">签名算法: </span>
                <span class="expand-value">{{ row.signAlgorithm }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <span class="expand-key">签名盐值: </span>
                <span class="expand-value">{{ row.algorithmValue }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">加密密钥: </span>
                <span class="expand-value">{{ row.encryptKey }}</span>
                <Icon type="refresh" v-on:click="refresh(row)"></Icon>
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
    methods: {
        refresh (v) {
            let {channelId} = {...v}
            channelApi.updateEncryptKey(channelId).then(
                ({data: {result, resultCode, msg}}) => {
                    v.encryptKey = result
                }
            )
        }
    }
}
</script>