<template>
   <GPage bg>
      <span>省份</span>
      <select v-model="addDetail.REGIONPROVINCE" name="REGION_PROVINCE" @change="handleMockdel">
          <option v-for="item of prov" :key="item.id" :value="item.REGIONPROVINCE">{{item.REGIONPROVINCE}}</option>
      </select>
      <span>城市</span>
      <select v-model="addDetail.REGIONNAME" name="REGION_NAME" @change="handleMockdele">
          <option v-for="item of city" :value="item.REGIONNAME" :key="item.id">{{item.REGIONNAME}}</option>
      </select>
       <span>经度</span>
      <input type="text" @input="handleChangeInput" value="val" v-model="addDetail.longitude">
       <span>纬度</span>
      <input type="text" @input="handleChangeInputow" value="val" v-model="addDetail.latitude">
      <button @click="handleBtn">保存</button>
    <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <td>省份</td>
                <td>城市</td>
                <td>经度</td>
                <td>纬度</td>
                <td>操作</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item of newsList" :key="item.id">
                <td width="10%">{{item.REGIONPROVINCE}}</td>
                <td width="10%">{{item.REGIONNAME}}</td>
                <td width="10%">{{item.LONGITUDE}}</td>
                <td width="10%">{{item.LATITUDE}}</td>
                <td width="5%" class="edits">
                    <em class="edit" @click="edit(item)">编辑</em>
                    <em class="delete" @click="handleDelete(item.REGIONID)">删除</em>
                </td>
            </tr>
        </tbody>
    </table>
    <div id="mask" v-if="editlist">
        <div class="mask">
            <div class="title">
                编辑
                <span @click="editlist=false" class="close">
                    X
                </span>
            </div>
            <div class="content">
                <div>
                <span>经度</span>
                <input type="text" @input="handleChangeInput" value="val" v-model="addDetail.longitude">
                </div>
                <div>
                <span>纬度</span>
                <input type="text" @input="handleChangeInputow" value="val" v-model="addDetail.latitude">
                </div>
                <div id="btn">
                <button @click="update" class="update">更新</button>
                <button @click="editlist=false" class="editle">取消</button>
                </div>
            </div>
        </div>
    </div>
</GPage>
</template>

<script>
import {infraApi} from '../../../apis'
export default {
    data () {
        return {
            addDetail: {},
            editlist: false,
            prov: [],
            city: [],
            newsList: [],
            val: '',
            longitude: false,
            latitude: false,
            diquId: ''
        }
    },
    mounted () {
        infraApi.getInquire().then((res) => {
            console.log(res)
            const data = res.data
            this.prov = data.result
            console.log(this.prov)
        })
        infraApi.getList().then((res) => {
            console.log(res)
            const data = res.data
            this.newsList = data.result
        })
    },
    methods: {
        handleMockdel (val) {
            for (let i = 0; i < this.prov.length; i++) {
                if (this.prov[i].REGIONPROVINCE === this.addDetail.REGIONPROVINCE) {
                    console.log(this.prov[i].REGIONNO)
                    this.addDetail.REGIONNO = this.prov[i].REGIONNO
                    this.getCitylist(this.prov[i].REGIONNO)
                }
            }
        },
        getCitylist (a) {
            console.log(a)
            infraApi.getCity(a).then((res) => {
                console.log(res)
                const data = res.data
                this.city = data.result
                console.log(this.city)
            })
        },
        handleMockdele (val) {
            for (let i = 0; i < this.city.length; i++) {
                if (this.city[i].REGIONNAME === this.addDetail.REGIONNAME) {
                    console.log(this.city[i].REGIONID)
                    this.addDetail.REGIONID = this.city[i].REGIONID
                }
            }
            console.log(this.addDetail.REGIONNAME)
        },
        handleBtn () {
            if (!this.addDetail.REGIONPROVINCE) {
                this.$Message.warning('请选择省份')
            } else if (!this.addDetail.REGIONNAME) {
                this.$Message.warning('请选择城市')
            } else if (!this.longitude) {
                this.$Message.warning('请输入正确的中国经度')
            } else if (!this.latitude) {
                this.$Message.warning('请输入正确的中国纬度')
            } else {
                infraApi.Save(this.addDetail.REGIONID, this.addDetail.REGIONPROVINCE, this.addDetail.REGIONNAME, this.addDetail.longitude, this.addDetail.latitude, sessionStorage.getItem('USERID')).then((res) => {
                    console.log(res)
                    if (res.status === 200) {
                        infraApi.getList().then((res) => {
                            const data = res.data
                            this.newsList = data.result
                        })
                        this.addDetail.REGIONPROVINCE = ''
                        this.addDetail.REGIONNAME = ''
                        this.addDetail.longitude = ''
                        this.addDetail.latitude = ''
                    } else {
                        this.$Message.warning(res.data.msg)
                    }
                })
            }
        },
        handleChangeInput (e) {
            let regex = /^[-+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/
            if (regex.test(e.target.value)) {
                if (e.target.value > 73.33 && e.target.value < 135.05) {
                    this.longitude = true
                    return true
                }
            } else {
                this.longitude = false
                return false
            }
        },
        handleChangeInputow (e) {
            let regex = /^[-+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/
            if (regex.test(e.target.value)) {
                if (e.target.value > 3.15 && e.target.value < 53.33) {
                    this.latitude = true
                    return true
                }
            } else {
                this.latitude = false
                return false
            }
        },
        edit (item) {
            // console.log(item)
            this.editlist = true
            // console.log(item.REGIONID)
            // console.log(item.REGIONPROVINCE)
            // console.log(item.REGIONNAME)
            this.addDetail.REGIONNO = item.REGIONID
        },
        handleDelete (REGIONID) {
            console.log(REGIONID)
            infraApi.Delete(REGIONID).then((res) => {
                if (res.data.resultCode === '000000') {
                    infraApi.getList().then((res) => {
                        const data = res.data
                        this.newsList = data.result
                    })
                }
            })
        },
        update () {
            console.log(this.addDetail.REGIONID)
            if (!this.longitude) {
                this.$Message.warning('请输入正确的中国经度')
            } else if (!this.latitude) {
                console.log(!this.latitude)
                this.$Message.warning('请输入正确的中国纬度')
            } else {
                infraApi.Change(this.addDetail.REGIONNO, this.addDetail.longitude, this.addDetail.latitude, sessionStorage.getItem('USERID'))
                    .then((res) => {
                        console.log(res)
                        if (res.data.resultCode === '000000') {
                            this.editlist = false
                            infraApi.getList().then((res) => {
                                const data = res.data
                                this.newsList = data.result
                            })
                            this.addDetail.longitude = ''
                            this.addDetail.latitude = ''
                        }
                    })
            }
        }
    }
}

</script>
<style scoped>
    span{
        font-size: 14px;
        text-align: center;
        font-weight: 600;
        margin-left: 10px;
        margin-right: 10px;
    }
    select{
        width: 200px;
        height: 30px;
        font-size: 14px;
        margin-bottom: 10px;
        text-align: center;
        border-radius: 3px;
        border: 1px solid #ccc;
    }
    input{
        text-align: center;
        width: 180px;
        height: 30px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 3px;
    }
    button{
        background: #008cd5;
        border: 0;
        padding: 4px 15px;
        border-radius: 3px;
        color: #fff;
        margin-left: 10px;
        margin-right: 10px;
    }
    table{
        width: 100%;
        font-size: 14px;
        border: 1px solid #eee;
    }
    table thead tr {
        width: 120px;
        height: 40px;
        background: #f5f5f5;
        padding: 10px;
        text-align: left
    }
    table tbody td {
        width: 120px;
        height: 48px;
        padding: 10px;
        text-align: center;
        border-bottom: 1px solid #eee;
}
    em{
        font-style: normal;
        margin: 0 10px;
        cursor: pointer;
        text-align: center;
    }
    td{
        text-align: center;
    }
    .delete{
        color: red;
    }
    .edit{
        color: #008cd5;
    }
    #mask{
        background: rgba(0, 0, 0, .5);
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 4px;
        top: 0;
        left: 0;
    }
    .mask{
        width: 500px;
        height: 317px;
        background: #fff;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 47;
        border-radius: 5px;
    }
    .title{
        padding: 10px;
        border-bottom: 1px solid #eee
    }
    .close{
        float: right;
        cursor: pointer;
    }
    .content{
        padding: 10px;
    }
    .content select{
        width: 80px;
        text-align: center;
    }
    .content input{
        width: 270px;
        margin-bottom: 15px;
    }
    .update{
        background: #008cd5;
        border: 0;
        padding: 4px 15px;
        border-radius: 3px;
        color: #fff;
        float: left;
    }
    .editle{
        background: #008cd5;
        border: 0;
        padding: 4px 15px;
        border-radius: 3px;
        color: #fff;
        float: right;
    }
    .edits{
        height: 48px;
       -webkit-box-sizing: border-box;
       box-sizing: border-box;
       text-align: center;
       text-overflow: ellipsis;
       vertical-align: middle;
       border-bottom: 1px solid #e9eaec
    }
    #btn{
        display: flex;
        justify-content: flex-end;
        width: 485px;
        height:32px;
    }
</style>