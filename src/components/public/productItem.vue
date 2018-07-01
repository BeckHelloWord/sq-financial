<template>
    <li class="investitem">
        <router-link :to="{ path: '/models/detail/'+item.goodsId, params: { investId: item.id }}">
            <div class="investitem-img">
                <img :src="item.thumbnail">
            </div>
            <div class="investitem-txt">
                <p class="name">{{item.name}}</p>
                <p class="price">约为<span v-html="$formatPrice(item.price)"></span></p>
            </div>
        </router-link>
    </li>
</template>

<script>
export default {
  props: ["item"],
  methods: {
    formatSchedule(schedule) {
      if (
        schedule &&
        new Date(schedule.replace("-", "/")).getTime() > new Date().getTime()
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted: function() {},
  beforeMount: function() {}
};
</script>

<style lang="scss"  type="text/css">
@import "../../assets/skin";
.investitem {
  width: 48%;
  margin-bottom: 4%;
  &:nth-child(odd) {
    float: left;
  }
  &:nth-child(even) {
    float: right;
  }
  .investitem-img {
    position: relative;
    height: pxToRem(232);
    overflow: hidden;
    border-radius: pxToRem(6);
    & > img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .investitem-txt {
    padding: 0 pxToRem(20);
    .name {
      font-size: pxToRem(28);
      padding: pxToRem(22) 0;
      color: $ft-333;
      @include ellipsis();
    }

  }
}
</style>