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
          <Tooltip placement="top" :disabled="value.phone === null">
            <span :class="workerTitleClass"><b @click="doCopy">{{workerNumber}}</b></span>
              <div slot="content">
                <p style="font-size:6pt;color:#fff;">点击复制号码到剪贴板</p>
              </div>
          </Tooltip>
          
          <span style="color:#888;font-size:8pt;marginLeft:8px">{{workerInfo}}</span>
        </div>
        <div v-show="value.state !== 'off'" class="result-title-rdiv"  @click="close">
          <Icon style="margin:4px" type="close-round"></Icon>
        </div>
      </Row>
      <div ref="resdiv" :class="resultClass" :style="resDivHeight">
        <Timeline>
          <TimelineItem color="green" v-for="(item,index) in value.data" :key="index">
              <Icon :type="item.vicon" slot="dot"></Icon>
              <p style="color:#19be6b;font-size:10pt">{{item.time}}</p>
              <!--
              <p v-show="item.phrase !== null && item.phrase.trim().length>=4" style="color:#888;font-size:10pt">验证码：
                <b style="color:#ff6600" @click="doCopy">{{item.phrase}}</b>
              </p>
              -->
              <div class="multilinediv" v-html="formateInfo(item.phrase,item.info)"></div>
              <div v-show="item.needconfig" class="configdiv">
                <Input v-model="conf.smscontent">
                  <span slot="prepend">发送短信</span>
                </Input>
                <Input v-model="conf.sendto" style="marginTop:10px" @on-keyup="conf.sendto=conf.sendto.replace(/[^0-9]/g,'')">
                  <span slot="prepend">发送到</span>
                  <p slot="append">
                  <Button style="background:#ff8080;color:#fff;marginRight:4px"
                  @click="cancelConfig(item)">放弃</Button>
                  <Button style="background:#2d8cf0;color:#fff" :disabled="!validConfig"
                  @click="sendConfig(item)">确定</Button>
                  </p>
                </Input>
              </div>
              <div v-show="item.configsent" class="configdivsent">
                配置已发送
              </div>
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
      exp:0,
      conf:{smscontent:"",sendto:""},
      divh:320
    }
  },
  computed:{
    resDivHeight(){
      return "height:"+this.divh+"px";
    },
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
    },
    validConfig(){
      return (this.conf.smscontent.length > 0 && this.conf.sendto.length > 0);
    }
  },
  methods:{
    formateInfo:function(phrase ,info){
      var ret = info.replace(/\n/g, "<br>");
      if(phrase !== null && phrase.trim().length > 0){
        ret = ret.replace(phrase, "<b style=\"color:#ff6600\">"+ phrase + "</b>");
      }
      return ret;
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
      this.exp = 0;
      }
    },
    timeOut:function(){
      console.error("timeOut:"+this.exp);
    },
    adjustExp:function(){
      var ret = 0;
      if(this.value.state === 'on' || this.value.state === 'tobeconfig'){
        ret = this.value.numexp;
      }else if(this.value.state === 'wait' || this.value.state === 'run'){
        ret = this.value.verexp;
      }else{
        return ret;
      }
      console.log("adjustExp numexp:"+this.value.numexp+",verexp:"+this.value.verexp)
      var myDate = new Date();
      var millis = myDate.getTime();
      console.log("adjustExp current:"+millis)
      console.log("adjustExp startMillis:"+this.value.startMillis)
      var del = Math.round((millis - this.value.startMillis)/1000);
      console.log("adjustExp del:"+del)
      if(del > 0){
        ret -= (del - 1);
      }
      
      return ret;
    },
    sendConfig(item){
      var data = {
        taskid:this.value.taskid,
        phonenum:this.value.phone,
        config:this.conf
      }
      console.log("sendConfig data:"+JSON.stringify(data))
      this.$emit("send-config",data);
      item.needconfig = false;
      item['configsent'] = true;
    },
    cancelConfig(item){
      var data = {
        taskid:this.value.taskid,
        phonenum:this.value.phone,
        config:{cancel:true}
      }
      console.log("sendConfig data:"+JSON.stringify(data))
      this.$emit("send-config",data);
      item.needconfig = false;
      item['configsent'] = true;
    },
    calcDivHeight:function(){
      var h = document.body.clientHeight;
     // console.log("calcDivHeight:h="+h);
      this.divh = (h-235)/2;
     // console.log("calcDivHeight:divh="+this.divh);
    },
    clientResized:function(){
      this.calcDivHeight();
    }
  },
  watch:{
    currentstate(newValue,oldValue){
      console.log("worker current state watch:"+oldValue+"=>"+newValue);
      if(newValue === 'failed'){
      //  this.exp = 0;
      }else if(newValue === 'wait'){
        this.exp = 0;
        this.exp = this.adjustExp();
      }else if(newValue === 'on'){
        this.exp = 0;
        this.exp = this.adjustExp();
      }
    },
    currentdata:{
      handler(newValue, oldValue){
        //console.log("worker current data watch:"+JSON.stringify(newValue));
        this.$nextTick(() => {
        this.$refs.resdiv.scrollTop = this.$refs.resdiv.scrollHeight;
        })
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
  //height: 320px;
  background: #fff;
  overflow: auto;
}
.result-div-sleep{
  //height: 320px;
  background: #ddd;
  overflow: auto;
}
.multilinediv{
  // white-space:normal;
  // word-break:break-all;
  // word-wrap:break-word;
  font-size:10pt;
  margin-top:4px;
}
.configdiv{
  background: fade(#c4dafc, 50%);
  margin: 2px 38px 2px 18px;
  padding: 10px 40px;
}
.configdivsent{
  background: fade(#cacbcc, 50%);
  margin: 2px 38px 2px 18px;
  text-align: center
}
</style>


