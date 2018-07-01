<template>
	<div class="loan-modules">
		<router-link :to="'/loan/detail/'+item.baseInfo.orderId">
			<p class="clearfix">
				<span class="date fl" v-if="showDate(item.baseInfo.statusDisplay)">
					还款日：{{item.baseInfo.date | formatDateLongToS }}
				</span>
				<span class="type fr">
					{{item.baseInfo.statusDisplay}}
				</span>
			</p>
			<div class="goods-info">
				<div class="goods-img">
					<img :src="item.baseInfo.image">
				</div>
				<div class="goods-txt">
					<p>
						<strong>{{item.baseInfo.name}}</strong><br/>
						<span>购买方式：{{item.baseInfo.buyWayDisplay=='贷款购买'?item.loanInfo.planName:item.baseInfo.buyWayDisplay}}</span>
					</p>
				</div>
			</div>
			<p class="total-price">总价：
				<span v-html="$formatPrice(item.baseInfo.totalPrice)"></span>
			</p>
		</router-link>

	</div>
</template>

<script>
export default {
  props: ["item"],
  mounted: function() {},
  methods: {
    showDate(type) {
      if (type == "还款中" || type == "逾期中" || type == "已完成") {
        return true;
      } else {
        return false;
      }
    }
  },
  beforeMount: function() {}
};
</script>

<style lang="scss"  type="text/css">
@import "../../assets/skin";
.loan-modules {
  margin-top: pxToRem(20);
  @include common-padding();
  background: $white;
  .date,
  .type {
    display: inline-block;
    padding: pxToRem(20) 0;
    font-size: pxToRem(26);
  }
  .date {
    width: 60%;
    text-align: left;
  }
  .type {
    width: 38%;
    text-align: right;
    color: $c-009cff;
  }
  .total-price {
    padding: pxToRem(20) 0;
    font-size: pxToRem(24);
    text-align: right;
    span {
      color: $c-ff6d00;
    }
  }
  .goods-info {
    position: relative;
    padding-bottom: pxToRem(20);
    padding-right: pxToRem(30);
    border-bottom: 1px solid $borderShallow;
    overflow: hidden;
    .goods-img {
      position: relative;
      float: left;
      width: 26%;
      height: pxToRem(134);
      img {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
      }
    }
    .goods-txt {
      float: right;
      width: 74%;
      padding-top: pxToRem(10);
      padding-left: pxToRem(20);
      line-height: 1.8;
      font-size: pxToRem(24);
      color: $c-999;
      strong {
        font-size: pxToRem(28);
        color: $ft-333;
      }
    }
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 2%;
      @include arrow-right();
      transform: translateY(-50%) rotate(45deg);
    }
  }
}
</style>
