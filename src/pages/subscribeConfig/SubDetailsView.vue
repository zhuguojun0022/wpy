<template>
    <GPage bg>
        <Row class="p-y-b-2">
            <Col span="16">
                <div class="base-info p-x-l-1">
                    <h4>基础信息</h4>
                    <section class="detail-info">
                        <label class="detail-info-desc">API名称:</label>
                        <div class="detail-info-val">{{baseInfo.apiName}}</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">路径:</label>
                        <div class="detail-info-val">{{baseInfo.path}}</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">后端路径:</label>
                        <div class="detail-info-val">{{baseInfo.bgPath}}</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">请求路径:</label>
                        <div class="detail-info-val">{{baseInfo.requestPath || '暂无'}}</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">请求方式:</label>
                        <div class="detail-info-val">{{baseInfo.method}}</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">所属服务组:</label>
                        <div class="detail-info-val">{{baseInfo.groupName}}</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">API描述:</label>
                        <div class="detail-info-val">{{baseInfo.comments}}</div>
                    </section>
                </div>
                <div class="p-x-l-1">
                    <h4 style="padding: 20px 0">渠道名称</h4>
                    <Tag class="m-x-l">{{$route.params.channelName}}</Tag>
                </div>
                <div class="subscription-policy p-x-l-1">
                    <h4>订阅策略</h4>
                    <!-- <h5 class="service-control p-x-r-5">服务控制</h5> -->
                    <section class="detail-info">
                        <detail-item-edit
                            label="并发限制"
                            :valueObject="editInfo"
                            :isCanEdit="true"
                            :valueFields="['concurrentLimit']"
                            paramKey="concurrentLimit"
                            @edit="editClick"
                            @cancel="cancelClick"
                            @submit="submit">
                            <span slot="displayValue">{{concurrentLimitDisplayValue}}</span>
                            <div slot="editOption">
                                <i-switch v-model="concurrentLimitJudge" class="m-x-r" size="large" @on-change="concurrentLimitEvent">
                                    <span slot="open">限制</span>
                                    <span slot="close">不限</span>
                                </i-switch>
                                <InputNumber
                                    :precision="0"
                                    :max="9999"
                                    :min="0"
                                    :step="1"
                                    size="small"
                                    v-if="concurrentLimitJudge"
                                    v-model="editConcurrentLimit"
                                    class="m-x-r-2">
                                </InputNumber>
                            </div>
                        </detail-item-edit>
                    </section>
                </div>
            </Col>
        </Row>
    </GPage>
</template>
<script>
import DetailItem from '../../components/form/DetailItem'
// import TimelineCom from '../../components/log/TimeLine'
import {mapMutations} from 'vuex'
// import subconfig from '../../store/modules/subconfig'
import { subconfigApi } from '../../apis'
export default {
    data () {
        return {
            isfree: false,
            baseInfo: {},
            editConcurrentLimit: 0,
            editInfo: {
                verifySign: 0,
                priceRanges: [],
                strategyType: 1
            },
            typeList: [{
                label: '按月',
                value: 2
            }, {
                label: '按次',
                value: 1
            }],
            logList: [],
            checkPriceitems: (value) => {
                for (let p = 0; p < value.length; p++) {
                    let elem = value[p]
                    if (typeof elem.end === 'string' || elem.end === '' || elem.end === 0) {
                        return {
                            pass: false,
                            msg: '计费段中末尾值输入框均不可为空或0'
                        }
                    } else {
                        if (!/^[1-9]\d*$/.test(elem.start) || !/^[1-9]\d*$/.test(elem.end)) {
                            if (!(p + 1 === value.length) && elem.end === -1) {
                                return {
                                    pass: false,
                                    msg: '计费段中除最后一行的末尾值外，输入框均为正整数'
                                }
                            } else if (!/^[0-9]\d*$/.test(elem.price)) {
                                return {
                                    pass: false,
                                    msg: '计费段中，费用的值必须为大于等于0的整数'
                                }
                            }
                        } else if (elem.price !== 0 && !/^[1-9]\d*$/.test(elem.price)) {
                            return {
                                pass: false,
                                msg: '计费段中价钱输入框为非负整数'
                            }
                        } else if (elem.start > elem.end) {
                            return {
                                pass: false,
                                msg: '计费段中末尾值必须大于等于开始值'
                            }
                        }
                    }
                    return {
                        pass: true
                    }
                }
            },
            isCanEdit: false,
            defaultPrice: [],
            totalRequestsLimitJudge: false,
            concurrentLimitJudge: false,
            endTime: ''
        }
    },
    computed: {
        concurrentLimitDisplayValue () {
            return this.baseInfo.concurrency > -1 ? this.baseInfo.concurrency : '不限'
        }
    },
    components: {
        detailItemEdit: DetailItem
        // timelineCom: TimelineCom
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'clearBreadcrumb']),
        submit (val) {
            subconfigApi.updateOrderedAPI({
                id: this.$route.params.orderId,
                concurrency: this.editConcurrentLimit
            }).then(({data: {resultCode, msg}}) => {
                if (resultCode === '000000') {
                    val.onSuccess()
                    let currentLimit = this.editConcurrentLimit
                    this.baseInfo.concurrency = currentLimit
                    this.$Message.success({
                        content: 'success',
                        duration: 3
                    })
                } else {
                    this.$Message.error({
                        content: msg,
                        duration: 3
                    })
                }
            })
        },
        editClick (key) {
            this.concurrentLimitJudge = this.editConcurrentLimit !== -1
        },
        cancelClick (key) {
            if (this.editConcurrentLimit === -1) {
                this.concurrentLimitJudge = false
            }
        },
        getInfoById () {
            let orderId = this.$route.params.orderId
            subconfigApi.getOrderedDetailAPI(orderId).then(({data: {msg, result, resultCode}}) => {
                if (resultCode === '000000') {
                    this.baseInfo = result
                    this.isCanEdit = true
                    this.editConcurrentLimit = result.concurrency
                } else {
                    this.$Message.error({
                        content: msg,
                        duration: 3
                    })
                }
            })
        },
        concurrentLimitEvent (val) {
            if (typeof val !== 'number') {
                if (val === false) {
                    this.editConcurrentLimit = -1
                } else {
                    this.editConcurrentLimit = 5
                }
            }
        }
    },
    mounted () {
        this.clearBreadcrumb()
        this.pushBreadcrumb([{
            name: '订阅详情'
        }, {
            name: this.$route.params.apiName
        }])
        this.getInfoById()
    }
}
</script>
<style lang="less" scoped>
.detail-info {
    padding: 20px 0 0 0;
    .detail-info-desc {
        font-size: 14px;
        min-width: 120px;
        text-align: right;
        font-weight: 600;
        display: inline-block;
    }
    .detail-info-val {
        padding-left: 20px;
        display: inline-block;
        vertical-align: middle;
    }
}
.subscription-policy {
    h4, h5 {
        font-weight: 500;
        padding-top: 20px;
    }
    .service-control {
        font-size: 14px;
    }
}
.price-display-box {
    .price {
        width: 70px;
        text-align: center;
    }
}
</style>
