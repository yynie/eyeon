<template>
<div>
  <Row>
    <div style="float:left">
      <Select v-model="selectedSubid" filterable style="width:140px;marginRight:10px" placeholder="请选择项目">
        <Option v-for="item in subjects" :value="item.subid" :key="item.subid">{{item.subname}}</Option>
      </Select>
    </div>
    <div style="float:left">
      <RadioGroup v-model="type" type="button">
        <Radio label="每7天查询"></Radio>
        <Radio label="按自然周查询"></Radio>
        <Radio label="自定义日期"></Radio>
      </RadioGroup>
    </div>
    <div class="fitlerbar" style="float:left">
      <span  v-show="type==='每7天查询'">
        <Button @click="prev7days" :disabled="!can7DaysPrev"><Icon style="marginRight:4px" size="14" type="ios-arrow-left"></Icon>向前7天</Button>
        <Tag type="border" color="blue">{{current7Days}}</Tag>
        <Button @click="next7days" :disabled="!can7DaysNext">向后7天<Icon type="ios-arrow-right" style="marginLeft:4px" size="14"></Icon></Button>
      </span>
      <span  v-show="type==='按自然周查询'">
        <Button @click="prevWeekdays" :disabled="!canWeekPrev"><Icon style="marginRight:4px" size="14" type="ios-arrow-left"></Icon>前一周</Button>
        <Tag type="border" color="blue">{{currentWeekDays}}</Tag>
        <Button @click="nextWeekdays" :disabled="!canWeekNext">后一周<Icon type="ios-arrow-right" style="marginLeft:4px" size="14"></Icon></Button>
      </span>
      <span  v-show="type==='自定义日期'">
        <DatePicker type="daterange" placeholder="选择日期" style="width: 300px" :start-date="customStartDate" :options="optionsOfDate"
        @on-change="setCustDate"></DatePicker>
      </span>
    </div>
    <div style="float:left">
      <Button type="primary">查询</Button>
    </div>
    <div class="step-close-con" @click="close">
      <Icon type="ios-close-empty" size='30' color='#999'></Icon>
    </div>
  </Row>
  <Row style="marginTop:20px">
    <Table ref="mytable" :loading="tabledata.loading" border stripe highlight-row :columns="columns" :data="tabledata.items" :height='tableHeight'></Table>
    <div style="text-align:center">
      <Page v-show="!tabledata.loading" show-total size="small" :page-size="tabledata.pagesize" :total="tabledata.total" :current="tabledata.page"
       @on-change="changePage" :style="{lineHeight:'30px'}"></Page> 
    </div>
  </Row>
</div>
</template>
<style lang="less" scoped>
.fitlerbar{
  margin-left: 20px;
  width: 440px;
  //background: blueviolet
}
.step-close-con {
    float:right;
    padding:0 10px
}
</style>

<script>
import moment from 'moment';
import {historyColumns} from './TableColumn'
export default {
  name:'HistoryModal',
  props:{
    apikey:String,
    subjects:Array,
    cursub:Object,
  },
  data(){
    return {
      type:"每7天查询",
      days7:{
        startfrom:null,
        endto:null,
      },
      week:{
        startfrom:null,
        endto:null,
      },
      cust:{
        startfrom:null,
        endto:null,
      },
      optionsOfDate:{
        disabledDate(date) {
          var check = moment(date);
         // console.log(check.format('YYYY-MM-DD HH:mm:ss'));
          var early = moment().subtract(29, 'days'); //最早为当前日期向前30天(包括当前日期)
          early = moment(early.format("YYYY-MM-DD"));
          var latest = moment();
          latest = moment(latest.format("YYYY-MM-DD"));
          if(check.isBefore(early) || check.isAfter(latest)){
            return true;
          }
          return false;
        }
      },
      tableHeight:700,
      selectedSubid:"",
      tabledata:{
        loading:false,
        items:[
          {
            phonenum:"18917644349",
            createtime:'2018-05-12 12:45:07',
            updatetime:'2018-05-12 12:45:14',
            verifysms:'尊敬的用户：验证码529946，仅用于注册咪咕帐号，有效时间5分钟。如非本人操作，请忽略此短信。回复qx退订【中国移动　咪咕认证平台】',
            verifycode:'12345689',
            status:3
          },
          
        ],
        pagesize: 30,
        page:1,
        total:0,
      },
    }
  },
  computed:{
    currentSub(){
      return this.cursub;
    },
    columns(){
      return historyColumns();
    },
    currentWeekDays(){
      if(this.week.startfrom === null){
        var today = moment();
        var weekOfday = today.format('E');//计算今天是这周第几天  
        console.log("currentWeekDays weekOfday="+weekOfday)
        this.week.startfrom = today.subtract(weekOfday-1, 'days').format('YYYY-MM-DD');//周一
        this.week.endto = today.subtract(-6, 'days').format('YYYY-MM-DD');//周日
      }
      return "周一("+this.week.startfrom + ") ~ 周日(" + this.week.endto + ")";
    },
    canWeekPrev(){
      var early = moment().subtract(29, 'days'); //最早为当前日期向前30天(包括当前日期)
      early = moment(early.format("YYYY-MM-DD"));
      var start = moment(this.week.startfrom);
      if(start.isAfter(early)){
        return true;
      }else{
        return false;
      }
    },
    canWeekNext(){
      var latest = moment();
      latest = moment(latest.format("YYYY-MM-DD"));
      var end = moment(this.week.endto);
      if(end.isBefore(latest)){
       // console.log("canNext end="+end.format("YYYY-MM-DD HH:mm:ss")+ ",latest="+latest.format("YYYY-MM-DD HH:mm:ss"));
        return true;
      }else{
       // console.log("canNext false");
        return false;
      }
    },
    current7Days(){
      if(this.days7.startfrom === null){
        var today = moment();
        this.days7.endto = today.format("YYYY-MM-DD");
        this.days7.startfrom = today.subtract(6, "days").format("YYYY-MM-DD");
      }
      return this.days7.startfrom + " ~ " + this.days7.endto;
    },
    can7DaysPrev(){
      var early = moment().subtract(29, 'days'); //最早为当前日期向前30天(包括当前日期)
      early = moment(early.format("YYYY-MM-DD"));
      var start = moment(this.days7.startfrom);
      if(start.isAfter(early)){
        return true;
      }else{
        return false;
      }
    },
    can7DaysNext(){
      var latest = moment();
      latest = moment(latest.format("YYYY-MM-DD"));
      var end = moment(this.days7.endto);
      if(end.isBefore(latest)){
       // console.log("canNext end="+end.format("YYYY-MM-DD HH:mm:ss")+ ",latest="+latest.format("YYYY-MM-DD HH:mm:ss"));
        return true;
      }else{
       // console.log("canNext false");
        return false;
      }
    },
    customStartDate(){
      var early = moment().subtract(29, 'days'); //最早为当前日期向前30天(包括当前日期)
      //console.log(early.toDate())
      return early.toDate();
    }
  },
  methods:{
    prevWeekdays:function(){
      if(this.week.startfrom !== null){
        var prevsun = moment(this.week.startfrom).subtract(1, 'days');
        var weekOfday = prevsun.format('E');//计算今天是这周第几天  
        console.log("prevWeekdays weekOfday="+weekOfday);
        this.week.endto = prevsun.format('YYYY-MM-DD');//周日
        this.week.startfrom = prevsun.subtract(weekOfday-1, 'days').format('YYYY-MM-DD');//周一
      }
    },
    nextWeekdays:function(){
      if(this.week.startfrom !== null){
        var nextmon = moment(this.week.endto).subtract(-1, 'days');
        var weekOfday = nextmon.format('E');//计算今天是这周第几天  
        console.log("nextWeekdays weekOfday="+weekOfday);
        this.week.startfrom = nextmon.format('YYYY-MM-DD');//周一
        this.week.endto = nextmon.subtract(-(7-weekOfday), 'days').format('YYYY-MM-DD');//周日
      }
    },
    prev7days:function(){
      if(this.days7.startfrom !== null){
        var early = moment().subtract(29, 'days'); //最早为当前日期向前30天(包括当前日期)
        early = moment(early.format("YYYY-MM-DD"));
        //console.log("early="+early.format("YYYY-MM-DD HH:mm:ss"));
        var start = moment(this.days7.startfrom);
        //console.log("start="+start.format("YYYY-MM-DD HH:mm:ss"));
        this.days7.endto = start.subtract(1, "days").format("YYYY-MM-DD");
        this.days7.startfrom = start.subtract(6, "days").format("YYYY-MM-DD");
        //console.log("start2="+start.format("YYYY-MM-DD HH:mm:ss"));
        if(start.isBefore(early)){
          this.days7.startfrom = early.format("YYYY-MM-DD");
        }
      }
    },
    next7days:function(){
      if(this.days7.startfrom !== null){
        var end = moment(this.days7.endto);
        var latest = moment();
        latest = moment(latest.format("YYYY-MM-DD"));
        this.days7.startfrom = end.subtract(-1, "days").format("YYYY-MM-DD");
        this.days7.endto = end.subtract(-6, "days").format("YYYY-MM-DD");
        if(end.isAfter(latest)){
          this.days7.endto = latest.format("YYYY-MM-DD");
        }
      }
    },
    setCustDate:function(val){
      console.log("setCustDate "+val)
      this.cust.startfrom = val[0];
      this.cust.endto = val[1];
      console.log("setCustDate startfrom="+this.cust.startfrom+",endto="+this.cust.endto)
    },
    close:function(){
      //this.$refs.mytable.$destroy();
      this.$emit("on-closed");
    },
    calcTableHeight:function(){
      var h = document.body.clientHeight;
      this.tableHeight = h - 175;
      //console.log("client height:"+h +",tableHeight="+this.tableHeight);
    },
    clientResized:function(){
      //console.log("history modal resized");
      this.calcTableHeight();
    },
    changePage:function(curpage){

    }
  },
  watch:{
    currentSub:{
      handler(newValue, oldValue){
        if(newValue !== null){
          this.selectedSubid = newValue.subid;
          console.log("sub change:"+this.selectedSubid);
        }else{
          this.selectedSubid = "";
           console.log("sub change null");
        }    
      },
      deep:true
    }
  }
  // mounted(){
  //   console.log("history modal mounted");
  //   this.calcTableHeight();
  // }
}
</script>


