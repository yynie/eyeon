<template>
  <div>
    <Row v-for="(item, index) in list" :key="item.id" :class="bgdivClass(index)">
      <Checkbox size='large' style="line-height:46px" v-model="truefalse[index]" @on-change="(value)=>{change(index,value);}">
        <span style="marginLeft:4px">{{item.content}}</span>
        <span style="marginLeft:10px;color:#888;font-size:8pt">[&nbsp;&nbsp;{{item.disp}}&nbsp;&nbsp;]</span>
      </Checkbox>
    </Row>
    <Spin fix size="large" v-show="loading">
      <slot name="loading"></slot>
    </Spin>
  </div>
</template>
<script>
import Util from '../common/Util'
export default {
  name:'VCheckGroup',
  props:{
    value: {
      type: Array,
      default () {
        return [];
      }
    },
    list:{
      type:Array,
      // validator(value){
      //   var len = value.length;
      //   for(var i=0; i<len; i++){
      //     var ob = value[i];
      //     if(('content' in ob) === false){
      //       return false;
      //     }
      //     if(('id' in ob) === false){
      //       return false;
      //     }
      //   }
      //   return true;
      // }
    },
    siglechoise:{
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {

      currentValue: this.value,
      truefalse:[],
      
    }
  },
  watch: {
    list(){
     // console.log("watch mylist"+JSON.stringify(this.list));
      this.updateTrueFalse();
    }
  },
  // mounted(){
  //   console.log("mounted list"++",siglechoise="+this.siglechoise)
  //  // this.updateTrueFalse();
  // },
  methods:{
    bgdivClass:function(index){
    
      if(index%2 === 0){
        return ['bg-div','bg-div-white'];
      }else{
        return ['bg-div','bg-div-gray'];
      }
    },
    updateTrueFalse:function(){
      this.truefalse.splice(0,this.truefalse.length);
      var len = this.list.length;
      for(var i=0; i<len; i++){
        if(Util.isInArray(this.currentValue,this.list[i].id)){
          this.truefalse.push(true);
        }else{
           this.truefalse.push(false);
        }
      }
    },
    change(index,value){
      console.log("change:index="+index+",value="+value)
      var len = this.list.length;
      this.currentValue.splice(0,this.currentValue.length);
      for(var i=0; i<len; i++){
        if(i === index){
          this.truefalse[i]=value;
        }else{
          if(this.siglechoise === true && value === true){
            this.truefalse[i]=false;
          }
        }
        if(this.truefalse[i] === true){
          this.currentValue.push(this.list[i].id);
        }
      }
      
      console.log("change:truefalse="+JSON.stringify(this.truefalse));
      console.log("change:currentValue="+JSON.stringify(this.currentValue));
      this.$emit('on-change',this.currentValue);
    },
  }
}
</script>
<style lang="less" scoped>
.bg-div{
  height: 46px;
  padding: 0 8px;
  overflow: hidden;
  &-white{
    background: #fff;
  }
  &-gray{
    background: fade(#daeaf8,50%);
  }
  &-checked{
    background: #0067b8;
  }
}
</style>

