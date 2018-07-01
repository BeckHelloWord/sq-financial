<template>
    <div class="forget">
        <label class="tel">
            <div class="circle">
                <input type="tel" placeholder="输入手机号码" maxlength="11" v-model='telNumber' autocomplete="new-tel">
                <div class="del iconfont icon-clear" v-show='telNumber' @click="clearModel('telNumber')"></div>
            </div>
        </label>
        <label class="code">
            <div class="circle">
                <div class="get-code">
                    <div class="get-code-value">
                        <input type="tel" placeholder="短信验证码" v-model='code' maxlength="6" autocomplete="new-password">
                        <div class="del iconfont icon-clear" v-show='code' @click="clearModel('code')"></div>
                    </div>
                    <button type="button" class="get-code-btn" :class="{'get-code-disable': getCodeBtnDisable}" @click="getCode">{{getCodeTxt}}</button>
                </div>
            </div>
        </label>
        <label class="password">
            <input type="password" placeholder="输入新密码" v-model='password' ref="passwordVal" maxlength="30" minlength="6" autocomplete="new-password" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')">
            <div :class="{showPassword:true,iconfont:true,'icon-openEye':closePassword,'icon-closedEye':!closePassword}" v-show='password' @click='showPassword'></div>
            <div class="del iconfont icon-clear" v-show='password' @click="clearModel('password')"></div>
        </label>
        <div class="loginBtn">
            <input type="button" value="完成" @click='login' :class="{'login-btn-disable': !(this.code&&this.telNumber&&this.password.length>=6)}">
        </div>
    </div>
</template>
<script>
import { MessageBox } from "mint-ui";
export default {
  data: function() {
    return {
      telNumber: "",
      code: "",
      password: "",
      closePassword: false,
      getCodePending: true,
      getCodeBtnDisable: true,
      getCodeTxt: "获取验证码"
    };
  },
  watch: {
    telNumber: function(newVal, oldVal) {
      if (newVal) {
        /* 手机位数对&&验证码没有在获取中 */
        if (newVal.length == 11 && this.getCodePending) {
          this.$configInfo.checkCountDown.call(
            this,
            this.telNumber,
            "back_password"
          );
        } else {
          this.getCodeBtnDisable = true;
        }
      } else {
        this.getCodeBtnDisable = true;
      }
    }
  },
  methods: {
    /* 密码开闭眼 */
    showPassword() {
      this.$configInfo.swapPassWord.call(this);
    },
    clearModel(model) {
      this[model] = "";
    },
    /* 校验输入信息 */
    checkInfo() {
      if (!this.$configInfo.reg.telReg.test(this.telNumber)) {
        this.$store.dispatch("Toast", "请输入正确的手机号码");
        return false;
      } else if (!this.$configInfo.reg.codeReg.test(this.code)) {
        this.$store.dispatch("Toast", "请输入正确的验证码");
        return false;
      } else if (!this.$configInfo.reg.passwordReg.test(this.password)) {
        this.$store.dispatch("Toast", "请输入正确的密码");
        return false;
      } else {
        return true;
      }
    },
    /* 登录 */
    login() {
      if (!this.checkInfo()) {
        return false;
      }
      Public.API_GET({
        url: "backPassword",
        data: {
          mobile: this.telNumber,
          password: this.password,
          smsCode: this.code
        },
        success: result => {
          if (!result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
            return false;
          }
          MessageBox.alert("登录密码重置成功，请重新登录", "").then(action => {
            this.$store.dispatch("LoginOut");
          });
        }
      });
    },
    /* 获取验证码 */
    getCode() {
      if (!this.$configInfo.reg.telReg.test(this.telNumber)) {
        this.$store.dispatch("Toast", "请输入正确手机号");
        return false;
      }

      Public.API_GET({
        url: "sendVerifyForLogin",
        data: {
          mobile: this.telNumber,
          type: "back_password"
        },
        success: result => {
          if (result.isSuccess) {
            this.$configInfo.setVerificationBtnDisable.call(
              this,
              result.data.smsCodeExistsTime,
              this.telNumber,
              "back_password"
            );
            this.$store.dispatch("Toast", result.message);
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    }
  },
  mounted() {
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "忘记密码", false, null, " ", null);
    window.Hub.$emit("setFooter", false);
    $("body").css("background", "white");
  },
  beforeRouteLeave(to, from, next) {
    if (to.path != "/index/login" && to.path != "/index/resetPassword") {
      $("body").css("background", "#edf0f3");
    }
    next();
  }
};
</script>
<style lang="scss" type="text/css" scoped="">
@import "../../assets/skin";
.forget {
  padding: 0 pxToRem(30);
  .tel,
  .code,
  .password {
    @include common-sign;
  }
  .get-code {
    @include common-get-code();
    .get-code-disable {
      @include common-btn-disable();
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
}
</style>