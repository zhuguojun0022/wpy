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
            <h5 class="api-base-info m-y-b-2">API订阅策略</h5>
            <div class="m-x-l-3 m-y-t-1-5">
                <Form ref="info" :model="editInfo" :label-width="85" label-position="right">
                    <h5 class="m-y-b-1-5">服务控制</h5>
                    <!-- <FormItem label="验签" prop="verifySign">
                        <RadioGroup v-model="editInfo.verifySign" type="button" size="small">
                            <Radio :disabled="baseInfo.virtual" :label="0">不验签</Radio>
                            <Radio :disabled="baseInfo.virtual" :label="1">强验签</Radio>
                            <Radio :disabled="baseInfo.virtual" :label="2">弱验签</Radio>
                        </RadioGroup>
                    </FormItem> -->
                    <FormItem label="并发限制" prop="concurrentLimit">
                        <i-switch v-model="editInfo.concurrentLimitJudge" @on-change="concurrentLimitJudgeSwitchChange" style="width: 70px" size="large">
                            <span slot="open">限制</span>
                            <span slot="close">不限制</span>
                        </i-switch>
                        <InputNumber v-model="editInfo.concurrentLimit" size="small" :max="9999" :min="0" :precision="0" :step="1" v-if="editInfo.concurrentLimitJudge"></InputNumber>
                    </FormItem>
                    <!-- <h5 class="m-y-b-1-5">时效策略</h5>
                    <FormItem label="生效时间" prop="startTime">
                        <Date-picker :value="editInfo.startTime" v-model="editInfo.startTime" type="date" placeholder="选择日期" style="width: 300px;"></Date-picker>
                    </FormItem>
                    <FormItem label="有效时限" prop="time">
                        <InputNumber size="small" :max="60" :min="0" :precision="0" :step="1" v-model="editInfo.time"></InputNumber>
                        <div class="silder-inline" style="width: 40px;">
                            <label>个月</label>
                        </div>
                    </FormItem>
                    <FormItem label="失效时间" prop="startTime">
                        <Date-picker v-model="editInfo.endTime" type="date" placeholder="选择日期" style="width: 300px;" disabled></Date-picker>
                    </FormItem>
                    <h5 class="m-y-b-1-5">
                        计费策略
                        <i-switch class="m-x-l-2" v-model="isfree" size="large">
                            <span slot="open">免费</span>
                            <span slot="close">付费</span>
                        </i-switch>
                    </h5> -->
                    <!-- <div v-if="!isfree">
                        <FormItem label="计费类型" prop="type">
                            <Select v-model="editInfo.type" style="width: 200px;">
                                <Option v-for="item in typeList" :value="item.value" :key="item.value">
                                    {{ item.label }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="基础付费" prop="baseprice">
                            <Input type="text" style="width: 200px;" v-model="editInfo.baseprice" placeholder="请输入..." :number="true" :maxlength="9"></Input>元
                        </FormItem>
                        <FormItem label="计费段" prop="priceitems">
                            <Row class="m-y-b-1" v-for="(item, index) in editInfo.priceitems" :key="index">
                                <Col :span="24">
                                    <Input style="width: 100px" readonly type="text" v-model="item.start" placeholder="请输入..." :number="true" :maxlength="10"></Input>~
                                    <Input style="width: 100px" @on-change="inputAuto(index)" type="text" v-model="item.end" placeholder="请输入..." :number="true" :maxlength="10"></Input>
                                    <span class="seg-unit">
                                        {{unit + '，'}}
                                    </span>
                                    <b>费用：</b>
                                    <span class="seg-unit">
                                        {{'每' + unit}}
                                    </span>
                                    <Input style="width: 100px" type="text" v-model="item.price" placeholder="请输入..." :number="true" :maxlength="10"></Input>分
                                    <Button
                                        v-show="editInfo.priceitems.length === index + 1 && editInfo.priceitems.length !== 1"
                                        type="error"
                                        class="del-btn m-x"
                                        :disabled="addBtnShow"
                                        @click="handleRemove(index)">
                                        删除
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col :span="12">
                                    <Button type="dashed" class="add-btn" long icon="plus-round" @click="handleAdd">新增</Button>
                                    <Alert show-icon style="width: 400px;" class="m-y-t-5">
                                        计费段 末尾值为 -1，代表无限大
                                    </Alert>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem label="备注" prop="strategyComment">
                            <Input type="textarea" style="width: 300px;" v-model="editInfo.strategyComment" placeholder="请输入..." :autosize="{minRows: 2}"></Input>
                        </FormItem>
                    </div> -->
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
        let startTime = (rule, value, callback) => {
            if (!value) {
                callback(new Error('生效时间不能为空'))
            } else {
                callback()
            }
        }
        let time = (rule, value, callback) => {
            if (!/^[1-9]\d*$/.test(value)) {
                callback(new Error('有效时间只能为整数'))
            } else {
                callback()
            }
        }
        let type = (rule, value, callback) => {
            if (!value) {
                callback(new Error('计费类型不能为空'))
            } else {
                callback()
            }
        }
        let baseprice = (rule, value, callback) => {
            if (typeof value !== 'number' && !value) {
                callback(new Error('基础付费不可为空'))
            } else if (isNaN(value)) {
                callback(new Error('基础付费只能为数字'))
            } else if (!/^[0-9]\d*$/.test(value)) {
                callback(new Error('基础付费只能为大于等于0的整数'))
            } else {
                callback()
            }
        }
        let priceitems = (rule, value, callback) => {
            for (let p = 0; p < value.length; p++) {
                let elem = value[p]
                if (typeof elem.end === 'string' || elem.end === 0) {
                    callback(new Error('计费段中末尾值输入框均不可为空或0'))
                    break
                } else {
                    if (!/^[1-9]\d*$/.test(elem.start) || !/^[1-9]\d*$/.test(elem.end)) {
                        if (!(p + 1 === value.length && elem.end === -1)) {
                            callback(new Error('计费段中除最后一行的末尾值外，输入框均为正整数'))
                            break
                        } else if (!/^[1-9]\d*$/.test(elem.price)) {
                            callback(new Error('计费段中费用的值必须为大于等于0的整数'))
                            break
                        } else {
                            callback()
                            break
                        }
                    } else if (elem.price !== 0 && !/^[1-9]\d*$/.test(elem.price)) {
                        callback(new Error('计算段中价钱输入框为非负数'))
                        break
                    } else if (elem.start > elem.end) {
                        callback(new Error('计算段中末尾值必须大于等于开始值'))
                        break
                    } else {
                        callback()
                    }
                }
            }
        }
        return {
            rules: {
                startTime: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: startTime
                    }
                ],
                time: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: time
                    }
                ],
                type: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: type
                    }
                ],
                baseprice: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: baseprice
                    }
                ],
                priceitems: [
                    {
                        required: true,
                        trigger: 'blur',
                        validator: priceitems
                    }
                ]
            },
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
                verifySign: 1,
                concurrentLimitJudge: false,
                startTime: '',
                time: 0,
                endTime: '',
                type: '',
                baseprice: '',
                priceitems: [{
                    start: 1,
                    end: '',
                    price: ''
                }],
                strategyComment: ''
            },
            isfree: true,
            typeList: [{
                label: '按月',
                value: 2
            }, {
                label: '按次',
                value: 1
            }],
            addBtnShow: false,
            goBackTitle: '返回上一步',
            title: '1'
        }
    },
    mounted () {
        if (this.$route.name === 'addOrder') {
            this.baseInfo = {
                name: this.apiInfo.name,
                serviceGroup: this.apiInfo.groupName,
                path: this.apiInfo.path,
                des: this.apiInfo.comments,
                requestPath: this.apiInfo.requestPath,
                virtual: this.apiInfo.virtual,
                bgPath: this.apiInfo.bgPath
            }
        } else {
            this.goBackTitle = '取消'
            this.title = '2'
            this.getinfoById()
        }
    },
    computed: {
        unit () {
            return this.editInfo.type === 1 ? '次' : '月'
        },
        ...mapGetters({
            apiInfo: 'apiInfo',
            channelInfo: 'channelInfo'
        })
    },
    methods: {
        ...mapMutations(['pushBreadcrumb', 'openLoading', 'closeLoading', 'setStep', 'gobackStep']),
        submit () {
            this.$refs['info'].validate((valid) => {
                if (valid) {
                    let date = new Date(this.editInfo.startTime)
                    let commonTime = date.setMonth(date.getMonth() + 0)
                    let callerId = this.$route.params.callerId
                    let params = {
                        callerId: callerId,
                        apiId: this.apiInfo.id,
                        subscribeBegin: commonTime,
                        subscribeDuration: this.editInfo.time,
                        threadsPool: 1,
                        verifySign: this.editInfo.verifySign,
                        encryption: this.editInfo.encryption,
                        antiReplayAttack: this.editInfo.antiReplayAttack,
                        concurrentLimit: this.editInfo.concurrentLimit,
                        totalRequestsLimit: this.editInfo.totalRequestsLimit
                    }
                    if (!this.isfree) {
                        let value = this.isfree.priceitems
                        for (let p = 0; p < value.length; p++) {
                            let elem = value[p]
                            if (typeof elem.end === 'string' || elem.end === 0) {
                                this.$Message.error({
                                    content: '计费段中末尾值输入框均不可为空或0',
                                    duration: 5
                                })
                                return false
                            } else {
                                if (!/^[1-9]\d*$/.test(elem.start) || !/^[1-9]\d*$/.test(elem.end)) {
                                    if (!(p + 1 === value.length && elem.end === -1)) {
                                        this.$Message.error({
                                            content: '计费段中除最后一行的末尾值外，输入框均为正整数',
                                            duration: 5
                                        })
                                        return false
                                    }
                                } else if (elem.price !== 0 && !/^[1-9]\d*$/.test(elem.price)) {
                                    this.$Message.error({
                                        content: '计费段中价钱输入框为非负整数',
                                        duration: 5
                                    })
                                    return false
                                } else if (elem.start > elem.end) {
                                    this.$Message.error({
                                        content: '计费段中末尾值必须大于等于开始值',
                                        duration: 5
                                    })
                                    return false
                                }
                            }
                        }
                        params = {
                            ...params,
                            free: this.isfree,
                            strategyBase: this.editInfo.baseprice * 100,
                            strategyType: this.editInfo.type,
                            priceRanges: this.editInfo.priceitems,
                            strategyComment: this.editInfo.strategyComment
                        }
                    } else {
                        params = {
                            ...params,
                            free: this.isfree,
                            strategyType: 2,
                            strategyBase: 0,
                            priceRanges: [{
                                start: 1,
                                end: -1,
                                price: 0
                            }],
                            strategyComment: ''
                        }
                    }
                    console.log(params)
                    subconfigApi.addOrderedAPI(params).then(() => {
                    })
                    this.setStep()
                } else {
                    this.$Message.error({
                        content: '您当前的填写有误，请检查后再试',
                        duration: 5
                    })
                }
            })
        },
        getinfoById () {
            let orderId = this.$route.params.orderId
            subconfigApi.getOrderedDetailAPI({
                id: orderId
            }).then()
            let result = {
                apiName: '测试123',
                groupName: 'groupName',
                path: '/www/w123/eerrr',
                des: 'this is a des',
                requestPath: '/www/oiioo/poop',
                virtual: true,
                bgPath: '/config/index.js',
                verifySign: '123123',
                encryption: 'ppp123',
                antiReplayAttack: '132',
                concurrentLimitJudge: -1,
                concurrentLimit: '1',
                totalRequestsLimit: '1',
                strategyType: 'type1',
                strategyBase: 2000,
                priceRanges: [],
                strategyComment: 'des 123 nihao',
                free: false
            }
            this.baseInfo = {
                name: result.apiName,
                serviceGroup: result.groupName,
                path: result.path,
                des: result.apiComments,
                requestPath: result.requestPath,
                virtual: result.virtual,
                bgPath: result.bgPath
            }
            this.editInfo.verifySign = result.verifySign
            this.editInfo.encryption = result.encryption
            this.editInfo.antiReplayAttack = result.antiReplayAttack
            this.editInfo.concurrentLimitJudge = result.concurrentLimitJudge !== -1
            this.editInfo.concurrentLimit = result.concurrentLimit
            this.editInfo.totalRequestsLimit = result.totalRequestsLimit
            this.editInfo.type = result.strategyType
            this.editInfo.baseprice = result.strategyBase / 100
            this.editInfo.priceitems = result.priceRanges
            this.editInfo.strategyComment = result.strategyComment
            this.isfree = result.free
        },
        goBack (title) {
            if (title === '1') {
                this.$refs['info'].resetFields()
                this.gobackStep()
            } else {
                this.$router.go(-1)
            }
        },
        handleAdd () {
            let len = this.editInfo.priceitems.length
            if (this.editInfo.priceitems[len - 1].end === -1) {
                this.$Message.warning({
                    content: '您输入的值中包含无穷大标识符 -1，不可新增计费段',
                    duration: 5
                })
                return false
            }
            let nowIndex = this.editInfo.priceRanges.length - 1
            if (typeof this.editInfo.priceitems[nowIndex].end !== 'number') {
                this.$Message.warning({
                    content: '您输入的计费段末尾内容为非正整数，请重新输入',
                    duration: 5
                })
                return false
            }
            if (!this.editInfo.priceitems[nowIndex].end) {
                this.editInfo.priceitems.push({
                    start: '',
                    end: '',
                    price: ''
                })
            } else {
                this.editInfo.priceitems.push({
                    start: this.editInfo.priceitems[nowIndex].end + 1,
                    end: '',
                    price: ''
                })
            }
        },
        handleRemove (index) {
            this.editInfo.priceitems.splice(index, 1)
        },
        inputAuto (index) {
            if (this.editInfo.priceitems.length === index + 1) return
            let now = this.editInfo.priceitems[index].end
            this.editInfo.priceitems[index + 1].start = now + 1
        },
        concurrentLimitJudgeSwitchChange (val) {
            if (val === false) {
                this.editInfo.concurrentLimit = -1
            } else {
                this.editInfo.concurrentLimit = 5
            }
        }
    },
    watch: {
        'editInfo.startTime' (val) {
            if (!val) {
                this.editInfo.endTime = ''
                return
            }
            let date = new Date(val)
            let endTime = date.setMonth(date.getMonth() + this.editInfo.time)
            let _endtime = new Date(endTime)
            _endtime = _endtime.setDate(_endtime.getDate() - 1)
            this.editInfo.endTime = new Date(_endtime)
        },
        'editInfo.time' (val) {
            let date = new Date(this.editInfo.startTime)
            let endTime = date.setMonth(date.getMonth() + val)
            let _endtime = new Date(endTime)
            _endtime = _endtime.setDate(_endtime.getDate() - 1)
            this.editInfo.endTime = new Date(_endtime)
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
