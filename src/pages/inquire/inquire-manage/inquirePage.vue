<template>
   <div>
      <span>省份</span>
      <select v-model="addDetail.REGIONPROVINCE" name="REGION_PROVINCE" @change="handleMockdel">
          <option v-for="item of prov" :key="item.id" :value="item.REGIONPROVINCE">{{item.REGIONPROVINCE}}</option>
      </select>
      <span>城市</span>
      <select v-model="addDetail.REGIONNAME" name="REGION_NAME" @change="handleMockdele">
          <option v-for="item of city" :value="item.REGIONNAME" :key="item.id">{{item.REGIONNAME}}</option>
      </select>
      <span>经度</span>
      <input type="text" @input="handleChangeInput" value="val" v-model="addDetail.longitude" placeholder="请输入正确的坐标系">
       <span>纬度</span>
      <input type="text" @input="handleChangeInputow" value="val" v-model="addDetail.latitude" placeholder="请输入正确的坐标系">
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
                <td width="10%">{{item.LATITUDE}}</td>
                <td width="10%">{{item.LONGITUDE}}</td>
                <td width="5%">
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
                <span>经度</span>
                <input type="text" @input="handleChangeInputow" value="val" v-model="addDetail.longitude" placeholder="请输入正确的坐标系">
                <span>纬度</span>
                <input type="text" @input="handleChangeInput" value="val" v-model="addDetail.latitude" placeholder="请输入正确的坐标系">
                <button @click="update" class="update">更新</button>
                <button @click="editlist=false" class="editle">取消</button>
            </div>
        </div>
    </div>
</div>
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
            const data = res.data
            this.prov = data.result
            console.log(this.prov)
        })
        infraApi.getList().then((res) => {
            const data = res.data
            this.newsList = data.result
        })
    },
    methods: {
        handleMockdel (val) {
            // console.log(this.addDetail.REGIONPROVINCE)
            // console.log(this.prov.length)
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
                const data = res.data
                this.city = data.result
                // console.log(res)
            })
        },
        handleMockdele (val) {
            console.log(this.addDetail.REGIONNAME)
        },
        handleBtn () {
            if (!this.addDetail.REGIONPROVINCE) {
                this.$Message.warning('请选择省份')
            } else if (!this.addDetail.REGIONNAME) {
                this.$Message.warning('请选择城市')
            } else if (!this.longitude) {
                this.$Message.warning('请输入正确的经度')
            } else if (!this.latitude) {
                this.$Message.warning('请输入正确的纬度')
            } else {
                infraApi.Save(this.addDetail.REGIONNO, this.addDetail.REGIONPROVINCE, this.addDetail.REGIONNAME, this.addDetail.longitude, this.addDetail.latitude, sessionStorage.getItem('USERID')).then((res) => {
                    console.log(res)
                    if (res.status === 200) {
                        infraApi.getList().then((res) => {
                            // console.log(res)
                            const data = res.data
                            this.newsList = data.result
                            // console.log()
                        })
                    } else {
                        this.$Message.warning(res.data.msg)
                    }
                })
            }
        },
        handleChangeInput (e) {
            let regex = /^[-+]?(0?\d{1,2}\.\d{1,5}|1[0-7]?\d{1}\.\d{1,5}|180\.0{1,5})$/
            if (regex.test(e.target.value)) {
                this.longitude = true
                return true
            } else {
                this.longitude = false
                return false
            }
        },
        handleChangeInputow (e) {
            let regex = /^[-+]?([0-8]?\d{1}\.\d{1,5}|90\.0{1,5})$/
            if (regex.test(e.target.value)) {
                this.latitude = true
                return true
            } else {
                this.latitude = false
                return false
            }
        },
        edit (item) {
            this.editlist = true
            console.log(item.REGIONID)
            this.addDetail.REGIONNO = item.REGIONID
        },
        handleDelete (REGIONID) {
            console.log(this.addDetail.REGIONNO)
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
            if (!this.longitude) {
                this.$Message.warning('请输入正确的经度')
            }
            if (!this.latitude) {
                console.log(!this.latitude)
                this.$Message.warning('请输入正确的纬度')
            }
            infraApi.Change(this.addDetail.REGIONNO, this.addDetail.longitude, this.addDetail.latitude, sessionStorage.getItem('USERID'))
                .then((res) => {
                    if (res.data.resultCode === '000000') {
                        this.editlist = false
                        infraApi.getList().then((res) => {
                            const data = res.data
                            this.newsList = data.result
                        })
                    }
                })
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
        font-size: 14px;
        text-align: center;
        border-radius: 3px;
        border: 1px solid #ccc;
    }
    input{
        text-align: center;
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
        background: #f5f5f5;
        padding: 10px;
        text-align: left
    }
    table tbody td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
}
    em{
        font-style: normal;
        margin: 0 10px;
        cursor: pointer;
        text-align: center;
        float: left;
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
        width: 300px;
        height: 200px;
        background: #ccc;
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
        margin-left: 10px;
        margin-right: 10px;
    }
    .editle{
        background: #008cd5;
        border: 0;
        padding: 4px 15px;
        border-radius: 3px;
        color: #fff;
        float: right;
    }
</style>