<template>
    <div class="edit-strategy">
        <section class="base-info">
            <h5 class="api-base-info">API基础信息</h5>
            <Row class="m-x-l-3 m-y-t-1-5 m-y-b-2">
                <Col :span="8">
                    <label>
                        <span class="base-info-title">API:</span>
                        <span>123</span>
                    </label>
                </Col>
                <Col :span="8">
                    <label>
                        <span class="base-info-title">服务类型:</span>
                        <span>abc</span>
                    </label>
                </Col>
            </Row>
            <Row class="m-x-l-3 m-y-t-1 m-y-b-2">
                <Col :span="8">
                    <label>
                        <span class="base-info-title">路径:</span>
                        <span>123</span>
                    </label>
                </Col>
                <Col :span="8">
                    <label>
                        <span class="base-info-title">后端路径:</span>
                        <span>abc</span>
                    </label>
                </Col>
            </Row>
            <Row class="m-x-l-3 m-y-t-1 m-y-b-2" v-show="false">
                <Col :span="8">
                    <label>
                        <span class="base-info-title">请求路径:</span>
                        <span>123</span>
                    </label>
                </Col>
            </Row>
            <Row class="m-x-l-3 m-y-t-1 m-y-b-2">
                <Col :span="8">
                    <label>
                        <span class="base-info-title">所属服务组:</span>
                        <span>123</span>
                    </label>
                </Col>
                <Col :span="8">
                    <label>
                        <span class="base-info-title">描述:</span>
                        <span>abc</span>
                    </label>
                </Col>
            </Row>
        </section>
        <section class="order-strategy p-y-t">
            <h5 class="api-base-info m-y-b-2">API订阅策略</h5>
            <div class="m-x-l-3 m-y-t-1-5">
                <Form ref="info" :model="editInfo" :label-width="85" label-position="right">
                    <h5 class="m-y-b-1-5">服务控制</h5>
                    <FormItem label="验签" prop="verifySign">
                        <RadioGroup v-model="editInfo.verifySign" type="button" size="small">
                            <Radio :label="0">不验签</Radio>
                            <Radio :label="1">强验签</Radio>
                            <Radio :label="2">弱验签</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="并发限制" prop="concurrentLimit">
                        <i-switch v-model="editInfo.concurrentLimitJudge" size="large">
                            <span slot="open">限制</span>
                            <span slot="close">不限制</span>
                        </i-switch>
                        <InputNumber v-model="editInfo.concurrentLimit" size="small" :max="9999" :min="0" :precision="0" :step="1" v-if="editInfo.concurrentLimitJudge"></InputNumber>
                    </FormItem>
                    <h5 class="m-y-b-1-5">时效策略</h5>
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
                    </h5>
                    <div v-if="!isfree">
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
                                    <Input style="width: 100px" type="text" v-model="item.end" placeholder="请输入..." :number="true" :maxlength="10"></Input>
                                    <span class="seg-unit">
                                        {{unit + '，'}}
                                    </span>
                                    <b>费用：</b>
                                    <span class="seg-unit">
                                        {{'每' + unit}}
                                    </span>
                                    <Input style="width: 100px" type="text" v-model="item.price" placeholder="请输入..." :number="true" :maxlength="10"></Input>分
                                    <Button v-show="editInfo.priceitems.length === index + 1 && editInfo.priceitems.length !== 1" type="error" class="del-btn m-x" :disabled="addBtnShow">删除</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col :span="12">
                                    <Button type="dashed" class="add-btn" long icon="plus-round">新增</Button>
                                    <Alert show-icon style="width: 400px;" class="m-y-t-5">
                                        计费段 末尾值为 -1，代表无限大
                                    </Alert>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem label="备注" prop="strategyComment">
                            <Input type="textarea" style="width: 300px;" v-model="editInfo.strategyComment" placeholder="请输入..." :autosize="{minRows: 2}"></Input>
                        </FormItem>
                    </div>
                </Form>
                <div class="submit-box">
                    <Button type="primary">提交</Button>
                    <Button type="ghost" class="m-x-l-2">返回上一步</Button>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
export default {
    data () {
        return {
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
            addBtnShow: false
        }
    },
    computed: {
        unit () {
            return this.editInfo.type === 1 ? '次' : '月'
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
