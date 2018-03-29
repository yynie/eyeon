<template>
  <div>
    <div slot="header">
      <span style="color:#444;font-size:12pt">账户余额:</span>
    </div>
    <div v-if="loading" class="container">
      <Spin style="color:#ff9900" fix>
        <Icon type="load-c" size=28 class="demo-spin-icon-load"></Icon>
        <div style="font-size:10pt;marginTop:10px"><span>Loading...</span></div>
      </Spin>
    </div>
    <div v-else class="container">
      <p :class="infoClass" style="line-height:80px">{{showinfo}}</p>
      <p style="font-size:10pt;line-height:20px;color:#888">{{frozen}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name:'balanceModal',
  props:{
    data:Object,
  },
  computed:{
    loading(){
      return this.data.loading;
    },
    showinfo(){
      if(this.data.error === ''){
        return '￥ ' + this.data.balance;
      }else{
        return this.data.error;
      }
    },
    frozen(){
      if(this.data.error === ''){
        return '冻结金额 ' + this.data.frozen + ' ,冻结时间 '+Math.round(this.data.frozensecs/60) + " 分钟";
      }else{
        return '';
      }
    },
    infoClass(){
      if(this.data.error === ''){
        return 'info_ok';
      }else{
        return 'info_error';
      }
    }
  },
}
</script>
<style lang="less" scoped>
.container{
 // width: 160px;
  height: 100px;
  margin: 0 20px;
  position: relative;
  text-align: center;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
.info_error{
  font-size: 12pt;
  color: #f00;
}
.info_ok{
  font-size: 20pt;
  color: #ff9900;
}
</style>


