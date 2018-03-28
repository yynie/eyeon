<template>
  <div>
    <Card>
      <Row slot="title">
        <div class="result-title-ldiv">
          <span :class="workerTitleClass">{{workerPrefix}}<b @click="doCopy">{{workerNumber}}</b></span>
        </div>
        <div v-show="value.state === 'on'" class="result-title-rdiv"  @click="close">
          <Icon style="margin:4px" type="close-round"></Icon>
        </div>
        <div class="result-title-rdiv">
          <span>{{workerNumberTimeStamp}}</span>
        </div>
      </Row>
      <div :class="resultClass">
      </div>
    </Card>
  </div>
</template>
<script>
export default {
  name:'WorkerCard',
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
  computed:{
    workerPrefix(){
      if(this.value.state === 'on'){
        return 'NUM：'
      }else{
        return '未工作';
      }
    },
    workerNumber(){
      if(this.value.state === 'on'){
        if(this.value.data !== null){
          if(this.value.data.number.length === 0){
            return '等待号码...';
          }else{
            return this.value.data.number;
          }
        }else{
          return '正在发布任务...';
        }
      }
      return '';
    },
    workerNumberTimeStamp(){
      if(this.value.state === 'on'){
        if(this.value.data !== null){
          return this.value.data.numbertime;
        }
      }
      return '';
    },
    workerTitleClass(){
      if(this.value.state === 'on'){
        if(this.value.data !== null && this.value.data.number.length > 9){
          return 'worker-title-active';
        }else{
          return 'worker-title-sleep';
        }
      }else{
        return 'worker-title-sleep';
      }
    },
    resultClass(index){
      if(this.value.state === 'on'){
        return 'result-div-active';
      }else{
        return 'result-div-sleep';
      }
    },
  },
  methods:{
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
      if(this.value.state === 'on'){
      this.$emit('close',this.value.index);
      }
    }
  }
}
</script>
<style lang="less" scoped>
.result-title-ldiv{
  float:left;
  margin-left: 8px;
}
.result-title-rdiv{
  float:right;
}
.worker-title-active{
  color: #444;
  b{
    margin-left: 8px;
    font-size:12pt;
    color:#ff6600
  }
}
.worker-title-sleep{
  color: #888;
  b{
    margin-left: 8px;
    font-size:10pt;
    color:#888
  }
}
.result-div-active{
  height: 320px;
  background: #fff;
}
.result-div-sleep{
  height: 320px;
  background: #ddd;
}
</style>


