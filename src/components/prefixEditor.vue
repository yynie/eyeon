<template>
  <Input id="input0" v-model="prefix" placeholder="输入3位起始号码" autofocus :maxlength="max"
   @on-keyup="keyup"></Input>
</template>
<script>
export default {
  name:'PrefixEditor',
  props:{
    data:Object
  },
  data(){
    return {
      prefix:this.data.num,
      max:3,
    }
  },
  methods:{
    keyup:function(){
      //console.log("keyup1 " +this.prefix);
      this.prefix = this.prefix.replace(/[^0-9]/g,'');
      this.data.num = this.prefix
      //console.log("keyup2 " +this.data.num);
    }
  },
}
</script>

