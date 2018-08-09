<template>
     <div class="div_data">
            <ul>
                <li><span>电子社保卡签发数量</span><label>
                  <label class="iCountUp">
                  <ICountUp :startVal="allStartVal"
                  :endVal="allEndVal"
                  :decimals="allDecimals"
                  :duration="allDuration"
                  :style="{color: '#00deff',fontSize: '24px',
                 
                  }" 
                  :options="options"/>
            </label></label></li>
                <li><span>一级签发数量</span><label class="iCountUp">
                  <ICountUp :startVal="firstStartVal"
                  :endVal="firstEndVal"
                  :decimals="firstDecimals"
                  :duration="firstDuration"
                  :options="options"
                 :style="{color: '#00deff',fontSize: '24px',
                  }" 
                  />
            </label></li>
                <li><span>二级签发数量</span><label><label class="iCountUp">
                  <ICountUp :startVal="secondStartVal"
                  :endVal="secondEndVal"
                  :decimals="secondDecimals"
                  :duration="secondDuration"
                 :style="{color: '#00deff',fontSize: '24px',
                
                  }" 
                  :options="options"/>
            </label></label></li>
                <li><span>开通城市数</span><label :style="{marginLeft: '30px'}" >{{cardCity}}</label></li>
                <li><span>接入渠道数</span><label :style="{marginLeft: '30px'}" >{{cardchannel}}</label></li>
            </ul>
        </div>
</template>
<script>
import { infraApi } from "../../apis";
import ICountUp from 'vue-countup-v2';
  export default {
    name: 'demo',
    components: {
      ICountUp
    },
    data() {
      return {
         cardCity:0,
      cardchannel:0,
        //总量
        allStartVal: 0,
        allEndVal: 0,
        allDecimals: 0,
        allDuration: 5,
         //一级
        firstStartVal: 0,
        firstEndVal: 0,
        firstDecimals: 0,
        firstDuration: 5,
         //二级
        secondStartVal: 0,
        secondEndVal: 0,
        secondDecimals: 0,
        secondDuration: 5,
        options: {
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: ''
        }
      };
    },
  mounted() {
    let __this = this;
    setInterval(function() {
      infraApi.dapingAll().then(__this.handleAllSuees.bind(__this));
    }, 5000);
  },
  methods: {
    handleAllSuees(res) {
      this.allEndVal = Number(res.data.result.ecardCount);
      this.firstEndVal = Number(res.data.result.ecardOneCount);
      this.secondEndVal = Number(res.data.result.ecardTwoCount);
       this.cardCity = res.data.result.cityCount;
      this.cardchannel = res.data.result.channelCount;
      // console.log(this.firstEndVal)
    }
  }
};
</script>
<style scoped>
 .div_data > ul {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.div_data li {
  list-style: none;
  float: left;
  height: 100%;
  width: 17%;
  margin-left: 3%;
  padding-top: 10px;
}
.div_data > ul > li:nth-child(1) {
  background: url("../assets/img/icon/icon-scard.png") no-repeat left top 10px;
  background-size: 22px 18px;
}
.div_data > ul > li:nth-child(2) {
  background: url("../assets/img/icon/icon-level1.png") no-repeat left top 10px;
  background-size: 18px 18px;
}
.div_data > ul > li:nth-child(3) {
  background: url("../assets/img/icon/icon-level2.png") no-repeat left top 10px;
  background-size: 18px 18px;
}
.div_data > ul > li:nth-child(4) {
  background: url("../assets/img/icon/icon-city.png") no-repeat left top 10px;
  background-size: 22px 18px;
}
.div_data > ul > li:nth-child(5) {
  background: url("../assets/img/icon/icon-channel.png") no-repeat left top 10px;
  background-size: 18px 18px;
}
.div_data span {
  font-size: 16px;
  color: #ffffff;
  margin-left: 30px;
}
.div_data label {
  font-size: 24px;
  height: 31px;
  line-height:31px; 
  color: #00deff;
  /* margin-left: 30px; */
  display: block;

}
</style>
