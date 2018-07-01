/*
 * @Author: beck 
 * @Date: 2018-06-04 11:13:08 
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-05 13:48:32
 */

<template>
    <div class="personal-info">
        <!-- 姓名 -->
        <label class="username">
            <input type="text" placeholder="姓名" v-model='userName' maxlength="4">
            <div class="del iconfont icon-clear" v-show='delUserName' @click="clearModel('userName')"></div>
        </label>
        <!-- 身份证号 -->
        <label class="id-card">
            <input type="text" placeholder="身份证号" v-model='idCard' maxlength="18">
            <div class="del  iconfont icon-clear" v-show='delIdCard' @click="clearModel('idCard')"></div>
        </label>
        <!-- 银行卡号 -->
        <label class="bank-card">
            <input type="tel" placeholder="银行卡号" v-model='bankCard' maxlength="21" minlength="16">
            <div class="del iconfont icon-clear" v-show='delBankCard' @click="clearModel('bankCard')"></div>
        </label>
        <div class="nextBtn">
            <input type="button" value="下一步" @click='goNext' :class="{'login-btn-disable':!(userName&&idCard&&bankCard)}">
        </div>
    </div>
</template>
<script>
export default {
  data: function() {
    return {
      userName: "",
      idCard: "",
      bankCard: "",
      delUserName: false,
      delBankCard: false,
      delIdCard: false
    };
  },
  watch: {
    userName(newVal, oldVal) {
      newVal ? (this.delUserName = true) : (this.delUserName = false);
    },
    bankCard(newVal, oldVal) {
      newVal ? (this.delBankCard = true) : (this.delBankCard = false);
    },
    idCard(newVal, oldVal) {
      newVal ? (this.delIdCard = true) : (this.delIdCard = false);
    }
  },
  methods: {
    /* 下一步 */
    goNext() {
      if (this.checkInfo()) {
      }
    },
    /* 校验输入信息 */
    checkInfo() {
      if (!this.$configInfo.reg.chineseNameReg.test(this.userName)) {
        this.$store.dispatch("Toast", "请输入正确的姓名");
        return false;
      } else if (!this.$configInfo.reg.chineseNameReg.test(this.idCard)) {
        this.$store.dispatch("Toast", "请输入正确的身份证号");
        return false;
      } else if (!this.$configInfo.reg.chineseNameReg.test(this.bankCard)) {
        this.$store.dispatch("Toast", "请输入正确的银行卡号");
        return false;
      } else {
        return true;
      }
    },
    /* 清空输入框 */
    clearModel(model) {
      this[model] = "";
    }
  },
  mounted() {
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "实名认证", false, null, " ", null);
    window.Hub.$emit("setFooter", false);
    $("body").css("background", "white");
  },
  beforeRouteLeave(to, from, next) {}
};
</script>

<style lang="scss" type="text/css" scoped="">
@import "../../assets/skin";
.personal-info {
  @include common-padding();
  .username,
  .id-card,
  .bank-card {
    @include common-sign();
  }
  .nextBtn {
    input[type="button"] {
      @include common-btn-login;
      &.login-btn-disable {
        @include common-btn-disable();
      }
    }
  }
}
</style>