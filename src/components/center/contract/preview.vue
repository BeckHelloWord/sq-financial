<template>
	<div class="preview">
		<div v-html='dataHtml'></div>
		<div class="confirm">
			<label @click.prevent="setBtnDisabled">
				<input type="checkbox" :checked='!btnDisabled' />签署合同则默认您同意该合同的所有条款
			</label>
			<div class="btns">
				<router-link :to="{path:'/contract/companyContract',query:{orderid:this.orderid}}" :class="{'btn-disable':btnDisabled}">以公司名义签署</router-link>
				<router-link :to="{path:'/contract/personalContract',query:{orderid:this.orderid}}" :class="{'btn-disable':btnDisabled}">以个人名义签署</router-link>
			</div>
		</div>
	</div>
</template>
<script>
export default {
  data: function() {
    return {
      orderid: this.$route.params.orderId,
      dataHtml: "",
      btnDisabled: false
    };
  },
  methods: {
    initData() {
      Public.API_GET({
        url: "previewContract",
        data: {
          orderId: this.$route.params.orderId,
          contractType: "main"
        },
        success: result => {
          if (result.isSuccess) {
            this.dataHtml = result.data;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    setBtnDisabled() {
      this.btnDisabled = !this.btnDisabled;
    }
  },
  mounted: function() {
    window.Hub.$emit("setTitle", "合同预览", false, null, " ", null);
    this.initData();
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/skin";
.preview {
  @include common-padding();
  .confirm {
    padding: pxToRem(80) 0;
    text-align: center;
    color: $ft-333;
    input[type="checkbox"] {
      position: relative;
      top: 2px;
    }
    .btns {
      margin: pxToRem(20) 0;
      .btn-disable {
        @include common-btn-disable();
      }
      a {
        display: inline-block;
        margin: 0 5%;
        padding: 0 pxToRem(30);
        height: pxToRem(70);
        line-height: pxToRem(70);
        font-size: pxToRem(28);
        color: $white;
        border-radius: pxToRem(35);
        @include common-gradient();
      }
    }
  }
}
</style>
