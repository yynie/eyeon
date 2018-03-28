<template>
  <div>
    <Card>
      <Row slot="title">
        <count-down :startfrom="exp" float="left" stopinfo="未工作" fontsize="10pt" activesize="14pt" height="20px" color="#2d8cf0" v-model="isworking"
         @time-out="timeOut" />
        <div class="result-title-ldiv">
          <!--
          <span :class="workerTitleClass">{{workerPrefix}}</span>
          -->
          <span :class="workerTitleClass"><b @click="doCopy">{{workerNumber}}</b></span>
          <span style="color:#888;font-size:8pt;marginLeft:8px">{{workerInfo}}</span>
        </div>
        <div v-show="value.state !== 'off'" class="result-title-rdiv"  @click="close">
          <Icon style="margin:4px" type="close-round"></Icon>
        </div>
      </Row>
      <div ref="resdiv" :class="resultClass">
        <Timeline>
          <TimelineItem color="green" v-for="(item,index) in value.data" :key="index">
              <Icon :type="item.vicon" slot="dot"></Icon>
              <p style="color:#19be6b;font-size:8pt">{{item.time}}</p>
              <p v-show="item.phrase !== null && item.phrase.trim()>=4" style="color:#888;font-size:10pt">验证码：
                <b style="color:#ff6600" @click="doCopy">{{item.phrase}}</b>
              </p>
              <div class="multilinediv" v-html="formateInfo(item.info)"></div>
          </TimelineItem>
      </Timeline>
      </div>
    </Card>
  </div>
</template>
<script>
import CountDown from '../views/CountDown.vue'
export default {
  name:'WorkerCard',
  components:{
    CountDown
  },
  props:{
    value: {
      type: Object,
      validator(val){
        if(val === null || val === undefined){
          return false;
        }
        if(('index' in val) && ('state' in val) && ('data' in val)){
          return true;
        }else{
           return false;
        }
      }
    },
  },
  data(){
    return {
      exp:this.value.numexp,
    }
  },
  computed:{
    isworking(){
      return (this.value.state !== 'off');
    },
    workerPrefix(){
      if(this.value.state !== 'off'){
        return 'NUM：'
      }else{
        return '未工作';
      }
    },
    workerNumber(){
      if(this.value.state === 'off'){
        return '';
      }else if(this.value.state === 'on'){
        return '等待号码...';
      }else{
        return this.value.phone;
      }
    },
    workerInfo(){
      if(this.value.state === 'off' || this.value.state === 'on'){
        return '';
      }else{
        var info = '';
        if('province' in this.value.minfo){
          info += this.value.minfo.province;
        }
        if('corp' in this.value.minfo){
          info += " , " + this.value.minfo.corp;
        }
        return info;
      }
    },
    workerNumberTimeStamp(){
      if(this.value.state === 'off' || this.value.state === 'on'){
        return '';
      }else{
        return this.value.minfo.gettime;
      }
    },
    workerTitleClass(){
      if(this.value.state === 'run' || this.value.state === 'wait'){
        return 'worker-title-active';
      }else{
        return 'worker-title-sleep';
      }
    },
    resultClass(index){
      if(this.value.state !== 'off'){
        return 'result-div-active';
      }else{
        return 'result-div-sleep';
      }
    },
    currentstate(){
      return this.value.state;
    },
    currentdata(){
      return this.value.data;
    }
  },
  methods:{
    formateInfo:function(info){
      return info.replace("\n", "<br>")
    },
    doCopy:function(event){
      var el = event.currentTarget;
      var text = el.innerHTML;
      let $me = this;
      this.$copyText(text).then(function (e) {
          $me.$Message.success("号码"+e.text+"已复制到剪贴板！");
          //console.log(e)
        }, function (e) {
          $me.$Message.error('无法复制');
          console.error(e)
        })
    },
    close:function(event){
      if(this.value.state !== 'off'){
      this.$emit('close',this.value.index);
      }
    },
    timeOut:function(){
      console.error("timeOut:"+this.exp);
    }
  },
  watch:{
    currentstate(newValue,oldValue){
      console.log("worker current state watch:"+oldValue+"=>"+newValue);
      if(newValue === 'wait'){
        this.exp = 0;
        this.exp = this.value.verexp;
      }
    },
    currentdata:{
      handler(newValue, oldValue){
        console.log("worker current data watch:"+JSON.stringify(newValue));
        this.$refs.resdiv.scrollTop = this.$refs.resdiv.scrollHeight;
      },
      deep:true
    }
    // value:{
    //   handler(newValue, oldValue){
    //     console.log("worker watch:"+JSON.stringify(newValue))
    //   },
    //   deep:true
    // }
  }
}
</script>
<style lang="less" scoped>
.result-title-ldiv{
  float:left;
  margin-left: 8px;
  text-align:center;
  height: 20px;
}
.result-title-rdiv{
  float:right;
  height: 20px;
}
.worker-title-active{
  color: #444;
  line-height: 20px;
  b{
    margin-left: 8px;
    font-size:12pt;
    color:#ff6600
  }
}
.worker-title-sleep{
  color: #888;
  line-height: 20px;
  b{
    margin-left: 8px;
    font-size:10pt;
    color:#888
  }
}
.result-div-active{
  height: 320px;
  background: #fff;
  overflow: auto;
}
.result-div-sleep{
  height: 320px;
  background: #ddd;
  overflow: auto;
}
.multilinediv{
  // white-space:normal;
  // word-break:break-all;
  // word-wrap:break-word;
  font-size:10pt;
}
</style>


