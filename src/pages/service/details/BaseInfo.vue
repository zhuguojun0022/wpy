<template>
<div class="service-detials-base p-y">
    <h4 class="title">API详情 <i>{{`(ID: ${apiId})`}}</i></h4>
    <section>
        <detial-item-eidt
            :isCanEdit="isCanEdit"
            :valueObject="apiBaseInfo"
            :valueFields="['name']"
            paramKey="name"
            label="API名称"
            @submit="submitClick">
            <span slot="displayValue">{{nameDisplayValue}}</span>
            <Input slot="editOption" size="small" v-model.trim="apiBaseInfo.name" style="width: 300px;"></Input>
        </detial-item-eidt>
        <detial-item-eidt
            :isCanEdit="false"
            :valueObject="apiBaseInfo"
            :valueFields="['requestPath']"
            paramKey="requestPath"
            label="请求路径">
            <span slot="displayValue">{{requestPathDisplayValue}}</span>
            <Input slot="editOption" size="small" v-model="apiBaseInfo.requestPath" style="width: 300px;"></Input>
        </detial-item-eidt>
        <detial-item-eidt
            :isCanEdit="isCanEdit"
            :valueObject="apiBaseInfo"
            :valueFields="['path']"
            paramKey="path"
            label="前端路径"
            @submit="submitClick">
            <span slot="displayValue">{{pathDisplayValue}}</span>
            <Input slot="editOption" size="small" v-model.trim="apiBaseInfo.path" style="width: 300px;"></Input>
        </detial-item-eidt>
        <detial-item-eidt
            :isCanEdit="isCanEdit"
            :valueObject="apiBaseInfo"
            :valueFields="['bgPath']"
            paramKey="bgPath"
            label="后端路径"
            @submit="submitClick">
            <span slot="displayValue">{{bgPathDisplayValue}}</span>
            <Input slot="editOption" size="small" v-model.trim="apiBaseInfo.bgPath" style="width: 300px;"></Input>
        </detial-item-eidt>
        <detial-item-eidt
            :isCanEdit="isCanEdit"
            :valueObject="apiBaseInfo"
            :valueFields="['method']"
            paramKey="method"
            label="请求方式"
            @submit="submitClick">
            <Tag slot="displayValue" type="border" :color="methodColor">{{methodDisplayValue}}</Tag>
            <Select slot="editOption" :transfer="true" size="small" v-model="apiBaseInfo.method" style="width: 300px;">
                <Option v-for="item in methodslist" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </detial-item-eidt>
        <detial-item-eidt
            :isCanEdit="isCanEdit"
            :valueObject="apiBaseInfo"
            :valueFields="['comments']"
            paramKey="comments"
            label="描述"
            @submit="submitClick">
            <span slot="displayValue">{{commentsDisplayValue}}</span>
            <Input slot="editOption" size="small" v-model="apiBaseInfo.comments" style="width: 300px;"></Input>
        </detial-item-eidt>
    </section>
</div>
</template>

<script>
import DetialItemEidt from '../../../components/form/DetailItem'
import { serviceApi } from '../../../apis'
export default {
    components: {
        DetialItemEidt
    },
    data () {
        return {
            apiId: '',
            isCanEdit: false,
            apiBaseInfo: {},
            methodslist: [
                {label: 'GET', value: 'GET', color: 'blue'},
                {label: 'POST', value: 'POST', color: 'green'},
                {label: 'PUT', value: 'PUT', color: 'green'},
                {label: 'DELETE', value: 'DELETE', color: 'red'}
            ],
            checkApiName: (value) => {
                return value === '' ? {pass: false, msg: 'api名称不能为空！请重新输入'} : {pass: true}
            },
            checkApiPath: (value) => {
                if (!value) {
                    return {pass: false, msg: '路径不能为空！请重新输入'}
                } else if (!/^\//.test(value)) {
                    return {pass: false, msg: '路径必须以 ’/‘ 开头！请重新输入'}
                } else if (/\/$/.test(value)) {
                    return {pass: false, msg: '路径不可以 ’/‘ 结尾！请重新输入'}
                } else if (!/^[^`~!@#$%^&*()+=|{}':;',[\].<>?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]+$/.test(value)) {
                    return {pass: false, msg: '路径不可以包含特殊字符！请重新输入'}
                } else if (!/^[^\u4e00-\u9fa5]+$/.test(value)) {
                    return {pass: false, msg: '路径不可以包含中文字符！请重新输入'}
                } else {
                    return {pass: true}
                }
            }
        }
    },
    computed: {
        methodColor () {
            let color = ''
            this.methodslist.forEach(elem => {
                if (elem.value === this.apiBaseInfo.method) {
                    color = elem.color
                }
            })
            return color
        },
        nameDisplayValue () {
            return this.apiBaseInfo.name
        },
        requestPathDisplayValue () {
            return this.apiBaseInfo.requestPath
        },
        pathDisplayValue () {
            return this.apiBaseInfo.path
        },
        bgPathDisplayValue () {
            return this.apiBaseInfo.bgPath
        },
        methodDisplayValue () {
            return this.apiBaseInfo.method
        },
        commentsDisplayValue () {
            return this.apiBaseInfo.comments
        }
    },
    created () {
        this.apiId = this.$route.params.id
        this.getApiInfoById()
    },
    methods: {
        submitClick (val) {
            let [key, value] = [val.key, this.apiBaseInfo[val.valueFields[0]]]
            // 参数校验
            if (key === 'name') {
                let nameCheck = this.checkApiName(value)
                if (!nameCheck.pass) {
                    this.$Message.warning({
                        content: nameCheck.msg,
                        duration: 2
                    })
                    return null
                }
            } else if (key === 'path' || key === 'bgPath') {
                let pathCheck = this.checkApiPath(value)
                if (!pathCheck.pass) {
                    this.$Message.warning({
                        content: pathCheck.msg,
                        duration: 2
                    })
                    return null
                }
            }
            // 接口传参
            let param = {
                id: this.apiId,
                serviceGroupId: this.apiBaseInfo.serviceGroupId
            }
            param[key] = value
            // 接口调用
            serviceApi.updateAPI(param).then(({data: {msg, result, resultCode}}) => {
                if (resultCode === '000000') {
                    val.onSuccess()
                    if (key === 'path' || key === 'bgPath') {
                        this.apiBaseInfo.requestPath = result.requestPath
                    }
                    this.$Message.success(msg)
                } else {
                    this.$Message.warning(msg)
                }
            })
        },
        getApiInfoById () {
            serviceApi.getAPIInfo(this.apiId).then(({data: {msg, result, resultCode}}) => {
                if (resultCode === '000000') {
                    this.isCanEdit = result.lifecycle !== 4
                    this.apiBaseInfo = {
                        ...result
                    }
                } else {
                    this.$Message.warning(msg)
                }
            })
        }
    }
}
</script>

<style lang="less">

</style>
