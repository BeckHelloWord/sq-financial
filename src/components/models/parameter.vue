/*
 * @Introduction:'商品参数'
 * @Author: beck
 * @Date: 2018-06-14 17:01:33
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-22 15:47:52
 */

<template>
	<div class="product-parameter">
		<div class="item" v-for="list in paraLists">
			<div class="title">{{list.name}}</div>
			<ul>
				<li v-for="i in list.paramList">
					<span class="fl">{{i.name?i.name:i.attrName}}</span>
					<span class="fr">{{i.value?i.value:i.attrValue}}</span>
				</li>
			</ul>
		</div>
		<div class="menu" v-if='paraLists.length>0'>
			<div class="iconfont icon-menu" @click="menuBol = !menuBol"></div>
			<ul v-show="menuBol">
				<li v-for="(item,key) in paraLists" @click="goItem(key)">{{item.name}}</li>
			</ul>
		</div>
		<div v-show="backTopBol" class="back-top iconfont icon-back-top" @click="backTop"></div>
		<div class="empty">
			<empty v-show='paraLists.length==0' :showImg='true' :padding='"20%"'></empty>
		</div>
	</div>
</template>

<script type="text/javascript">
import empty from "../public/empty";
export default {
  components: {
    empty
  },
  data: function() {
    return {
      // menu的控制开关
      menuBol: false,
      // 返回顶部的控制开关
      backTopBol: false,
      // 产品特性
      attribute: {},
      // 产品规格属性
      paraLists: [],
      //   产品id
      goodsId: null
    };
  },
  methods: {
    // 返回顶部
    backTop() {
      $("html,body").animate({ scrollTop: 0 }, 500);
    },

    // 返回对应的锚点
    goItem(ind) {
      var t = $(".item")
        .eq(ind)
        .offset().top;
      $("html,body").animate(
        {
          scrollTop: t
        },
        500
      );
    },

    // 获取产品特性
    getAttribute() {
      Public.API_GET({
        url: "goodsAttribute",
        data: {
          goodsId: this.goodsId
        },
        success: res => {
          if (!res.isSuccess) {
            this.$store.dispatch("Toast", res.message).then(e => {});

            return false;
          }

          this.attribute.name = "基本特性";
          this.attribute.paramList = res.data;
          this.paraLists.push(this.attribute);
        }
      });
    },

    // 获取产品规格属性
    getParameters() {
      Public.API_GET({
        url: "goodsParameters",
        data: {
          goodsId: this.goodsId
        },
        success: res => {
          if (!res.isSuccess) {
            this.$store.dispatch("Toast", res.message).then(e => {});
            return false;
          }

          if (!res.data.hasParam) {
            return false;
          }

          for (let i = 0, len = res.data.paramList.length; i < len; i++) {
            this.paraLists.push(res.data.paramList[i]);
          }
        }
      });
    },
    init() {
      //   this.getAttribute();
      this.getParameters();
      $(".mint-loadmore-content").addClass("transform-no");
      $(window).scroll(e => {
        if (e.currentTarget.scrollY > 100) {
          this.backTopBol = true;
        } else {
          this.backTopBol = false;
        }
      });
    }
  },
  mounted: function() {
    window.Hub.$emit("setTitle", "商品参数", false, null, false, false);
    window.Hub.$emit("setFooter", false);
    this.goodsId = this.$route.params.id;
    this.init();
  },
  beforeDestroy() {
    $(".mint-loadmore-content").removeClass("transform-no");
  }
};
</script>

<style lang="scss" scoped="" type="text/css">
@import "../../assets/skin";

.product-parameter {
  .item {
    .title {
      line-height: pxToRem(60);
      padding: 0 pxToRem(30);
      font-size: pxToRem(24);
    }
    ul {
      background-color: $white;
      li {
        overflow: hidden;
        line-height: pxToRem(90);
        padding: 0 pxToRem(30);
        font-size: pxToRem(28);
        span:first-child {
          color: $ft-333;
        }
        & + li {
          border-top: 1px solid $e1;
        }
      }
    }
  }
}
.menu {
  position: fixed;
  right: pxToRem(30);
  bottom: pxToRem(90);
  z-index: 10;
  width: pxToRem(76);
  height: pxToRem(76);
  line-height: pxToRem(76);
  text-align: center;
  color: $white;
  background-color: $bo7;
  border-radius: 50%;
  & > div {
    font-size: pxToRem(24);
  }
  ul {
    position: absolute;
    right: 0;
    bottom: pxToRem(102);
    min-width: pxToRem(200);
    padding: pxToRem(20) pxToRem(30);
    background-color: $bo7;
    border-radius: pxToRem(10);
    &::before {
      content: "";
      position: absolute;
      top: 100%;
      right: pxToRem(20);
      border-top: pxToRem(14) solid $bo7;
      border-left: pxToRem(18) solid transparent;
      border-right: pxToRem(18) solid transparent;
    }
    li {
      line-height: pxToRem(64);
      font-size: pxToRem(28);
    }
  }
}
.back-top {
  position: fixed;
  right: pxToRem(30);
  bottom: pxToRem(190);
  z-index: 0;
  width: pxToRem(76);
  height: pxToRem(76);
  line-height: pxToRem(76);
  text-align: center;
  font-size: pxToRem(24);
  color: $ft-333;
  background-color: $white;
  border-radius: 50%;
  box-shadow: 0 pxToRem(5) pxToRem(17) rgba(0, 0, 0, 0.41);
}
</style>
