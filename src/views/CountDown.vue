<template>
  <div :style="wrappedStyle">
    <p :style="wrappedTextStyle">{{showinfo}}</p>
  </div>
</template>
<script>
export default {
  name:'CountDown',
  props:{
    float:{
      type: String,
      default:''
    },
    value: {
        type: Boolean,
        default: false,
    },
    stopinfo:{
      type: String,
      default:null
    },
    speed: {
        type: Number,
        default: 1000
    },
    startfrom: {
      type: Number,
      default: 10
    },
    fontsize:{
      type: String,
      default:''
    },
    activesize:{
      type: String,
      default:''
    },
    color:{
      type: String,
      default:''
    },
    height: {
      type: String,
      default: 'auto'
    },
    width: {
      type: String,
      default: 'auto'
    },
  },
  computed:{
    showinfo(){
      if(this.value){
        return ""+this.count;
      }else{
        if(this.stopinfo === null){
          return ""+this.count;
        }else{
          return this.stopinfo;
        }
      }
    },
    wrappedTextStyle(){
      var s = '';
      
      if(this.height !== 'auto'){
        s+='line-height:'+this.height;
      }
      if(this.value === false){
        s+=';color:#888';
        if(this.fontsize !== ''){
          s+=';font-size:'+this.fontsize;
        }
      }else{
        if(this.activesize !== ''){
          s+=';font-size:'+this.activesize;
        }else{
           if(this.fontsize !== ''){
            s+=';font-size:'+this.fontsize;
          }
        }
        if(this.count === 0){
          s+=';color:#888';
        }else{
          if(this.color !== ''){
            s+=';color:'+this.color;
          }
        }
      }
      s = s.replace(/(^;*)/g,"");//去头部;
      //console.log(s)
      return s;
    },
    wrappedStyle(){
      var s = 'text-align:center';
      if(this.float !== ''){
        s+=';float:'+this.float;
      }
      if(this.width !== 'auto'){
        s+='width:'+this.width;
      }
      if(this.height !== 'auto'){
        s+=';height:'+this.height;
      }
      
      //console.log(s)
      return s;
    }
  },
  data(){
    return {
      count:this.startfrom,
      timer:null
    }
  },
  watch:{
    startfrom(newVal, oldVal){
      this.count = newVal;
      this.run();
    },
    value(newVal, oldVal){
      console.log("countdown "+newVal);
      if(newVal){
        this.run();
      }else{
        this.stop();
      }
    }
  },
  methods:{
    run:function(){
      if(this.timer === null){
        console.log("run this.count="+this.count);
        if (this.value === true && this.count>0) {
          this.timer = window.setInterval(() => {
            this.count --;
            if(this.count === 0){
              this.stop();
              this.$emit("time-out");
            }
          }, this.speed);
        }
      }
    },
    stop:function(){
      if(this.timer !== null){
        window.clearInterval(this.timer);
        this.timer = null;
        console.log("countdown stoped");
      }
    },
  },
  mounted(){
    window.onbeforeunload = this.onbeforeunload;
    if(this.value){
      this.run();
    }
  },
}
</script>
<style lang="less" scoped>

</style>


