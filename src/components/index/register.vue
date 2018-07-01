<template>
	<div class="register">
		<div class="logo">
			<img src="../../assets/images/sq_logo.png">
		</div>
		<label class="tel">
			<input type="tel" placeholder="输入手机号" maxlength="11" v-model='telNumber' autocomplete="new-telNumber">
			<div class="del iconfont icon-clear" v-show='telNumber' @click="clearModel('telNumber')"></div>
		</label>
		<label class="verificate">
			<div class="get-code">
				<div class="get-code-value">
					<input type="tel" placeholder="短信验证码" v-model='verification' maxlength="6">
					<div class="del iconfont icon-clear" v-show='verification' @click="clearModel('verification')"></div>
				</div>
				<button type="button" class="get-code-btn" :class="{'get-code-disable': getCodeBtnDisable}" @click="sendVerification">{{getCodeTxt}}</button>
			</div>
		</label>
		<label class="password">
			<input type="password" placeholder="登录密码" v-model='password' ref="passwordVal" maxlength="30" minlength="6" autocomplete="new-password" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')">
			<div :class="{showPassword:true,iconfont:true,'icon-openEye':closePassword,'icon-closedEye':!closePassword}" v-show='password' @click='showPassword'></div>
			<div class="del iconfont icon-clear" v-show='password' @click="clearModel('password')"></div>
		</label>
		<p class="protocol">我已经阅读并同意
			<router-link to=''>《{{this.$configInfo.publicInfo.projectName}}注册协议》</router-link>
		</p>
		<div class="loginBtn">
			<input type="button" value="完成注册" @click='register' :class="{'login-btn-disable': !(this.telNumber&&this.password&&this.verification)}">
		</div>
	</div>
</template>

<script>
export default {
  data: function() {
    return {
      telNumber: "",
      password: "",
      verification: "",
      // 注册节流，避免重复点击
      registerThrottle: false,
      closePassword: false,
      getCodeBtnDisable: true,
      getCodePending: true /* 验证码发送中 */,
      getCodeTxt: "获取验证码"
    };
  },
  watch: {
    telNumber: function(newVal, oldVal) {
      if (newVal) {
        if (newVal.length == 11 && this.getCodePending) {
          this.$configInfo.checkCountDown.call(
            this,
            this.telNumber,
            "register"
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
    /* 切换密码状态 */
    showPassword() {
      this.$configInfo.swapPassWord.call(this);
    },
    /* 清空输入框 */
    clearModel(model) {
      if (model === "telNumber") {
        this.getCodeBtnDisable = true;
      }
      this[model] = "";
    },
    checkInfo() {
      if (!this.$configInfo.reg.telReg.test(this.telNumber)) {
        this.$store.dispatch("Toast", "请输入正确手机号");
        return false;
      } else if (!this.$configInfo.reg.codeReg.test(this.verification)) {
        this.$store.dispatch("Toast", "请输入正确的验证码");
        return false;
      } else if (!this.$configInfo.reg.passwordReg.test(this.password)) {
        this.$store.dispatch("Toast", "请输入正确的密码");
        return false;
      }
    },
    /* 注册 */
    register() {
      if (this.checkInfo()) {
        return false;
      }
      var data = {
        mobile: this.telNumber,
        smsCode: this.verification,
        password: this.password
      };

      if (this.registerThrottle) {
        return false;
      }
      // 改变节流状态
      this.registerThrottle = true;

      Public.API_GET({
        url: "register",
        data: data,
        success: result => {
          if (result.isSuccess) {
            Public.Auth.set(result);
            this.$store.dispatch("Toast", result.message);
            setTimeout(() => {
              this.$router.push({ path: "/center/mine" });
            }, 500);
          } else {
            this.registerThrottle = false;
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /* 获取短信验证码 */
    sendVerification() {
      if (!this.$configInfo.reg.telReg.test(this.telNumber)) {
        this.$store.dispatch("Toast", "请输入正确手机号");
        return false;
      }

      Public.API_GET({
        url: "sendVerifyForLogin",
        data: {
          mobile: this.telNumber,
          type: "register"
        },
        success: result => {
          if (result.isSuccess) {
            this.$configInfo.setVerificationBtnDisable.call(
              this,
              result.data.smsCodeExistsTime,
              this.telNumber,
              "register"
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
    window.Hub.$emit("setTitle", "注册", false, null, " ", null);
    window.Hub.$emit("setFooter", false);
    this.$configInfo.setVerificationBtnDisable.call(
      this,
      null,
      "registerCountDown"
    );
    $("body").css("background", "white");
  },
  beforeRouteEnter(to, from, next) {
    /* 如果有注册信息则载入 */
    if (from.path == "/index/protocol") {
      var registerInfo = null;
      try {
        registerInfo = localStorage.getItem("registerInfo");
      } catch (error) {
        registerInfo = sessionStorage.getItem("registerInfo");
      }
      var objInfo = JSON.parse(registerInfo);
      next(vm => {
        vm.telNumber = objInfo.telNumber;
        vm.verification = objInfo.verification;
        vm.recommendCode = objInfo.recommendCode;
        vm.verif = objInfo.verif;
      });
    } else {
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    /* 保存用户已填写的信息 */
    if (to.path == "/index/protocol") {
      try {
        localStorage.setItem(
          "registerInfo",
          JSON.stringify({
            tel: this.telNumber,
            verification: this.verification,
            recommendCode: this.recommendCode,
            verif: this.verif
          })
        );
      } catch (error) {
        sessionStorage.setItem(
          "registerInfo",
          JSON.stringify({
            tel: this.telNumber,
            verification: this.verification,
            recommendCode: this.recommendCode,
            verif: this.verif
          })
        );
      }
    }
    clearInterval(this.timer);

    if (to.path != "/index/login" && to.path != "/index/protocol") {
      $("body").css("background", "#edf0f3");
    }
    next();
  }
};
</script>

<style lang="scss" type="text/css" scoped="">
@import "../../assets/skin";
.register {
  height: 100%;
  background: white;
  padding: 0 pxToRem(30);
  font-size: pxToRem(28);
  .logo {
    @include common-logo;
  }
  .tel,
  .password,
  .verificate,
  .verify {
    @include common-sign();
  }
  .verificate {
    @include common-get-code();
    .get-code-disable {
      @include common-btn-disable();
    }
  }
  .protocol {
    padding: pxToRem(20) 0;
    font-size: pxToRem(22);
    color: $ft-999;
    a {
      color: $c-009cff;
    }
  }
  .verify {
    height: pxToRem(72);
    .left {
      width: 48%;
    }
    input {
      text-indent: 1em;
    }
    .right {
      width: 48%;
      height: 100%;
    }
  }
  .btn-register {
    @include common-btn-login();
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
