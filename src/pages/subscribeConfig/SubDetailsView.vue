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
                        <label class="detail-info-desc">服务类型:</label>
                        <div class="detail-info-val">{{serverTypeDisplayValue}}</div>
                    </section>
                    <section class="detail-info" v-if="baseInfo.type !== 1">
                        <label class="detail-info-desc">路径:</label>
                        <div class="detail-info-val">{{baseInfo.apiPath}}</div>
                    </section>
                    <section class="detail-info" v-if="baseInfo.type !== 1">
                        <label class="detail-info-desc">后端路径:</label>
                        <div class="detail-info-val">{{baseInfo.bgPath}}</div>
                    </section>
                    <section class="detail-info" v-if="baseInfo.type !== 1">
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
                        <div class="detail-info-val">{{baseInfo.apiComments}}</div>
                    </section>
                </div>
                <div class="subscription-policy p-x-l-1">
                    <h4>订阅策略</h4>
                    <h5 class="service-control p-x-r-5">服务控制</h5>
                    <!-- <section class="detail-info">
                        <label class="detail-info-desc">验签</label>
                        <detail-item-edit
                            :isCanEdit="!isVirtual && !isForWatchOrderInfo"
                            :valueObject="editInfo"
                            :valueFields="['verifySign']"
                            paramKey="verifySign"
                            @submit="submit">
                            <span slot="displayValue">{{verifySignDisplayValue}}</span>
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
                            :isCanEdit="!isVirtual || !isForWatchOrderInfo"
                            :valueObject="editInfo"
                            :valueFields="['encryption']"
                            paramKey="encryption"
                            @submit="submit">
                            <span slot="displayValue">{{encryptionDisplayValue}}</span>
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
                            :isCanEdit="!isVirtual && !isForWatchOrderInfo"
                            :valueFields="['antiReplayAttack']"
                            paramKey="antiReplayAttack"
                            @submit="submit">
                            <span slot="displayValue">{{antiReplayAttackDisplayValue}}</span>
                            <i-switch slot="editOption" v-model="editInfo.antiReplayAttack" size="large">
                                <span slot="open">开</span>
                                <span slot="close">关</span>
                            </i-switch>
                        </detail-item-edit>
                    </section> -->
                    <section class="detail-info">
                        <label class="detail-info-desc">并发限制</label>
                        <detail-item-edit
                            :valueObject="editInfo"
                            :isCanEdit="!isForWatchOrderInfo"
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
                                    v-model="editInfo.concurrentLimit"
                                    class="m-x-r-2"
                                    @on-change="concurrentLimitEvent">
                                </InputNumber>
                            </div>
                        </detail-item-edit>
                    </section>
                    <!-- <section class="detail-info">
                        <label class="detail-info-desc">调用总数限制</label>
                        <detail-item-edit
                            :valueObject="editInfo"
                            :isCanEdit="!isVirtual && !isForWatchOrderInfo"
                            :valueFields="['totalRequestsLimit']"
                            paramKey="totalRequestsLimit"
                            @edit="editClick"
                            @cancel="cancelClick"
                            @submit="submit">
                            <span slot="displayValue">{{totalRequestsLimitDisplayValue}}</span>
                            <div slot="editOption">
                                <i-switch v-model="editInfo.totalRequestsLimit" size="large" @on-change="totalRequestsLimitEvent">
                                    <span slot="open">限制</span>
                                    <span slot="close">不限</span>
                                </i-switch>
                                <InputNumber
                                    :precision="0"
                                    :max="9999999"
                                    :min="0"
                                    :step="1"
                                    size="small"
                                    v-model="editInfo.totalRequestsLimit"
                                    v-if="totalRequestsLimitJudge"
                                    @on-change="totalRequestsLimitEvent">
                                </InputNumber>
                            </div>
                        </detail-item-edit>
                    </section> -->
                    <!-- <h5 class="service-control p-x-r-5">时效策略</h5>
                    <section class="detail-info">
                        <label class="detail-info-desc">生效时间</label>
                        <detail-item-edit
                            :valueObject="editInfo"
                            :isCanEdit="isCanEdit && !isForWatchOrderInfo"
                            :valueFields="['subscribeBegin']"
                            paramKey="subscribeBegin"
                            @submit="submit">
                            <span slot="displayValue">{{subscribeBeginDisplayValue}}</span>
                            <Date-picker slot="editOption" :clearable="false" @on-change="datePickerEvent" size="small" type="date" :value="editInfo.subscribeBegin" v-model="editInfo.subscribeBegin" class="m-x-l-2" style="width: 300px;" placeholder="选择日期"></Date-picker>
                        </detail-item-edit>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">有效期</label>
                        <detail-item-edit
                            :valueObject="editInfo"
                            :isCanEdit="isCanEdit && !isForWatchOrderInfo"
                            :valueFields="['subscribeDuration']"
                            paramKey="subscribeDuration"
                            @submit="submit">
                            <span slot="displayValue">{{subscribeDurationDisplayValue}}</span>
                            <div slot="editOption">
                                <Input-number class="m-x-l-2" @on-change="sliderEvent" :precision="0" :max="60" :step="1" :min="1" size="small" v-model="editInfo.subscribeDuration" style="width: 50px;"></Input-number>
                            </div>
                        </detail-item-edit>
                    </section>
                    <section class="detail-info">
                        <label class="detail-info-desc">失效时间:</label>
                        <div class="detail-info-val">{{endTime}}</div>
                    </section> -->
                    <!-- <h5 class="service-control p-x-r-5">
                        计费策略
                        <i-switch
                            class="m-x-l-2"
                            v-model="isfree"
                            size="large"
                            :disabled="!(!isForWatchOrderInfo && isCanEdit)"
                            @on-change="isfreeEvent">
                            <span slot="open">免费</span>
                            <span slot="close">付费</span>
                        </i-switch>
                    </h5>
                    <div class="box" v-if="!isfree">
                        <section class="detail-info">
                            <label class="detail-info-desc">计费类型</label>
                            <detail-item-edit
                                :isCanEdit="isCanEdit && !isForWatchOrderInfo"
                                :valueObject="editInfo"
                                :valueFields="['strategyType']"
                                paramKey="strategyType"
                                @submit="submit">
                                <Tag slot="displayValue" type="border" color="green">{{strategyTypeDisplayValue}}</Tag>
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
                                :isCanEdit="isCanEdit && !isForWatchOrderInfo"
                                :valueObject="editInfo"
                                :valueFields="['strategyBase']"
                                paramKey="strategyBase"
                                @submit="submit">
                                <span slot="displayValue">{{strategyBaseDisplayValue}}</span>
                                <InputNumber slot="editOption" :precision="0" :min="1" :step="1" size="small" v-model="editInfo.strategyBase"></InputNumber>
                            </detail-item-edit>
                        </section>
                        <section class="detail-info">
                            <label class="detail-info-desc">计费段</label>
                            <detail-item-edit
                                :isCanEdit="isCanEdit && !isForWatchOrderInfo"
                                :valueObject="editInfo"
                                :valueFields="['priceRanges']"
                                paramKey="priceRanges"
                                @edit="editClick"
                                @cancel="cancelClick"
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
                                            <Input size="small" style="width: 80px;" type="text" v-model="item.end" placeholder="请输入..." :number="true" :maxlength="10" @on-change="inputAuto(index)"></Input>
                                            <span class="seg-unit">{{ unit }}</span>
                                            <b>，费用：每</b>
                                            <span class="seg-unit">{{ unit }}</span>
                                            <Input size="small" style="width: 80px;" type="text" v-model="item.price" placeholder="请输入..." :number="true" :maxlength="10"></Input>
                                            分
                                            <Button v-show="editInfo.priceRanges.length === index + 1 && editInfo.priceRanges.length !== 1" size="small" type="error" class="del-btn m-x" icon="trash-b" @click="handleRemove(index)"></Button>
                                        </Col>
                                    </Row>
                                    <Row class="p-y-t">
                                        <Col span="24">
                                            <Button type="dashed" long class="add-btn" style="width: 400px;" icon="plus-round" @click="handleAdd">新增</Button>
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
                                :isCanEdit="isCanEdit && !isForWatchOrderInfo"
                                :valueObject="editInfo"
                                :valueFields="['strategyComment']"
                                paramKey="strategyComment"
                                @submit="submit">
                                <span slot="displayValue">{{strategyCommentDisplayValue}}</span>
                                <Input slot="editOption" type="textarea" :autosize="{minRows: 2}" size="small" v-model="editInfo.strategyComment"></Input>
                            </detail-item-edit>
                        </section>
                    </div> -->
                </div>
            </Col>
            <!-- <Col span="8">
                <h4>操作日志</h4>
                <timeline-com :showway="false" :logList="logList"></timeline-com>
                <Button type="text" v-show="true">加载更多</Button>
            </Col> -->
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
            endTime: '',
            isForWatchOrderInfo: false
        }
    },
    computed: {
        unit () {
            return this.editInfo.strategyType === 1 ? '次' : '月'
        },
        isVirtual () {
            return this.baseInfo.type === 1
        },
        serverTypeDisplayValue () {
            let type = this.baseInfo.type
            if (type === 0) {
                return '真实服务'
            } else if (type === 1) {
                return '虚拟服务'
            } else if (type === 2) {
                return '静态资源'
            }
        },
        verifySignDisplayValue () {
            let verifySign = this.editInfo.verifySign
            if (verifySign === 0) {
                return '不验签'
            } else if (verifySign === 1) {
                return '强验签'
            } else if (verifySign === 2) {
                return '弱验签'
            }
        },
        encryptionDisplayValue () {
            return this.editInfo.encryption ? '是' : '否'
        },
        antiReplayAttackDisplayValue () {
            return this.editInfo.antiReplayAttack ? '是' : '否'
        },
        concurrentLimitDisplayValue () {
            return this.editInfo.concurrentLimit > -1 ? this.editInfo.concurrentLimit : '不限'
        },
        totalRequestsLimitDisplayValue () {
            return this.editInfo.totalRequestsLimit > -1 ? this.editInfo.totalRequestsLimit : '不限'
        },
        subscribeBeginDisplayValue () {
            let date = new Date(this.editInfo.subscribeBegin)
            return date.getFullYear() + '-' + `${(date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : `0${(date.getMonth() + 1)}`}` + '-' + `${(date.getMonth()) > 9 ? (date.getDate()) : `0${(date.getDate())}`}`
        },
        subscribeDurationDisplayValue () {
            return this.editInfo.subscribeDuration + '个月'
        },
        strategyTypeDisplayValue () {
            let label = ''
            this.typeList.forEach(e => {
                if (this.editInfo.strategyType === e.value) {
                    label = e.label
                }
            })
            return label
        },
        strategyBaseDisplayValue () {
            return (this.editInfo.strategyBase) + '元'
        },
        strategyCommentDisplayValue () {
            return this.editInfo.strategyComment
        }
    },
    components: {
        detailItemEdit: DetailItem
        // timelineCom: TimelineCom
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
            subconfigApi.updateOrderedAPI(params).then(({body: {result, code, msg}}) => {
            })
            val.onSuccess()
            this.$Message.success({
                content: 'success',
                duration: 5
            })
        },
        editClick (key) {
            if (key === 'priceRanges') {
                this.defaultPrice = this.editInfo.priceRanges ? [...this.editInfo.priceRanges] : []
            }
            if (key === 'concurrentLimit') {
                this.concurrentLimitJudge = this.editInfo.concurrentLimit !== -1
            }
            if (key === 'totalRequestsLimit') {
                this.totalRequestsLimitJudge = this.editInfo.totalRequestsLimit !== -1
            }
        },
        cancelClick (key) {
            if (key === 'concurrentLimit' || key === 'totalRequestsLimit') {
                if (this.editInfo.concurrentLimit === -1) {
                    this.concurrentLimitJudge = false
                }
                if (this.editInfo.totalRequestsLimit === -1) {
                    this.totalRequestsLimitJudge = false
                }
            }
            if (key === 'priceRanges') {
                while (this.editInfo.priceRanges.length > 0) {
                    this.editInfo.priceRanges.shift()
                }
                this.defaultPrice.forEach(i => this.editInfo.priceRanges.push(i))
            }
        },
        getInfoById () {
            let orderId = this.$route.params.orderId
            subconfigApi.getOrderedDetailAPI({
                orderId: orderId
            }).then()
            this.isCanEdit = true
            let result = {
                apiName: 'test api name',
                groupName: 'test groupname',
                apiPath: '/build/build.js',
                apiComments: 'test comments',
                type: 1,
                bgPath: '/config/prod.env.js',
                requestPath: '/doc/constraint.md',
                method: 'get'
            }
            this.baseInfo = result
            this.editInfo = {
                verifySign: result.verifySign,
                encryption: result.encryption,
                antiReplayAttack: result.antiReplayAttack,
                concurrentLimit: result.concurrentLimit,
                totalRequestsLimit: result.totalRequestsLimit,
                subscribeBegin: result.subscribeBegin,
                subscribeDuration: result.subscribeDuration,
                strategyType: result.strategyType,
                strategyBase: result.strategyBase,
                priceRanges: result.priceRanges ? result.priceRanges : [{
                    start: 1,
                    end: -1,
                    price: 0
                }],
                strategyComment: result.strategyComment
            }
            this.isfree = result.free
            let date = new Date(result.subscribeExpire)
            let endtime = date.setMonth(date.getMonth() + 0)
            endtime = new Date(endtime)
            endtime = endtime.setDate(endtime.getDate() - 1)
            let endTime = new Date(endtime)
            this.endTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate()
        },
        handleRemove (index) {
            this.editInfo.priceRanges.splice(index, 1)
        },
        inputAuto (index) {
            if (this.editInfo.priceRanges.length === index + 1) return
            let now = this.editInfo.priceRanges[index].end
            this.editInfo.priceRanges[index + 1].start = now + 1
        },
        handleAdd () {
            let len = this.editInfo.priceRanges.length
            if (this.editInfo.priceRanges[len - 1].end === -1) {
                this.$Message.warning({
                    content: '您输入的值中包含无穷大标识符 -1，不可新增计费段',
                    duration: 5
                })
                return false
            }
            let nowIndex = this.editInfo.priceRanges.length - 1
            if (typeof this.editInfo.priceRanges[nowIndex].end !== 'number') {
                this.$Message.warning({
                    content: '您输入的计费段末尾内容为非正整数，请重新输入',
                    duration: 5
                })
                return false
            }
            if (!this.editInfo.priceRanges[nowIndex].end) {
                this.editInfo.priceRanges.push({
                    start: '',
                    end: '',
                    price: ''
                })
            } else {
                this.editInfo.priceRanges.push({
                    start: this.editInfo.priceRanges[nowIndex].end + 1,
                    end: '',
                    price: ''
                })
            }
        },
        isfreeEvent (val) {
            this.editInfo.strategyType = 2
            this.editInfo.strategyBase = 0
            this.editInfo.priceRanges = [{
                start: 1,
                end: -1,
                price: 0
            }]
            this.editInfo.strategyComment = ''
            let params = {
                id: this.$route.params.orderId,
                free: val,
                strategyType: 2,
                strategyBase: 0,
                priceRanges: [{
                    start: 1,
                    end: -1,
                    price: 0
                }],
                strategyComment: ''
            }
            subconfigApi.updateOrderedAPI(params).then()
            console.log(params)
        },
        sliderEvent (val) {
            let date = new Date(this.editInfo.subscribeBegin)
            let endtime = date.setMonth(date.getMonth() + val)
            endtime = new Date(endtime)
            endtime = endtime.setDate(endtime.getDate() - 1)
            let endTime = new Date(endtime)
            this.endTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate()
        },
        datePickerEvent (val) {
            let date = new Date(val)
            let endtime = date.setMonth(date.getMonth() + this.editInfo.subscribeDuration)
            endtime = new Date(endtime)
            endtime = endtime.setDate(endtime.getDate() - 1)
            let endTime = new Date(endtime)
            this.endTime = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate()
        },
        totalRequestsLimitEvent (val) {
            if (typeof val !== 'number') {
                if (val === false) {
                    this.editInfo.totalRequestsLimit = -1
                } else {
                    this.editInfo.totalRequestsLimit = 1000
                }
            }
        },
        concurrentLimitEvent (val) {
            if (typeof val !== 'number') {
                if (val === false) {
                    this.editInfo.concurrentLimit = -1
                } else {
                    this.editInfo.concurrentLimit = 5
                }
            }
        }
    },
    beforeRouteEnter: (to, from, next) => {
        next(vm => {
            if (to.params.way === 'info') {
                vm.isForWatchOrderInfo = true
            }
        })
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
        this.getInfoById()
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
