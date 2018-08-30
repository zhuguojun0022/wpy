<template>
    <GPage bg>
        <table-header>
            <template slot="left">
      <span>省份</span>
      <Select v-model="addDetail.REGIONPROVINCE" name="REGION_PROVINCE" @on-change="handleMockdel" style="width: 180px" placeholder="全部" clearable>
          <Option v-for="item of prov" :key="item.id" :value="item.REGIONPROVINCE">{{item.REGIONPROVINCE}}</Option>
      </Select>
      <span>城市</span>
      <Select v-model="addDetail.REGIONNAME" name="REGION_NAME" @on-change="handleMockdele" style="width: 180px" placeholder="全部" clearable>
          <Option v-for="item of city" :value="item.REGIONNAME" :key="item.id">{{item.REGIONNAME}}</Option>
      </Select>
      <span>渠道</span>
      <Input v-model="channelParameter" placeholder="渠道名称" style="width: 180px"></Input>
      <span>时间</span>
      <Input v-model="dataParameter" :placeholder='dataDefault' style="width: 180px" clearable></Input>
      </template>
       <template slot="right">
      <Button type="primary" @click="onSearchClick">查询</Button>
      <Button type="primary"  @click="exportData(1)">下载</Button>
      </template>
      </table-header>
      <Table :columns="columns8" :data="data7"  ref="table"></Table>
    </GPage >
</template>

<script>
import { infraApi } from '../../../apis'
import {TableHeader} from '../../../components/table'
import {mapMutations} from 'vuex'
export default {
    components: {TableHeader},
    data () {
        return {
            columns8: [
                {
                    title: '地区',
                    key: 'PROVINCE',
                    width: 100
                },
                {
                    title: '发卡地区',
                    key: 'CITY',
                    width: 100
                },
                {
                    title: '渠道名称',
                    key: 'AAZ571',
                    width: 100
                },
                {
                    title: '1',
                    key: '01',
                    width: 60
                },
                {
                    title: '2',
                    key: '02',
                    width: 60
                },
                {
                    title: '3',
                    key: '03',
                    width: 60
                },
                {
                    title: '4',
                    key: '04',
                    width: 60
                },
                {
                    title: '5',
                    key: '05',
                    width: 60
                },
                {
                    title: '6',
                    key: '06',
                    width: 60
                },
                {
                    title: '7',
                    key: '07',
                    width: 60
                },
                {
                    title: '8',
                    key: '08',
                    width: 60
                },
                {
                    title: '9',
                    key: '09',
                    width: 60
                },
                {
                    title: '10',
                    key: '10',
                    width: 60
                },
                {
                    title: '11',
                    key: '11',
                    width: 60
                },
                {
                    title: '12',
                    key: '12',
                    width: 60
                },
                {
                    title: '13',
                    key: '13',
                    width: 60
                },
                {
                    title: '14',
                    key: '14',
                    width: 60
                },
                {
                    title: '15',
                    key: '15',
                    width: 60
                },
                {
                    title: '16',
                    key: '16',
                    width: 60
                },
                {
                    title: '17',
                    key: '17',
                    width: 60
                },
                {
                    title: '18',
                    key: '18',
                    width: 60
                },
                {
                    title: '19',
                    key: '19',
                    width: 60
                },
                {
                    title: '20',
                    key: '20',
                    width: 60
                },
                {
                    title: '22',
                    key: '22',
                    width: 60
                },
                {
                    title: '23',
                    key: '23',
                    width: 60
                },
                {
                    title: '24',
                    key: '24',
                    width: 60
                },
                {
                    title: '25',
                    key: '25',
                    width: 60
                },
                {
                    title: '26',
                    key: '26',
                    width: 60
                },
                {
                    title: '27',
                    key: '27',
                    width: 60
                },
                {
                    title: '28',
                    key: '28',
                    width: 60
                },
                {
                    title: '29',
                    key: '29',
                    width: 60
                },
                {
                    title: '30',
                    key: '30',
                    width: 60
                },
                {
                    title: '31',
                    key: '31',
                    width: 60
                }
            ],
            data7: [],
            provinceData: [],
            addDetail: {},
            editlist: false,
            prov: [],
            city: [],
            provinceParameter: '',
            cityParameter: '',
            channelParameter: '',
            dataParameter: '',
            dataDefault: ''
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            vm.resetBreadcrumb({
                name: '统计查询',
                icon: 'icon-zonghechaxun'
            })
        })
    },
    mounted () {
        infraApi.getInquire().then(res => {
            const data = res.data
            this.prov = data.result
        })
        infraApi.getList().then(res => {
            const data = res.data
            this.newsList = data.result
        })
        infraApi.Statist('', '', '', '').then(res => {
            const data = res.data
            this.data7 = data.result
        })
        this.addTodo()
    },
    methods: {
        ...mapMutations(['resetBreadcrumb', 'openLoading', 'closeLoading']),
        onSearchClick () {
            infraApi.Statist(this.provinceParameter, this.cityParameter, this.channelParameter, this.dataParameter).then(res => {
                let datas = res.data
                this.data7 = datas.result
                // this.provinceParameter = ''
                // this.cityParameter = ''
                // this.channelParameter = ''
                // this.dataParameter = ''
            })
        },
        addTodo () {
            let cd = new Date()
            this.dataDefault = cd.getFullYear() + this.$options.methods.zeroPadding(cd.getMonth() + 1, 2)
        },
        zeroPadding (num, digit) {
            var zero = ''
            for (let i = 0; i < digit; i++) {
                zero += '0'
            }
            return (zero + num).slice(-digit)
        },
        handleMockdel (val) {
            this.provinceParameter = ''
            for (let i = 0; i < this.prov.length; i++) {
                if (this.prov[i].REGIONPROVINCE === this.addDetail.REGIONPROVINCE) {
                    this.provinceParameter = this.prov[i].REGIONNO
                    this.addDetail.REGIONNO = this.prov[i].REGIONNO
                    this.getCitylist(this.prov[i].REGIONNO)
                }
            }
        },
        getCitylist (a) {
            infraApi.getCity(a).then(res => {
                const data = res.data
                this.city = data.result
            })
        },
        handleMockdele (val) {
            this.cityParameter = ''
            for (let i = 0; i < this.city.length; i++) {
                if (this.city[i].REGIONNAME === this.addDetail.REGIONNAME) {
                    this.cityParameter = this.city[i].REGIONID
                    this.addDetail.REGIONID = this.city[i].REGIONID
                }
            }
        },
        exportData (type) {
            if (type === 1) {
                this.$refs.table.exportCsv({
                    filename: '统计表'
                })
            }
        }
    }
}
</script>

<style scoped>
.statis {
  width: 100%;
  height: 100%;
  overflow: auto;
}
span {
  display: inline-block;
  width: 30px;
  text-align: center;
  font-size: 14px;
  line-height: 32px;
  height: 32px;
}
</style>
