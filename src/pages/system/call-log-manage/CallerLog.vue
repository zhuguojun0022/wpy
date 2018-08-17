<template>
    <section>
        <Form :model="searchValue" inline>
            <FormItem prop="startTime" class="m-x-r search-condition">
                <label class="required-search m-x-r">开始时间:</label>
                <Date-picker transfer :clearable="false" confirm v-model="searchValue.startTime" class="m-x" size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择开始时间" style="width: 216px"></Date-picker>
            </FormItem>
            <FormItem v-if="isCustomized" prop="endTime" class="m-x-r search-condition">
                <label class="required-search m-x-r">结束时间:</label>
                <Date-picker transfer :clearable="false" confirm v-model="searchValue.endTime" class="m-x" size="small" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择结束时间" style="width: 216px"></Date-picker>
            </FormItem>
            <FormItem v-if="!isCustomized" prop="endTime" class="m-x-r search-condition">
                <label class="required-search m-x-r">有效时间:</label>
                <Select v-model="searchValue.timeFrame" transfer class="m-x" placeholder="请选择有效时间" size="small" clearable style="width: 216px">
                    <Option v-for="item in timeFrameList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem class="search-condition">
                <Checkbox v-model="isCustomized">自定义结束时间</Checkbox>
            </FormItem>
            <FormItem prop="apiName" class="m-x search-condition">
                <label class="search-title m-x-r">API名称:</label>
                <Select
                    v-if="isAdmin"
                    v-model="applySelect"
                    placeholder="请搜索应用"
                    style="width: 200px"
                    size="small"
                    filterable
                    clearable
                    remote
                    :transfer="true"
                    :remote-method="matchAppEvent"
                    :loading="findLoading">
                    <Option v-for="item in applyData" :value="item.appId" :key="item.appId">{{item.appName}}</Option>
                </Select>
                <Select v-model="searchValue.apiSelected" placeholder="请选择api" size="small" clearable style="width: 200px">
                    <Option v-for="item in apiData" :value="item.apiId" :key="item.apiId">{{ item.apiName }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="caller" class="m-x-r-2 search-condition" v-if="publish">
                <label class="search-title m-x-r">&nbsp;&nbsp;&nbsp;&nbsp;调用者:</label>
                <Select
                    v-if="!isAdmin && publish"
                    v-model="searchValue.caller"
                    style="width: 140px"
                    size="small"
                    clearable
                    transfer>
                    <Option v-for="(item) in filterCallerListData" :value="item.appKey" :key="item.appKey">{{item.name}}</Option>
                </Select>
                <Select
                    v-if="isAdmin"
                    v-model="searchValue.caller"
                    placeholder="请搜索应用"
                    style="width: 200px"
                    size="small"
                    filterable
                    clearable
                    remote
                    :transfer="true"
                    :remote-method="matchAppEvent"
                    :loading="findLoading">
                    <Option v-for="item in callerList" :value="item.appKey" :key="item.appKey">{{ item.apiName }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="returnCode" class="m-x-r search-condition">
                <label class="search-title m-x-r">&nbsp;&nbsp;&nbsp;返回码:</label>
                <Select
                    transfer
                    v-model="searchValue.returnCode"
                    placeholder="请选择返回码"
                    size="small"
                    style="width: 260px">
                    <Option v-for="item in codeList" :value="item.code" :key="item.code">{{ item.msg }}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" size="small" @click="searchClick">查询</Button>
            </FormItem>
        </Form>
        <Table size="small" :columns="columns" :data="tableData" style="width: 100%"></Table>
    </section>
</template>
<script>
export default {
    data () {
        return {
            findLoading: false,
            searchValue: {},
            isCustomized: true,
            timeFrameList: [],
            applySelect: '',
            isAdmin: false,
            applyData: [],
            apiData: [],
            publish: true,
            filterCallerListData: [],
            callerList: [],
            codeList: [],
            tableData: [],
            columns: [{
                title: '请求ID',
                key: 'reqId',
                width: 200
            }, {
                title: '调用者名称',
                key: 'callerName'
            }, {
                title: 'API名称',
                render: (h, {columns, index, row}) => {
                    return h('div', [
                        h('Button', {props: {type: 'primary', style: {paddingLeft: '0px'}}}, [
                            h('Tooltip', {
                                props: {
                                    content: '请求url：' + (row.url || '无'),
                                    placement: 'top',
                                    style: {
                                        wordBreak: 'break-all',
                                        wordWrap: 'break-word'
                                    }
                                }
                            }, row.apiName)
                        ])
                    ])
                }
            }, {
                title: '时间',
                key: 'starttime'
            }]
        }
    },
    methods: {
        searchClick () {

        },
        matchAppEvent (name) {
            if (name.length < 1) {
                return false
            }
        }
    }
}
</script>
