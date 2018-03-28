<template>
  <div class="home">
    <Row>
      <div class="headerbar">
        <div class="headerbar-ldiv">
          <Dropdown class="headerbar-ldiv-item" @on-click="menuClick">
            <a href="javascript:void(0)">
              <avatar style="background-color:#2d8cf0;marginRight:10px" size="small" icon="person" />
              <b class="account-infor-name" >{{vcpname}}</b>
              <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem disabled><span style="color:#2d8cf0">{{vcpdisp}}</span></DropdownItem>
                <DropdownItem name="balance"><b>￥账户余额</b></DropdownItem>
                <DropdownItem name="exit"><b>注销<Icon type="log-out" style="marginLeft:6px"/></b></DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Tag v-if="showBoundInfo" style="marginLeft:40px;width:340px" type="dot" color="red">{{boundinfo}}</Tag>
          <Select v-else v-model="selectedSubid" clearable filterable style="marginLeft:40px;width:340px" @on-change="subjectChange">
            <Option v-for="item in subjects" :value="item.id" :key="item.id">
              <span>{{item.subname}}</span>
              <span style="marginLeft:8px;color:#ff5500">{{item.subid}}</span>
            </Option>
          </Select>
          <Tag v-if="connectstatus !== 3" style="marginLeft:40px;width:340px" type="dot" color="red">{{statusinfo}}</Tag>
          <Tag v-else style="marginLeft:40px;width:340px" type="dot" color="green">{{statusinfo}}</Tag>
        </div>
        <div class="headerbar-rdiv">
          <span class="headerbar-rdiv-item" style="margin:0 20px 0 0;color:'#444'">
            {{datetime}}
          </span>
        </div>
      </div>
    </Row>
    <Row>
      <Col :md="8" :sm="8" :xs="8" :lg="6">
        <Card style="margin:0 4px">
          <div style="marginTop:10px">
            <Input v-model="wsid" @on-keyup="wsid=wsid.replace(/[^0-9a-z]/g,'')">
            <span slot="prepend"><b>WSID:</b></span>
            <Button slot="append" :style="disConnectButton?'background:#aaa':'background:#19be6b'" :disabled="disConnectButton"
             @click="WSConnect" :loading="connectstatus === 1"><b style="color:#fff">连&nbsp;&nbsp;接</b></Button>
            </Input>
          </div>
          <div class="opsub-div-gray-center" v-if="curSub === null">
            <p style="line-height:90px">未选择项目</p>
          </div>
          <div :class="(curSub.onoff===1)?'opsub-div-blue':'opsub-div-gray'" v-else>
            <p>项目：<span style="color:#ff7700;marginRight:6px">{{curSub.name}}</span> SUBID：<span style="color:#ff7700">{{curSub.subid}}</span></p>
            <p style="marginTop:10px">单价：{{curSub.price}}</p>
            <Row style="height:40px">
              <p style="float:left;line-height:40px">授权：{{(curSub.onoff===1)?'已授权':'未授权'}}</p>
              <Button :disabled="disPubButton" style="float:right;height:36px" type='primary' @click="pubTask">
              发布
              </Button>
            </Row>
            
          </div>
          <div style="marginTop:20px">
            <b style="marginTop:10px">参数设置：</b>
            <p style="margin:20px 5px;">
              取号超时&nbsp;&nbsp;
              <InputNumber :max="600" :min="0" v-model="task.numexp"></InputNumber>
              &nbsp;&nbsp;秒
              <Tooltip placement="right">
                <Icon type="help-circled" color="#aaa"></Icon>
                <div slot="content">
                  <p style="font-size:6pt;color:#ff9900;">超过此时间未得到</p>
                  <p style="font-size:6pt;color:#ff9900;">号码，则任务过期</p>
                </div>
              </Tooltip>
            </p>
            <p style="margin:20px 5px;">
              任务超时&nbsp;&nbsp;
              <InputNumber :max="600" :min="0" v-model="task.verifyexp"></InputNumber>
              &nbsp;&nbsp;秒
              <Tooltip placement="right">
                <Icon type="help-circled" color="#aaa"></Icon>
                <div slot="content">
                  <p style="font-size:6pt;color:#ff9900;">取得号码后，所有信息在</p>
                  <p style="font-size:6pt;color:#ff9900;">此时间内收完，超时则过期</p>
                </div>
              </Tooltip>
            </p>
            <p style="margin:20px 5px;">
              <span :style="task.count>pubNum?'color:#f00':''">{{task.count>pubNum?'！':''}}任务数量&nbsp;&nbsp;</span>
              <InputNumber :disabled="pubNum === 0" :max="pubNum" :min="1" v-model="task.count"></InputNumber>
              <span style="font-size:8pt;color:#888;marginLeft:8px">可发布数量
                <b style="font-size:10pt;color:#2d8cf0;marginLeft:2px">{{pubNum}}</b></span>
            </p>
          </div>
          <div style="marginTop:20px">
            <b style="marginTop:10px">过滤条件：</b>
            <p style="margin:20px 5px;">
              <Select v-model="task.province" placeholder="请选择地区" clearable filterable style="width:200px">
                <Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
              </Select>
              <Tooltip placement="right">
                <Icon type="help-circled" color="#aaa"></Icon>
                <div slot="content">
                  <p style="font-size:6pt;color:#ff9900;">指定号码所在地</p>
                </div>
              </Tooltip>
            </p>
            <p style="margin:20px 5px;">
              <Select v-model="task.operator" placeholder="请选择运营商" clearable style="width:200px">
                <Option v-for="item in operatorList" :value="item" :key="item">{{ item }}</Option>
              </Select>
              <Tooltip placement="right">
                <Icon type="help-circled" color="#aaa"></Icon>
                <div slot="content">
                  <p style="font-size:6pt;color:#ff9900;">指定运营商</p>
                </div>
              </Tooltip>
            <p style="margin:20px 5px 1px 5px;">
              指定号段
            </p>
            <div class="prefix-div">
              <Tag v-for="(item,index) in task.prefixs" :key="item" :name="item" closable @on-close="deletePrefixs(index)">{{item}}</Tag>
              <Button v-show="this.task.prefixs.length<10" icon="ios-plus-empty" type="dashed" size="small" @click="prefixAddOne">添加</Button>
            </div>
            <p style="margin:20px 5px 1px 5px;">
              排除号段
            </p>
            <div class="exprefix-div">
              <Tag v-for="(item,index) in task.exprefixs" :key="item" :name="item" closable @on-close="deleteExPrefixs(index)">{{item}}</Tag>
              <Button v-show="this.task.exprefixs.length<10" icon="ios-plus-empty" type="dashed" size="small" @click="ExprefixAddOne">添加</Button>
            </div>
          </div>
        </Card>
      </Col>
      <Col :md="16" :sm="16" :xs="16" :lg="18">
        <Row>
          <Col :span="12">
            <worker-card style="marginRight:4px" v-model="workers[0]" @close="workerClose"/>
          </Col>
          <Col :span="12">
            <worker-card style="marginRight:4px" v-model="workers[1]" @close="workerClose"/>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <worker-card style="marginRight:4px;marginTop:4px" v-model="workers[2]" @close="workerClose"/>
          </Col>
          <Col :span="12">
            <worker-card style="marginRight:4px;marginTop:4px" v-model="workers[3]" @close="workerClose"/>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
import Cookies from '../common/Cookies';
import Util from '../common/Util'
import moment from 'moment';
import '../common/md5';
import WorkerCard from './WorkerCard.vue'
//import VCheckGroup from '../views/VCheckGroup.vue';
export default {
  name: 'Home',
  components: {
    //VCheckGroup,
    WorkerCard
  },
  data () {
    return {
      account:{user:null,boundkey:null,accname:null,accdisp:null},
      balance:{loading:false,error:'',balance:0},
      loading:false,
      selectedSubid:'',
      subjects:[],
      curSub:null,
      wsid:null,
      connectstatus:0,//init 0, connecting 1, fail 2, ok 3
      websocket:null,
      task:{
        numexp:120,
        verifyexp:300,
        count:1,
        province:'',
        operator:'',
        prefixs:[],
        exprefixs:[]
      },
      provinceList:['北京','天津','河北','山西','内蒙古','辽宁','吉林','黑龙江','上海','江苏','浙江','安徽','福建','江西','山东','河南','湖北',
      '湖南','广东','广西','海南','重庆','四川','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆','台湾','香港','澳门'],
      operatorList:['移动','联通'],
      workers:[
        {index:0,state:'off',numexp:0,verexp:0,data:null},
        {index:1,state:'off',numexp:0,verexp:0,data:null},
        {index:2,state:'off',numexp:0,verexp:0,data:null},
        {index:3,state:'off',numexp:0,verexp:0,data:null}
      ],
      workersNum:0,
      workersQueue:[]
    }
  },
  computed:{
    datetime(){
      return moment().format("YYYY年 MM月DD日 HH:mm:ss");
    },
    vcpname(){
      if(this.account.accname === null || this.account.accname === undefined){
        return '未知VCP';
      }else{
        return this.account.accname;
      }
    },
    vcpdisp(){
      if(this.account.accdisp === null || this.account.accdisp === undefined){
        return '未知VCP';
      }else{
        return this.account.accdisp;
      }
    },
    showBoundInfo(){
      if(this.loading === true){
        return true;
      }else if(this.account.boundkey === null){
        return true
      }else{
        return false;
      }
    },
    boundinfo(){
      if(this.loading === true){
        return '正在获取KEY...';
      }else if(this.account.boundkey === null){
        return '您的账户尚未未绑定KEY，请联系后台';
      }else{
        return '';
      }
    },
    statusinfo(){
      if(this.wsid === null){
        if(this.connectstatus === 1){
          return '正在建立连接....';
        }else if(this.connectstatus === 2){
          return '连接失败，请联系后台';
        }else{
          return '任务频道尚未连接';
        }
      }else {
        if(this.connectstatus === 1){
           return '断线重连....';
        }else if(this.connectstatus === 2){
          return '连接失败，请联系后台';
        }else if(this.connectstatus === 3){
          return '任务频道已建立'
        }else {
          return '任务频道尚未连接';
        }
      }
    },
    disConnectButton(){
      if(this.account.boundkey === null){
        return true;
      }else if(this.connectstatus === 3){
        return true;
      }else{
        return false;
      }
    },
    disPubButton(){
      if(this.account.boundkey === null || this.connectstatus !== 3){
        return true;
      }else if(this.curSub.onoff===0){
        return true;
      }else if(this.workersNum >= 4){
        return true;
      }else{
        return false;
      }
    },
    pubNum(){
      return 4-this.workersNum;
    },
    numberCopy(){
      return '0000';
    },
  },
  methods:{
    menuClick:function(menu){
      if(menu === 'exit'){
        this.handleSignOut();
      }else if(menu === 'balance'){
        this.loadBalance();
        this.showBalanceModal();
      }
    },
    handleSignOut:function(){
      Cookies.delete('8EEFF760CE134927BFD3CCDAC2ADFF32');
      this.$router.push({
        path: '/login'
      });
    },
    subjectChange:function(value){
      console.log("subjectChange:value="+value+",selectedSubid="+this.selectedSubid)
      if(this.selectedSubid === ''){
        this.curSub = null;
      }else{
         var index = parseInt(this.selectedSubid);
         this.curSub = {
           name:this.subjects[index].subname,
           subid:this.subjects[index].subid,
           price:this.subjects[index].price,
           onoff:this.subjects[index].onoff,
         }
      }
    },
    loadVcpData:function(){
      this.loading = true;
      this.$http.get(URL_VCPDATA,{params:{user:this.account.user}}).then((response) => {
       // console.log("response ok="+JSON.stringify(response.body));
        if(response.body.state === "200000"){
          var result = response.body.result;
          if(result.error !== null && result.error !== undefined){
            this.$Message.error({content:result.error,duration:10});
          }else if(result.boundkey === '' || result.boundkey === null){
            this.account.boundkey = null;
          }else{
            this.account.boundkey = result.boundkey;
            this.account.accname = result.accname;
            this.account.accdisp = result.accdisp;
            if(sessionStorage.wsid){
              this.wsid = sessionStorage.wsid;
            }
            console.log("wsid:"+JSON.stringify(this.wsid));
            this.subjects = [];
            if(result.subjects !== undefined && result.subjects.length > 0){
              var index = 0;
              result.subjects.forEach((sub) => {
                var one = {
                  id:index.toString(),
                  subid:sub.subid,
                  subname:sub.subname,
                  price:sub.price,
                  onoff:sub.onoff
                };
                this.subjects.push(one);
                index ++;
              })
            }
            //console.log("account:"+JSON.stringify(this.account));
           // console.log("subjects:"+JSON.stringify(this.subjects));
          }
        }else{
          this.$Message.error("网络错误(state:"+response.body.state+")");
        }
        this.loading = false;
      },(response) => {
        console.log("err:response="+JSON.stringify(response));
        this.$Message.error("请求VCP信息失败(code:"+response.status+")");
        this.loading = false;
      })
    },
    loadBalance:function(){
      this.balance.loading = true;
      this.$http.get(URL_VCPBALANCE,{params:{apikey:this.account.boundkey}}).then((response) => {
       // console.log("response ok="+JSON.stringify(response.body));
        if(response.body.state === "200000"){
          var result = response.body.result;
          this.balance.balance = result.accbalance;
          this.balance.error = '';
        }else{
          this.balance.error = response.body.statemsg;
        }
        this.balance.loading = false;
      },(response) => {
        console.log("err:response="+JSON.stringify(response));
        this.balance.error = "网络错误(code:"+response.status+")";
        this.balance.loading = false;
      })
    },
    showBalanceModal:function(){
      this.$Modal.info({
        render: (h) => {
          return h('balance_modal', {
              props: {
                data: this.balance
              }
          })
        },
      });
    },
    deletePrefixs:function(index){
      this.task.prefixs.splice(index, 1);
    },
    prefixAddOne:function(){
      this.addPrefixsModal('prefix');
    },
    deleteExPrefixs:function(index){
      this.task.exprefixs.splice(index, 1);
    },
    ExprefixAddOne:function(){
      this.addPrefixsModal('exprefix');
    },
    addPrefixsModal:function(type){
      var data={
        num:''
      }
      this.$Modal.confirm({
        render: (h) => {
          return h('prefix-editor', {
            props: {
              data: data
            },
          })
        },
        onOk: () => {
          if(data.num.length === 3){
            if(type === 'prefix'){
              if(false === Util.isInArray(this.task.prefixs,data.num)){
                this.task.prefixs.push(data.num);
              }
            }else if(type === 'exprefix'){
              if(false === Util.isInArray(this.task.exprefixs,data.num)){
                this.task.exprefixs.push(data.num);
              }
            }
          }
        }
      })
    },
    //WS start
    WSConnect:function(){
      if(this.connectstatus === 3){
        console.log("WSConnect:already Connected:wsid="+this.wsid);
        return;
      }
      if('WebSocket' in window){

      }else{
        alert('您的浏览器不支持WebSocket，推荐使用 Google Chome、微软Edge 或 IE10 以上的浏览器');
        return;
      }

      var url = WS_URL + "?apikey="+this.account.boundkey;
      if(this.wsid !== null){
        //var reg = /[^0-9a-z]/g;
        if(this.wsid.length === 32 /*&& reg.test(this.wsid)*/){
           url += "&wsid="+this.wsid;
        }else if(this.wsid.length > 0){
          alert('非法wsid:'+this.wsid);
          return;
        }
      }
      this.connectstatus = 1;
      console.log("wsurl:" + url);
      let $me = this;
      this.websocket = new WebSocket(url);
      this.websocket.onerror = function(e){
        alert('WebSocket Error:'+JSON.stringify(e));
        $me.connectstatus = 2;
        $me.websocket = null;
      }
      this.websocket.onopen = function(e){
        console.log('WebSocket open:'+JSON.stringify(e));
      }
      this.websocket.onclose = this.wsClose;
      this.websocket.onmessage = this.wsMessage;
    },
    wsClose:function(e){
      console.log(e);
      this.websocket = null;
      if(this.wsid !== null && this.connectstatus === 3){
        console.log("retry ws");
        this.connectstatus = 1; 
        setTimeout(function(){
          this.WSConnect();
        }.bind(this), 1000);
      }
    },
    wsMessage:function(e){
      var data = JSON.parse(e.data);
      console.log(JSON.stringify(data));
      if(data.state === '200000'){
        if('wsid' in data.result){
          this.wsid = data.result.wsid;
          this.connectstatus = 3;
          sessionStorage.wsid = this.wsid;
          this.$Message.success('任务频道建立成功！');
        }else{
          this.responseArrive(data);
        }
      }else{
        if(this.connectstatus === 1){
          alert("连接失败:"+data.state.statemsg);
          this.websocket.close();
          this.connectstatus = 2;
        }else{
          this.responseArrive(data);
        }
      }
    },
    pubTask:function(){
      if(this.task.count > this.pubNum){
        this.$Message.error("总任务数不能大于4个, 还可发布"+this.pubNum+"个");
        return;
      }
      var timestring = this.account.accname+moment().format("YYYYMMDDHHmmss");
      var reqid=timestring.MD5(32);

      var req = {
        requestid:reqid,
        subid:this.curSub.subid,
        reqcount:this.task.count,
        numexp:this.task.numexp,
        verifyexp:this.task.verifyexp,
      }
      if(this.task.operator !== ''){
        req['corp']=this.task.operator;
      }
      if(this.task.province !== ''){
        req['province']=this.task.province;
      }
      if(this.task.prefixs.length > 0){
        req['prefixs']=this.task.prefixs;
      }
      if(this.task.exprefixs.length > 0){
        req['exprefixs']=this.task.exprefixs;
      }
      //console.log("req="+JSON.stringify(req))
      //this.workersQueue.splice(0,this.workersQueue.length);
      for(var i=0; i<req.reqcount; i++){
        var ok = false;
        for(var j=0;j<4;j++){
          if(this.workers[j].state === 'off'){
            this.workers[j].state = 'on';
            this.workersNum++;
            ok = true;
            break;
          }
        }
        if(ok === false){
          console.error("pubTask i="+i+", failed!");
        }
      }
      console.log("pubTask:"+JSON.stringify(this.workers));
      //this.websocket.send(JOSN.stringify(req));
      //this.task.count=1;
    },
    workerClose:function(index){
      if(this.workers[index].state === 'on'){
        this.workers[index].state = 'off';
        this.workers[index].data = null;
        this.workersNum--;
      }
      console.log("workerClose:"+JSON.stringify(this.workers));
    },
    onbeforeunload:function(){
      console.log("onbeforeunload");
      this.connectstatus = 0;
      if(this.websocket !== null){
        this.websocket.close();
      }
    }
  },
  mounted(){
    var get = Cookies.get('8EEFF760CE134927BFD3CCDAC2ADFF32');
    var user = JSON.parse(get);
    this.account.user = user.user;
    console.log("mounted"+JSON.stringify(this.account));
    this.loadVcpData();
    window.onbeforeunload = this.onbeforeunload;
  },
  destroyed(){
    console.log("destroyed");
    this.connectstatus = 0;
    if(this.websocket !== null){
      this.websocket.close();
    }
  }
}
</script>
<style lang="less" scoped>
@import './Home.less';
</style>



