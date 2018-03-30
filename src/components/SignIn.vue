<template>
  <div class="sign-in" :style="photo">
    <div class="sign-in-card">
      <Card shadow class="formcard">
        <div style="text-align:center;margin:50px 40px 60px 40px">
          <p style="font-size:20px;color:#888;marginBottom:40px"><b>LOGIN</b></p>
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="user">
               <Row>
                <div class="iconLeft" style="float:left">
                  <Icon :size="20" style="line-height:34px" type="person"></Icon>
                </div>
                <div style="float:left;width:334px">
                  <Input v-model="form.user" size="large" autofocus :disabled="isProcessing" placeholder="请输入用户名"
                   @on-keyup="form.user=form.user.replace(/[^a-zA-Z0-9_\-]/g,'')"></Input>
                </div>
              </Row>
            </FormItem>
            <FormItem prop="password">
              <Row>
                <div class="iconLeft" style="float:left">
                  <Icon :size="20" style="line-height:34px" type="locked"></Icon>
                </div>
                <div style="float:left;width:300px">
                  <Input ref="pwdinput" :type="keyType" size="large" :disabled="isProcessing" v-model="form.password" placeholder="请输入密码"
                   @on-keyup="form.password=form.password.replace(/[^a-z0-9]/g,'')"></Input>
                </div>
                <div class="iconRight" style="float:left;" v-on:click="eyeClicked">
                  <Icon :size="20" style="line-height:34px" :type="eyeIcon"></Icon>
                </div>
              </Row>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" size="large" long :loading="isProcessing">
                  <span>{{isProcessing?"正在登录...":"登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录"}}</span>
              </Button>
            </FormItem>
          </Form>
        </div>
      </Card>
      <div class="sign-in-footer" style="width:500px;marginBottom:30px;text-align:center">
        <p class="textborder">推荐使用 Google Chrome 或 IE10 以上的浏览器, 低版本浏览器可能功能不全</p>
        <p class="textborder">不提供注册，开户和密码变更请联系后台</p>
      </div>
    </div>
  </div>
</template>
<script>
import '../common/md5';
import Cookies from '../common/Cookies'
export default {
  data () {
    return {       
      photo: {
        backgroundImage: 'url(' + require('../assets/greenleaff2.jpg') + ')',
      },
      form:{
        user:'',
        password:'',
        pwdSee:false,
      },
      rules: {
        user: [
          { required: true, message: 'please enter username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'please enter password', trigger: 'blur' }
        ]
      },
      isProcessing:false,
    }
  },
  computed:{
    keyType(){
      return this.form.pwdSee?"text":"password";
    },
    eyeIcon(){
      return this.form.pwdSee?"ios-eye":"ios-eye-outline";
    }
  },
  methods: {
    eyeClicked: function(){
      this.form.pwdSee = !this.form.pwdSee;
    },
    handleSubmit: function() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
            this.isProcessing = true;
            this.$Message.loading({content: '正在登录...',duration: 0});  
            this.$http.post(URL_RETAIL_LOGIN,{user:this.form.user,key:this.form.password.MD5()}).then((response) => {
              this.$Message.destroy();
              console.log("response.body="+JSON.stringify(response.body));
              if(response.body.state === "200000"){
                var result = response.body.result;
                if(result.ok === false){
                  this.$Message.error({content:result.error,duration:10});
                }else{
                  var account = result.account;
                  this.loginOk(account);
                }
              }else{
                this.$Message.error("网络错误(state:"+response.body.state+")");
              }
              this.isProcessing = false;
            },(response) => {
              console.log("response="+JSON.stringify(response));
              this.$Message.destroy();
              this.$Message.error("网络错误(code:"+response.status+")");
              this.isProcessing = false;
            });
        }
      })
    },
    loginOk(user){
      console.log("loginOk:user="+JSON.stringify(user))
      Cookies.set('8EEFF760CE134927BFD3CCDAC2ADFF32', JSON.stringify(user), {expires:COOKIE_EXPIRED,unit:COOKIE_EXPIRED_UNIT});
      
      this.$router.replace({
        name: 'Home'
      });
    }
  }
}
</script>
<style lang="less" scoped>
.formcard{
  background-color: fade(#fff,60%);
  //Firefox4.0-
  -moz-box-shadow:1px 1px 5px #666;
  //Safari and Google chrome10.0-
  -webkit-box-shadow: 1px 1px 5px #666;
  box-shadow: 1px 1px 5px #666;

  Button{
    color: #eee;
    background: rgb(4, 181, 108);
    height: 40px;
   // width: 368px;
  }
  .iconLeft{
    width:34px;height:36px;
    background:fade(#666,20%);
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
    border: 1px solid fade(#444,10%);
  }
  .iconRight{
    width:34px;height:36px;
    background:fade(#000,10%);
    border-bottom-right-radius: 6px;
    border-top-right-radius: 6px;
    border: 1px solid fade(#444,10%);
  }
}
.textborder{
    background:fade(#fff, 40%);
    text-shadow: 1px 1px 1px #fff;
    color:#000
  }

</style>

