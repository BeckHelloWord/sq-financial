<template>
    <div class="login">
       
        <!-- 新的手机号 -->
        <label class="userName">
            <input type="tel" placeholder="输入新手机号" v-model='telNumber'  maxlength="11" autocomplete="new-telNumber">
            <div class="del iconfont icon-clear" v-show='telNumber' @click="clearModel('telNumber')"></div>
        </label>
        <!-- 短信验证码 -->
        <label class="password">                      
            <div class="get-code" >
                <div class="get-code-value">
                    <input type="tel" placeholder="短信验证码" v-model='verificationCode' maxlength="6" autocomplete="new-verificationCode">
                    <div class="del iconfont icon-clear" v-show='verificationCode' @click="clearModel('verificationCode')"></div>
                </div>
                <button type="button" class="get-code-btn" :class="{'get-code-disable': getCodeBtnDisable}" @click="getCode">{{getCodeTxt}}</button>
            </div>
        </label>
        <!-- 完成，修改手机号 -->
        <div class="loginBtn">
            <input type="button" value="完成" @click = "sure" :class="{'login-btn-disable':messageCodeChange}">
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
export default {
  data: function() {
    return {    
      getCodeTxt: "获取验证码",   
      getCodeBtnDisable: true /* 禁用获取验证码 */,
      getCodePending: true /* 验证码发送中 */,
      loginBtnDisable: true /* 登录按钮状态 */,
      tips:"验证码不正确，请重新输入",     
      oldTel:this.$route.params.tel, // 旧手机号    
      telNumber: "",// 新手机号
      verificationCode: "",//手机验证码
      countTime:60,
      getCodePending: true /* 验证码发送中 */,
      //定时器
      verifyBox:""
    };
  },
  watch:{
     telNumber(newVal, oldVal) {
      if (newVal) {
        /* 手机位数对&&验证码没有在获取中 */
        if (newVal.length == 11 && this.getCodePending) {         
          this.$configInfo.checkCountDown.call(this, this.telNumber, "login");
        } else {
          this.getCodeBtnDisable = true;

        }
      } else {
        this.getCodeBtnDisable = true;
      }
    },
  },
  // 监测手机号是否输入11位
  computed:{
    // telNumberChange(){
    //   if( this.telNumber.length ==11 &&this.countTime == 60){
    //     this.getCodeBtnDisable = false;
    //   }else{
    //     this.getCodeBtnDisable = true;
    //   }
    //   return this.getCodeBtnDisable
    // },
    messageCodeChange(){
        if( this.verificationCode.length ==6){
        this.loginBtnDisable = false;
      }else{
        this.loginBtnDisable = true;
      }
      return this.loginBtnDisable
    },
  },
  methods: {   
    /* 清空输入框 */
    clearModel(model) {
      this[model] = "";
    },   
    /* 获取验证码 */
    getCode() {
      // 判断手机格式是否正确
      if (!this.$configInfo.reg.telReg.test(this.telNumber)) {
            this.$store.dispatch("Toast", "请输入正确的手机号码");
            return false;
      }
      if(this.countTime < 60){            
            return false
      }
      // 获取短信验证码
       Public.API_GET({
        url: "sendVerifyForLogin",
        data:{mobile:this.telNumber,type:"update_mobile"},
        success: result => {
          if (result.isSuccess) { 
             this.$configInfo.setVerificationBtnDisable.call(
              this,
              result.data.smsCodeExistsTime,
              this.telNumber,
              "login"
            );
              
          }else {
              this.$store.dispatch("Toast",result.message);
          }
        }
      });
     
    },
    sure(){
      // 修改手机号接口
      Public.API_GET({
        url: "updateMobile",
        data:{mobile:this.telNumber,oldMobile:this.oldTel,smsCode:this.verificationCode},
        success: result => {
          if (result.isSuccess) {
              MessageBox.alert('手机号修改成功，请重新登录').then(action => {
                  Public.API_GET({
                      url: "loginOut",
                      success: result => {
                      if (result.isSuccess) { 
                          this.$store.dispatch("LoginOut")
                      }else {
                          this.$store.dispatch("Toast",result.message);
                        }
                      }
                    });   
              });
          }else {
             this.$store.dispatch("Toast",'验证码不正确，请重新输入')
          }
        }
      });
    },
  },
  mounted: function() {
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "修改手机号", false, "null", "", "");
    window.Hub.$emit("setFooter", false);
    $("body").css("background", "white");
  },
};
</script>
<style lang="scss" type="text/css">
@import "../../../assets/skin";
.mint-msgbox{
	width: 70%;
	border-radius: 15px;
  padding-bottom:20px;
}
.mint-msgbox-title{
	display: none;
}
.mint-msgbox-message{
	color: #333;
}
.mint-msgbox-btns{
	
}
.mint-msgbox-confirm{
	color: #fff;
  width: 40% !important;
}
.mint-msgbox-btn{
  @include common-btn-login;
	flex: none;
  margin: 0 auto;	
	border-radius: 20px;
}


.mint-msgbox-content{
	border-bottom:none;
}
</style>

<style lang="scss" type="text/css" scoped="">
@import "../../../assets/skin";
.login {
  height: 100%;
  background: white;
  padding:pxToRem(70) pxToRem(40);
  .userName,
  .password {
    @include common-sign;
  }
  .loginBtn {
    margin-top:pxToRem(100);
    input[type="button"] {
    
      @include common-btn-login;
      &.login-btn-disable {
        @include common-btn-disable();
      }
    }
  }
  .login-manner {
    font-size: pxToRem(28);
    color: $ft-333;
    text-align: center;
  }
 
  .get-code {
    @include common-get-code();
    .get-code-disable {
      @include common-btn-disable();
    }
  }

}
</style>