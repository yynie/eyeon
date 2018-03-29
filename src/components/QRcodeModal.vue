<template>
  <div>
    <img src="../assets/bar_03.jpg" alt="支付宝" height="26"/>
    <div style="text-align:center;marginTop:10px">
      
      <img :src="url" :alt="url" width="180" height="180"/>
      <p>扫码充值 请备注VCP账户名称：{{accname}}</p>
      <p>充值完成后请联系后台处理</p>
    </div>
  </div>
</template>
<script>
export default {
  name:'QRcodeModal',
  props:{
    url:String,
    accname:String
  }
}
</script>

