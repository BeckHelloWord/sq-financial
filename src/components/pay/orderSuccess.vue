<template>
	<div class="deal">
		<img src="../../assets/images/icon-deal.png">
		<p>订单提交成功，稍后客服会和您进行订单信息沟通</br>
			如有任何疑问，请联系客服：
			<a :href="'tel:'+$configInfo.publicInfo.tel">{{$configInfo.publicInfo.tel}}</a>
		</p>
		<div class="btns clearfix">
			<a :href="this.$store.getters.servicesUrl" class="goOrders goServices fl" target="_blank">联系客服</a>
			<router-link to="/order/list" class="goOrders fr">查看订单</router-link>
		</div>

	</div>
</template>
<script>
export default {
  data() {
    return {
      orderId: this.$route.params.orderId
    };
  },
  methods: {},
  mounted() {
    window.Hub.$emit("setTitle", "提交成功", false, null, "", null);
    window.Hub.$emit("refresh", null);
    this.$configInfo.getServiceUrl();
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/skin";
.deal {
  line-height: 1.8;
  font-size: pxToRem(24);
  color: $c-999;
  text-align: center;
  @include common-padding();
  img {
    width: 30%;
    margin: 12% 0 8%;
  }
  .title {
    margin: pxToRem(46) 0;
    font-size: pxToRem(36);
    color: $ft-666;
  }
  .goOrders {
    display: inline-block;
    margin: pxToRem(50) 8%;
    width: 32%;
    height: pxToRem(72);
    line-height: pxToRem(72);
    color: $c-009cff;
    text-align: center;
    border: 1px solid $c-009cff;
    border-radius: pxToRem(36);
  }
}
</style>
