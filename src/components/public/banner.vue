<template>
    <div class="banner">
        <template v-if="banner.length>0">
            <swipe :auto="autoSpeed" class="swipe" :style={height:height} @change="handleChange">
                <swipe-item v-for='item in banner' :key="item.id">
                    <a :href="item[jumpUrl]?item[jumpUrl]:'javascript:'">
                        <img :class="isFull?'':'isFull'" :src='item[setImgFields]' :title='item.title'>
                    </a>
                </swipe-item>
            </swipe>
            <p class="num" v-if="showIndex">
                <span>{{currentIndex}}</span>/<span>{{banner.length}}</span>
            </p>
        </template>
        <template v-else>
            <!-- 图片为空时显示，防止滑动报错 -->
            <div :style={height:height}></div>
        </template>
    </div>
</template>

<script>
import { Swipe, SwipeItem } from "mint-ui";
export default {
  components: {
    Swipe,
    SwipeItem
  },
  props: [
    "banner",
    "height",
    "showIndex",
    "isAuto",
    "setImgFields",
    "isFull",
    "jumpUrl"
  ],
  watch: {
    banner: function(newVal, oldVal) {
      this.currentIndex = newVal.length ? 1 : 0;
    }
  },
  data() {
    return {
      currentIndex: "",
      autoSpeed: this.isAuto == 0 ? 0 : 4000
    };
  },
  methods: {
    handleChange(index) {
      this.currentIndex = ++index;
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../assets/skin";

.banner {
  position: relative;
  .swipe {
    a {
      display: block;
      width: 100%;
      height: 100%;
      background: $white;
      img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
        width: 100%;
      }
      .isFull {
        margin-left: 50%;
        transform: translate(-50%);
        width: auto;
      }
    }
  }
  .num {
    position: absolute;
    bottom: pxToRem(30);
    right: pxToRem(30);
    padding: 0 pxToRem(20);
    height: pxToRem(40);
    line-height: pxToRem(40);
    background: rgba(0, 0, 0, 0.4);
    color: $white;
    border-radius: pxToRem(20);
  }
}
</style>