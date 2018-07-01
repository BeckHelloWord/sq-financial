<template>
    <div class="result">
        <img src="../../../assets/images/icon-deal.png">
        <p class="title">补件申请成功</p>
        <p>我们会在2-3个工作日内对您的订单进行处理，</br>请注意查看如有任何疑问，请联系客服：</br>
            <a :href="'tel:'+$configInfo.publicInfo.tel">{{$configInfo.publicInfo.tel}}</a>
        </p>
        <router-link to="/loan/list" class="goOrders">查看订单</router-link>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
  mounted() {
    window.Hub.$emit("setTitle", "补件申请成功", false, null, "", null);
    window.Hub.$emit("refresh", null);
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/skin";
.result {
  line-height: 1.8;
  font-size: pxToRem(24);
  color: $c-999;
  text-align: center;
  img {
    width: 30%;
    margin-top: 12%;
  }
  .title {
    margin: pxToRem(46) 0;
    font-size: pxToRem(36);
    color: $ft-666;
  }
  a {
    color: $c-999;
  }
  .goOrders {
    display: block;
    margin: pxToRem(84) auto;
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
