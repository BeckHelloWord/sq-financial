/*
 * @Introduction:'补充材料照片' 
 * @Author: beck 
 * @Date: 2018-06-12 16:12:23 
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-20 15:02:01
 */

<template>
    <div class="upload-stuff">
        <p class="title">{{name}}</p>
        <upload @changeImg="changeImg" uploadTxt='上传附件' className='uploadImg'></upload>
        <div class="btns">
            <input type="button" value="确定" @click='define' :class="{'login-btn-disable':!imgBase}">
        </div>
    </div>
</template>
<script>
import upload from "../../public/upload";
export default {
  components: {
    upload
  },
  data() {
    return {
      name: this.$route.params.name,
      imgType: "",
      imgBase: "",
      orderId: this.$route.query.orderId
    };
  },
  methods: {
    define() {
      Public.API_GET({
        url: "uploadSupplementInfo",
        data: {
          imageName: this.name,
          image: this.imgBase,
          orderId: this.orderId,
          imageSuffix: "." + this.imgType
        },
        success: result => {
          if (result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
            setTimeout(() => {
              this.$router.go(-1);
            }, 2000);
          }
        }
      });
    },
    changeImg(imgType, imgBase) {
      this.imgType = imgType;
      this.imgBase = imgBase;
    }
  },
  mounted() {
    window.Hub.$emit("setTitle", this.name, false, null, "", null);
    window.Hub.$emit("refresh", null);
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/skin";
.upload-stuff {
  height: 100vh;
  background: $white;
  .title {
    padding: pxToRem(50) 0;
    font-size: pxToRem(28);
    color: $ft-333;
    text-align: center;
  }
  .uploadImg {
    &:before,
    &::after {
      content: "";
      width: pxToRem(2);
      height: pxToRem(100);
      background: $ft-999;
    }
    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(90deg);
    }
  }
  .btns {
    input[type="button"] {
      @include common-btn-login;
      &.login-btn-disable {
        @include common-btn-disable();
      }
    }
  }
}
</style>
