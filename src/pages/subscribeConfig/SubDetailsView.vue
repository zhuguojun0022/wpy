<template>
    <GPage bg>
        <Row class="p-y-b-2">
            <Col span="16">
                <div class="base-info p-x-l-1">
                    <h4>基础信息</h4>
                    <section class="detail-info">
                        <label class="detail-info-desc">API名称:</label>
                        <div class="detail-info-val">test</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">服务类型:</label>
                        <div class="detail-info-val">真实服务</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">路径:</label>
                        <div class="detail-info-val">/test</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">后端路径:</label>
                        <div class="detail-info-val">/test/in/on</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">请求路径:</label>
                        <div class="detail-info-val">/test/in</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">请求方式:</label>
                        <div class="detail-info-val">GET</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">所属服务组:</label>
                        <div class="detail-info-val">portal-local</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">API描述:</label>
                        <div class="detail-info-val">描述</div>
                    </section>
                </div>
                <div class="subscription-policy p-x-l-1">
                    <h4>订阅策略</h4>
                    <h5 class="service-control p-x-r-5">服务控制</h5>
                    <section class="detail-info">
                        <label class="detail-info-desc">验签</label>
                        <detail-item-edit
                            :valueObject="editInfo"
                            :valueFields="['verifySign']"
                            paramKey="verifySign"
                            @submit="submit">
                            <span slot="displayValue">不验签</span>
                            <RadioGroup slot="editOption" size="small" type="button" v-model="editInfo.verifySign">
                                <Radio :label="0">
                                    <span>不验签</span>
                                </Radio>
                                <Radio :label="1">
                                    <span>强验签</span>
                                </Radio>
                                <Radio :label="2">
                                    <span>弱验签</span>
                                </Radio>
                            </RadioGroup>
                        </detail-item-edit>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">加密</label>
                        <detail-item-edit
                            :valueObject="editInfo"
                            :valueFields="['encryption']"
                            paramKey="encryption"
                            @submit="submit">
                            <span slot="displayValue">开</span>
                            <i-switch slot="editOption" v-model="editInfo.encryption" size="large">
                                <span slot="open">开</span>
                                <span slot="close">关</span>
                            </i-switch>
                        </detail-item-edit>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">防重放攻击</label>
                        <detail-item-edit
                            :valueObject="editInfo"
                            :valueFields="['antiReplayAttack']"
                            paramKey="antiReplayAttack"
                            @submit="submit">
                            <span slot="displayValue">开</span>
                            <i-switch slot="editOption" v-model="editInfo.antiReplayAttack" size="large">
                                <span slot="open">开</span>
                                <span slot="close">关</span>
                            </i-switch>
                        </detail-item-edit>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">并发控制</label>
                        <detail-item-edit
                            :valueObject="editInfo"
                            :valueFields="['concurrentLimit']"
                            paramKey="concurrentLimit"
                            @submit="submit">
                            <span slot="displayValue">不限</span>
                            <div slot="editOption">
                                <i-switch v-model="editInfo.concurrentLimit" size="large">
                                    <span slot="open">限制</span>
                                    <span slot="close">不限</span>
                                </i-switch>
                                <InputNumber :precision="0" :max="9999" :min="0" :step="1" size="small" v-model="editInfo.concurrentLimit"></InputNumber>
                            </div>
                        </detail-item-edit>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">调用总数限制</label>
                        <detail-item-edit
                            :valueObject="editInfo"
                            :valueFields="['totalRequestsLimit']"
                            paramKey="totalRequestsLimit"
                            @submit="submit">
                            <span slot="displayValue">不限</span>
                            <div slot="editOption">
                                <i-switch v-model="editInfo.totalRequestsLimit" size="large">
                                    <span slot="open">限制</span>
                                    <span slot="close">不限</span>
                                </i-switch>
                                <InputNumber :precision="0" :max="9999" :min="0" :step="1" size="small" v-model="editInfo.totalRequestsLimit"></InputNumber>
                            </div>
                        </detail-item-edit>
                    </section>
                    <h5 class="service-control p-x-r-5">时效策略</h5>
                    <section class="detail-info">
                        <label class="detail-info-desc">生效时间:</label>
                        <div class="detail-info-val">2018-09-27</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">有效期:</label>
                        <div class="detail-info-val">1个月</div>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">失效时间:</label>
                        <div class="detail-info-val">2018-10-31</div>
                    </section>
                    <h5 class="service-control p-x-r-5">
                        计费策略
                        <i-switch class="m-x-l-2" v-model="isfree" size="large">
                            <span slot="open">免费</span>
                            <span slot="close">付费</span>
                        </i-switch>
                    </h5>
                    <div class="box" v-if="!isfree">
                        <section class="detail-info">
                            <label class="detail-info-desc">计费类型</label>
                            <detail-item-edit
                                :valueObject="editInfo"
                                :valueFields="['strategyType']"
                                paramKey="strategyType"
                                @submit="submit">
                                <Tag slot="displayValue" type="border" color="green">收费</Tag>
                                <Select slot="editOption" :transfer="true" size="small" v-model="editInfo.strategyType" style="width: 300px;">
                                    <Option v-for="item in typeList" :value="item.value" :key="item.value">
                                        {{ item.label }}
                                    </Option>
                                </Select>
                            </detail-item-edit>
                        </section>
                        <section class="detail-info">
                            <label class="detail-info-desc">基础付费</label>
                            <detail-item-edit
                                :valueObject="editInfo"
                                :valueFields="['strategyBase']"
                                paramKey="strategyBase"
                                @submit="submit">
                                <span slot="displayValue">1000</span>
                                <InputNumber slot="editOption" :precision="0" :min="1" :step="1" size="small" v-model="editInfo.strategyBase"></InputNumber>
                            </detail-item-edit>
                        </section>
                        <section class="detail-info">
                            <label class="detail-info-desc">计费段</label>
                            <detail-item-edit
                                :valueObject="editInfo"
                                :valueFields="['priceRanges']"
                                paramKey="priceRanges"
                                @submit="submit">
                                <div slot="displayValue" class="price-display-box">
                                    <Row v-for="(item, index) in editInfo.priceRanges" :key="index">
                                        <Col span="24">
                                            <label class="price">{{ item.start }}</label>
                                            <label class="p-p">~</label>
                                            <label class="price">{{ item.end === -1 ? '&infin;' : item.end }}</label>
                                            <span class="seg-unit">{{ unit }}</span>
                                            <b>，费用：每</b>
                                            <span class="seg-unit">{{ unit }}</span>
                                            <label> : </label>
                                            <label class="price">{{ item.price }}</label>
                                            <label>分</label>
                                        </Col>
                                    </Row>
                                </div>
                                <div slot="editOption">
                                    <Row class="m-y-b-5" v-for="(item, index) in editInfo.priceRanges" :key="index">
                                        <Col span="24">
                                            <Input size="small" style="width: 80px;" readonly type="text" v-model="item.start" placeholder="请输入..." :number="true" :maxlength="10"></Input>
                                            ~
                                            <Input size="small" style="width: 80px;" type="text" v-model="item.end" placeholder="请输入..." :number="true" :maxlength="10"></Input>
                                            <span class="seg-unit">{{ unit }}</span>
                                            <b>，费用：每</b>
                                            <span class="seg-unit">{{ unit }}</span>
                                            <Input size="small" style="width: 80px;" type="text" v-model="item.price" placeholder="请输入..." :number="true" :maxlength="10"></Input>
                                            分
                                            <Button v-show="editInfo.priceRanges.length === index + 1 && editInfo.priceRanges.length !== 1" size="small" type="error" class="del-btn m-x" icon="trash-b"></Button>
                                        </Col>
                                    </Row>
                                    <Row class="p-y-t">
                                        <Col span="24">
                                            <Button type="dashed" long class="add-btn" style="width: 400px;" icon="plus-round">新增</Button>
                                            <Alert show-icon style="width: 400px; margin-bottom: 0;" class="m-y-t-5">
                                                计费段 末尾值为 -1 ，代表无穷大
                                            </Alert>
                                        </Col>
                                    </Row>
                                </div>
                            </detail-item-edit>
                        </section>
                        <section class="detail-info">
                            <label class="detail-info-desc">备注</label>
                            <detail-item-edit
                                :valueObject="editInfo"
                                :valueFields="['strategyComment']"
                                paramKey="strategyComment"
                                @submit="submit">
                                <span slot="displayValue">备注123备注</span>
                                <Input slot="editOption" type="textarea" :autosize="{minRows: 2}" size="small" v-model="editInfo.strategyComment"></Input>
                            </detail-item-edit>
                        </section>
                    </div>
                </div>
            </Col>
            <Col span="8">
                <h4>操作日志</h4>
                <timeline-com :showway="false" :logList="logList"></timeline-com>
                <Button type="text" v-show="true">加载更多</Button>
            </Col>
        </Row>
    </GPage>
</template>
<script>
import DetailItem from '../../components/form/DetailItem'
import TimelineCom from '../../components/log/TimeLine'
import {mapMutations} from 'vuex'
export default {
    data () {
        return {
            isfree: false,
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
            }
        }
    },
    computed: {
        unit () {
            return this.editInfo.strategyType === 1 ? '次' : '月'
        }
    },
    components: {
        detailItemEdit: DetailItem,
        timelineCom: TimelineCom
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'clearBreadcrumb']),
        submit (val) {
            let [key, value] = [val.key, this.editInfo[val.valueFields[0]]]
            if (key === 'priceRanges') {
                let rePriceRanges = this.checkPriceitems(value)
                if (!rePriceRanges.pass) {
                    this.$message.warning({
                        content: rePriceRanges.msg,
                        duration: 2
                    })
                    return false
                }
            }
            let params = {
                id: this.$route.params.orderId,
                free: this.isfree
            }
            if (key === 'subscribeBegin') {
                let date = new Date(value)
                date = date.setMonth(date.getMonth() + 0)
                value = date
            } else if (key === 'strategyBase') {
                value = value * 100
            }
            params[key] = value
            // subconfigApi.updateOrderedAPI(params).then(({body: {result, code, msg}}) => {

            // })
            val.onSuccess()
            this.$Message.success({
                content: 'success',
                duration: 5
            })
        }
    },
    mounted () {
        if (this.$route.params.way === 'api') {
            this.clearBreadcrumb()
            this.pushBreadcrumb([{
                name: '服务管理',
                icon: 'icon-fuwuguanli'
            }, {
                name: 'API详情'
            }, {
                name: '订阅信息'
            }, {
                name: '订阅详情'
            }])
        } else {
            this.clearBreadcrumb()
            this.pushBreadcrumb([{
                name: '订阅配置',
                icon: 'icon-fuwuguanli'
            }, {
                name: this.$route.params.callerName
            }, {
                name: this.$route.params.apiName
            }])
        }
        this.logList = [{
            dailyLogs: [
                {
                    action: 3,
                    avatar: '',
                    avatarId: '123123',
                    avatarType: 2,
                    createBy: 'carrot',
                    createDate: '2018-07-26 15:30:29',
                    desc: '订阅启用',
                    entityId: '2310009123jjw',
                    feature: 'SubMgr',
                    id: '9919230213kkda',
                    time: '15:30:29'
                }, {
                    action: 1,
                    avatar: '',
                    avatarId: '123123',
                    avatarType: 2,
                    createBy: 'carrot',
                    createDate: '2018-09-02 03:30:29',
                    desc: '订阅服务',
                    entityId: '2310009123jjw',
                    feature: 'SubMgr',
                    id: '9919230213kkda',
                    time: '15:30:29'
                }
            ],
            day: '2018年07月26日'
        }]
    }
}
</script>
<style lang="less" scoped>
.detail-info {
    padding: 20px 0 0 30px;
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
