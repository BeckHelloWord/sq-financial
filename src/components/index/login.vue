<template>
    <div class="login">
        <!-- logo部分  common-logo样式在pubilc中公用-->
        <div class="logo">
            <img src="../../assets/images/sq_logo.png">
        </div>
        <!-- 手机号 -->
        <label class="userName">
            <input type="tel" placeholder="输入手机号" v-model='telNumber' maxlength="11" autocomplete="new-telNumber">
            <div class="del iconfont icon-clear" v-show='telNumber' @click="clearModel('telNumber')"></div>
        </label>
        <!-- 密码 -->
        <label class="password">
            <!-- 账号密码登录 -->
            <div v-show="loginManner">
                <input type="password" placeholder="登录密码" v-model='password' ref="passwordVal" maxlength="30" autocomplete="new-password" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')">
                <div :class="{showPassword:true,iconfont:true,'icon-openEye':closePassword,'icon-closedEye':!closePassword}" v-show='password' @click='showPassword'></div>
                <div class="del iconfont icon-clear" v-show='password' @click="clearModel('password')"></div>
            </div>
            <!-- 手机号登录 -->
            <div class="get-code" v-show="!loginManner">
                <div class="get-code-value">
                    <input type="tel" placeholder="短信验证码" v-model='verificationCode' maxlength="6" autocomplete="new-verificationCode">
                    <div class="del iconfont icon-clear" v-show='verificationCode' @click="clearModel('verificationCode')"></div>
                </div>
                <button type="button" class="get-code-btn" :class="{'get-code-disable': getCodeBtnDisable}" @click="getCode">{{getCodeTxt}}</button>
            </div>
        </label>
        <!-- 登录 -->
        <div class="loginBtn">
            <input type="button" value="登录" @click='login' :class="{'login-btn-disable':loginBtnDisable}">
        </div>
        <!-- 登录切换 -->
        <div class="login-manner">
            <span v-show="loginManner" @click="changeLoginManner">使用短信验证码登录</span>
            <span v-show="!loginManner" @click="changeLoginManner">使用密码登录</span>
        </div>
        <!-- 微信登录 -->
        <div class="weixin" v-show='isWeiXin' @click='loginByWeixin'>
            <div class="contain">
                <img src="../../assets/images/wx_login.png" alt="">
                <span>{{weixinLogin}}</span>
            </div>
        </div>
        <div class="btn-forget clearfix">
            <router-link to="/index/forget" class="fl">忘记密码?</router-link>
            <router-link to="/index/register" class="fr">注册</router-link>
        </div>

    </div>
</template>

<script>
export default {
  data: function() {
    return {
      telNumber: "",
      password: "",
      verificationCode: "",
      isWeiXin: false,
      getCodeTxt: "获取验证码",
      weixinLogin: "微信登录",
      loginManner: false /* 登录模块切换 */,
      getCodeBtnDisable: true /* 禁用获取验证码 */,
      getCodePending: true /* 验证码发送中 */,
      loginBtnDisable: true /* 登录按钮状态 */,
      closePassword: false,
      loginType: "smsLogin"
    };
  },
  watch: {
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

      /* 登录按钮状态验证 */
      if (this.loginManner) {
        this.loginAccount();
      } else {
        this.loginPhone();
      }
    },
    password(newVal, oldVal) {
      this.loginAccount();
    },
    verificationCode(newVal, oldVal) {
      this.loginPhone();
    }
  },
  methods: {
    /* 密码开闭眼 */
    showPassword() {
      this.$configInfo.swapPassWord.call(this);
    },
    /* 微信登录 */
    loginByWeixin() {
      var url = encodeURIComponent("/index");
      //线上地址
      var wx_url =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbfd7c3d589090b70&redirect_uri=http%3A%2F%2Fm.bxjr.com%2Flogin%2Findex.html?redirect=" +
        url +
        "&response_type=code&scope=snsapi_userinfo&state=wechat";
      //本地测试地址
      //wx_url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx524534af04a5662c&redirect_uri=http%3A%2F%2Fhzh.test.bawsun.com%2Flogin%2Findex.html?redirect="+url+"&response_type=code&scope=snsapi_userinfo&state=wechat";
      this.weixinLogin = "正在登录";

      clearTimeout(timer);
      var timer = setTimeout(function() {
        location.href = wx_url;
      }, 1000);
    },
    /* 清空输入框 */
    clearModel(model) {
      this[model] = "";
    },
    /* go注册 */
    goRegister() {
      this.$router.push({ path: "/index/register" });
    },
    /* 登录 */
    login() {
      if (!this.$configInfo.reg.telReg.test(this.telNumber)) {
        this.$store.dispatch("Toast", "请输入正确的手机号码");
        return false;
      }

      var parameter = {};
      if (this.loginType == "smsLogin") {
        if (!this.$configInfo.reg.codeReg.test(this.verificationCode)) {
          this.$store.dispatch("Toast", "请输入正确的验证码");
          return false;
        }
        /* 短信验证码登录 */
        parameter = {
          username: this.telNumber,
          password: this.verificationCode,
          type: this.loginType
        };
      } else {
        if (!this.$configInfo.reg.passwordReg.test(this.password)) {
          this.$store.dispatch("Toast", "请输入正确的密码");
          return false;
        }
        /* 正常手机号码和密码 */
        parameter = {
          username: this.telNumber,
          password: this.password,
          type: this.loginType
        };
      }

      Public.API_GET({
        url: "loginOn",
        data: parameter,
        success: result => {
          if (result.isSuccess) {
            Public.Auth.set(result);
            if (this.$route.query && this.$route.query.redirect) {
              this.$router.push(this.$route.query.redirect);
            } else {
              this.$router.push("/index/index");
            }
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /* 切换登录方式 */
    changeLoginManner() {
      this.loginManner = !this.loginManner;
      this.verificationCode = "";
      this.password = "";

      if (this.loginManner) {
        //账号密码登录
        this.loginType = "mobile";
        this.verificationCode = "";
        window.Hub.$emit("setTitle", "账号密码登录", false, "null", "", "");
      } else {
        //手机号登录
        this.loginType = "smsLogin";
        this.password = "";
        window.Hub.$emit("setTitle", "手机号快捷登录", false, "null", "", "");
      }
    },
    /* 获取验证码 */
    getCode() {
      if (!this.$configInfo.reg.telReg.test(this.telNumber)) {
        this.$store.dispatch("Toast", "请输入正确的手机号码");
        return false;
      }

      Public.API_GET({
        url: "sendVerifyForLogin",
        data: {
          mobile: this.telNumber,
          type: "login"
        },
        success: result => {
          if (result.isSuccess) {
            this.$configInfo.setVerificationBtnDisable.call(
              this,
              result.data.smsCodeExistsTime,
              this.telNumber,
              "login"
            );
            this.$store.dispatch("Toast", result.message);
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /* 手机登录前校验 */
    loginPhone() {
      if (this.telNumber.length == 11 && this.verificationCode.length == 6) {
        this.loginBtnDisable = false;
      } else {
        this.loginBtnDisable = true;
      }
    },
    /* 普通登录前校验 */
    loginAccount() {
      if (
        this.telNumber.length == 11 &&
        this.password &&
        this.password.length >= 6
      ) {
        this.loginBtnDisable = false;
      } else {
        this.loginBtnDisable = true;
      }
    }
  },
  mounted: function() {
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "手机号快捷登录", false, "null", "", "");
    window.Hub.$emit("setFooter", false);

    this.$configInfo.setVerificationBtnDisable.call(
      this,
      null,
      "loginCountDown"
    );

    // 判断是否微信
    // this.isWeiXin = this.$configInfo.isWeiXin();
    $("body").css("background", "white");
  },
  beforeRouteLeave(to, from, next) {
    if (to.path != "/index/register" && to.path != "/index/forget") {
      $("body").removeAttr("style");
    }
    next();
  }
};
</script>
<style lang="scss" type="text/css" scoped="">
@import "../../assets/skin";
.login {
  height: 100%;
  background: white;
  padding: 0 pxToRem(30);
  .logo {
    @include common-logo;
  }
  input {
    &[type="checkbox"] {
      width: pxToRem(16 * 2);
      height: pxToRem(16 * 2);
      float: left;
      margin-right: pxToRem(5 * 2);
      padding: 0;
      margin-top: pxToRem(9 * 2);
    }
  }
  .userName,
  .password {
    @include common-sign;
  }
  .remember {
    label {
      display: block;
      overflow: hidden;
      line-height: pxToRem(36 * 2);
      font-size: pxToRem(16 * 2);
      color: #666;
    }
  }
  .loginBtn {
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
  .weixin {
    position: relative;
    width: pxToRem(86 * 2);
    height: pxToRem(86 * 2);
    margin: 0 auto;
    box-sizing: border-box;
    border-radius: 50%;
    padding: pxToRem(10);
    text-align: center;
    border: pxToRem(2) solid $c-ddd;
    img {
      width: 70%;
      display: block;
      margin: 0 auto;
    }
    .contain {
      background: white;
      border-radius: 50%;
    }
  }
  .get-code {
    @include common-get-code();
    .get-code-disable {
      @include common-btn-disable();
    }
  }
  .btn-forget {
    display: block;
    margin: 30% auto 0;
    text-align: center;
    font-size: pxToRem(26);
    color: $ft-666;
  }
}
</style>