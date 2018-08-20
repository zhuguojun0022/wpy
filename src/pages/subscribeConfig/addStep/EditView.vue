<template>
    <div class="edit-strategy">
        <section class="base-info">
            <h5 class="api-base-info">API基础信息</h5>
            <Row class="m-x-l-3 m-y-t-1-5 m-y-b-2">
                <Col :span="8">
                    <label>
                        <span class="base-info-title">API:</span>
                        <span>{{baseInfo.name}}</span>
                    </label>
                </Col>
                <Col :span="8">
                    <label>
                        <span class="base-info-title">服务类型:</span>
                        <span>真实服务</span>
                    </label>
                </Col>
            </Row>
            <Row class="m-x-l-3 m-y-t-1 m-y-b-2">
                <Col :span="8">
                    <label>
                        <span class="base-info-title">路径:</span>
                        <span>{{baseInfo.path}}</span>
                    </label>
                </Col>
                <Col :span="8">
                    <label>
                        <span class="base-info-title">后端路径:</span>
                        <span>{{baseInfo.bgPath}}</span>
                    </label>
                </Col>
            </Row>
            <Row class="m-x-l-3 m-y-t-1 m-y-b-2" v-if="baseInfo.requestPath">
                <Col :span="24">
                    <label>
                        <span class="base-info-title">请求路径:</span>
                        <span>{{baseInfo.requestPath || '暂无'}}</span>
                    </label>
                </Col>
            </Row>
            <Row class="m-x-l-3 m-y-t-1 m-y-b-2">
                <Col :span="8">
                    <label>
                        <span class="base-info-title">所属服务组:</span>
                        <span>{{baseInfo.serviceGroup}}</span>
                    </label>
                </Col>
                <Col :span="8">
                    <label>
                        <span class="base-info-title">描述:</span>
                        <span>{{baseInfo.des}}</span>
                    </label>
                </Col>
            </Row>
        </section>
        <section class="base-info">
            <h5 class="api-base-info">已选渠道</h5>
            <Row class="m-x-l-3 m-y-t-1-5 m-y-b-2">
                <Col :span="8">
                    <Tag
                        closable
                        @on-close="handleClose(channel.channelId)"
                        v-for="(channel, index) in channelInfo"
                        v-bind:key="index"
                        class="m-x-r-2"
                        style="height: 28px;line-height: 28px">
                        {{channel.AAZ571}}
                    </Tag>
                </Col>
            </Row>
        </section>
        <section class="order-strategy p-y-t">
            <h5 class="api-base-info m-y-b-2">服务控制</h5>
            <div class="m-x-l-3 m-y-t-1-5">
                <Form ref="info" :model="editInfo" :label-width="85" label-position="right">
                    <FormItem label="并发限制" prop="concurrentLimit">
                        <i-switch v-model="editInfo.concurrentLimitJudge" @on-change="concurrentLimitJudgeSwitchChange" style="width: 70px" size="large">
                            <span slot="open">限制</span>
                            <span slot="close">不限制</span>
                        </i-switch>
                        <InputNumber v-model="editConcurrentLimit" size="small" :max="9999" :min="0" :precision="0" :step="1" v-if="editInfo.concurrentLimitJudge"></InputNumber>
                    </FormItem>
                </Form>
                <div class="submit-box">
                    <Button type="primary" @click="submit">提交</Button>
                    <Button type="ghost" class="m-x-l-2" @click="goBack(title)">{{ goBackTitle }}</Button>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import { subconfigApi } from '../../../apis'
export default {
    data () {
        return {
            baseInfo: {
                name: '',
                serviceGroup: '',
                path: '',
                des: '',
                requestPath: '',
                bgPath: '',
                virtual: false
            },
            editInfo: {
                concurrentLimitJudge: false
            },
            editConcurrentLimit: -1,
            addBtnShow: false,
            goBackTitle: '返回上一步',
            title: '1'
        }
    },
    mounted () {
        this.baseInfo = {
            name: this.apiInfo.name,
            serviceGroup: this.apiInfo.groupName,
            path: this.apiInfo.path,
            des: this.apiInfo.comments,
            requestPath: this.apiInfo.requestPath,
            virtual: this.apiInfo.virtual,
            bgPath: this.apiInfo.bgPath
        }
    },
    computed: {
        ...mapGetters({
            apiInfo: 'apiInfo',
            channelInfo: 'channelInfo'
        })
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'openLoading', 'closeLoading', 'setStep', 'gobackStep', 'changeChannel']),
        submit () {
            let apiId = this.apiInfo.id
            let apiIds = [apiId]
            let callerIds = []
            this.channelInfo.forEach(el => {
                callerIds.push(el.channelId)
            })
            let params = {
                apiIds: apiIds,
                callerIds: callerIds,
                concurrency: this.editConcurrentLimit
            }
            let that = this
            subconfigApi.addOrderedAPI(params).then(({data: {result, resultCode, msg}}) => {
                if (resultCode === '000000') {
                    that.setStep()
                } else {
                    that.$Message.error({
                        content: msg,
                        duration: 3
                    })
                }
            })
        },
        goBack (title) {
            if (title === '1') {
                this.$refs['info'].resetFields()
                this.gobackStep()
            } else {
                this.$router.go(-1)
            }
        },
        concurrentLimitJudgeSwitchChange (val) {
            if (val === false) {
                this.editConcurrentLimit = -1
            } else {
                this.editConcurrentLimit = 5
            }
        },
        handleClose (channelId) {
            this.changeChannel(channelId)
            console.log(this.channelInfo)
        }
    }
}
</script>
<style lang="less">
.edit-strategy{
    .base-info {
        margin-top: 40px;
        .api-base-info {
            font-weight: 600;
            font-size: 16px;
        }
        .base-info-title {
            color: #5E6D82;
            font-weight: 600;
            margin-right: 12px;
        }
    }
    .silder-inline {
        display: inline-flex;
        color: #5E6D82;
    }
    .add-btn {
        color: #0888F2;
        border-color: #0888F2;
        width: 400px;
        margin: 10px 0;
    }
    .submit-box {
        margin-bottom: 40px;
        margin-left: 85px;
        padding-top: 20px;
    }
}
</style>
