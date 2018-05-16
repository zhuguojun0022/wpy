<template>
<Row class="region-select">
    <Col span="12">
        <Select v-model="province" clearable placeholder="选择省份" @on-change="onProvinceChange">
            <Option v-for="item in provinces" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
    </Col>
    <Col span="12">
        <Select v-model="city" clearable placeholder="选择市" @on-change="onCityChange">
            <Option v-for="item in cities" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
    </Col>
</Row>
</template>
<script>
import {Select, Row, Col} from 'iview'
import {infosApi} from '../apis/index'
import {dataMap} from '../common/utils/'
const REGION_MAP = {id: 'value', name: 'label'}
let provinces = []
export default {
    components: {Select, Row, Col},
    props: {
        value: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            provinces: [],
            province: '',
            cities: [],
            city: ''
        }
    },
    watch: {
        value () {
            if (!this.value || !this.value.length) {
                this.city = ''
                this.province = ''
                return
            }
            if (this.value.length >= 1) {
                this.province = this.value[0]
            }
            if (this.value.length === 2) {
                this.city = this.value[1]
            } else {
                this.city = ''
            }
        }
    },
    beforeMount () {
        if (!provinces || !provinces.length) {
            infosApi.getAllAvailableProvinces().then(({data: {result}}) => {
                this.provinces = dataMap(REGION_MAP, result)
                provinces = this.provinces
            })
        } else {
            this.provinces = provinces
        }
    },
    methods: {
        loadCities () {
            infosApi.getAvailableCities(this.province).then(({data: {result}}) => {
                this.cities = dataMap(REGION_MAP, result)
            })
        },
        emitChange () {
            this.$emit('on-change', [this.province, this.city])
        },
        onProvinceChange () {
            if (!this.province) {
            } else {
                this.loadCities()
            }
            this.emitChange()
        },
        onCityChange () {
            this.emitChange()
        }
    }
}
</script>
<style lang="less">
.region-select {
    .ivu-col:first-child {
        padding-right: 3px;
    }
    .ivu-col:last-child {
        padding-left: 3px;
    }
}
</style>
