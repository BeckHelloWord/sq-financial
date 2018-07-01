/*
 * @Introduction:'购买方式'
 * @Author: beck
 * @Date: 2018-06-27 11:54:04
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-29 15:14:14
 */

<template>
	<div class="order-way">
		<div class="order-top">
			<div class="title clearfix">
				<span class="fl">{{baseOrderInfo.name}}</span>
				<a :href="this.$store.getters.servicesUrl" target="_blank" class="fr">
					<span class="fr iconfont icon-service"></span>
				</a>
			</div>
			<div class="label clearfix">
				<span class="fl">{{data.specDisplay}}</span>
				<span class="fr">x{{baseOrderInfo.num}}</span>
			</div>
			<div class="money clearfix">
				<span class="fr" v-if="baseOrderInfo.totalPrice">¥{{Number(baseOrderInfo.totalPrice).toFixed(2)}}</span>
			</div>
			<div class="look" @click="costDetailVisible=true">查看费用明细</div>
		</div>
		<div class="item buy-all clearfix">
			<span class="fl title-buy">全款购买</span>
			<span class="fr buy-btn" @click="quankuan ">立即购买</span>
		</div>
		<div class="item buy-loan clearfix">
			<div class="loan-title clearfix">
				<span class="fl title-buy">贷款方案</span>
				<span class="fr">首付:
					<span class="price" v-html="$formatPrice(firstMoeny)"></span>&ensp;期限:
					<em class="price">{{limit}}个月</em>
				</span>
			</div>
			<ul class="filter title-buy clearfix">
				<li @click="rateVisible=true">首付{{rate}}%
					<em class="iconfont icon-arrow-down"></em>
				</li>
				<li @click="limitVisible=true">期限{{limit}}个月
					<em class="iconfont icon-arrow-down"></em>
				</li>
			</ul>
			<div class="loan-list">
				<ul>
					<li v-for="(item,index) in findPlanList">
						<div class="title title-buy">{{item.planName}}</div>
						<div class="loan-price">
							<span class="price">{{item.amount}}</span>元/月</div>
						<div class="cost">分期成本
							<span>{{item.totalCost}}元</span>
						</div>
						<div class="buy-btn" @click="daikuan(index)">立即申请</div>
						<i class="iconfont icon-car"></i>
					</li>
				</ul>
			</div>
		</div>
		<mt-popup class="loan-popup" v-model="rateVisible" position="bottom">
			<mt-picker :slots="rateSlots" @change="onRateChange"></mt-picker>
			<div @click="rateVisible=false" class="close iconfont icon-X"></div>
		</mt-popup>
		<mt-popup class="loan-popup" v-model="limitVisible" position="bottom">
			<mt-picker :slots="limitSlots" @change="onLimitChange"></mt-picker>
			<div @click="limitVisible=false" class="close iconfont icon-X"></div>
		</mt-popup>
		<mt-popup class="loan-popup cost-popup" v-model="costDetailVisible" position="bottom">
			<dl class="clearfix">
				<dt>
					<img :src="baseOrderInfo.image" />
				</dt>
				<dd>
					<div>
						<h3>{{baseOrderInfo.name}}</h3>
						<p>{{data.specDisplay}}</p>
					</div>
				</dd>
			</dl>
			<ul>
				<li v-for="(item,index) in feeDetailInfo">
					<span class="fl">{{item.itemName}}x{{item.num}}</span>
					<span class="fr">{{index==0?'':'+'}}¥{{Number(item.displayPrice).toFixed(2)}}</span>
				</li>
				<li>
					<span class="fr">订单总价：
						<i class="price">¥</i>
						<em class="price" v-if="baseOrderInfo.totalPrice">{{Number(baseOrderInfo.totalPrice).toFixed(2)}}</em>
					</span>
				</li>
			</ul>
			<div @click="costDetailVisible=false" class="close iconfont icon-X"></div>
		</mt-popup>
	</div>
</template>

<script type="text/javascript">
import { Popup, Picker, MessageBox, Indicator } from "mint-ui";
export default {
  components: {
    mtPopup: Popup,
    mtPicker: Picker
  },
  computed: {
    firstMoeny: {
      get: function() {
        return this.baseOrderInfo.totalPrice * this.rate / 100;
      }
    }
  },
  data: function() {
    return {
      orderNum: this.$route.params.goodsId,
      planName: "",
      data: {},
      sign: false,
      baseOrderInfo: {},
      feeDetailInfo: [],
      // 利率
      rate: "",
      // 利率选择开关
      rateVisible: false,
      // 利率选择
      rateSlots: [
        {
          values: [],
          textAlign: "center",
          defaultIndex: 2
        }
      ],
      // 期限
      limit: "",
      // 期限选择开关
      limitVisible: false,
      // 期限选择
      limitSlots: [
        {
          values: [],
          textAlign: "center"
        }
      ],
      // 查看费用明细
      costDetailVisible: false,
      findPlanList: [],
      // buyWay
      buyWay: ""
    };
  },
  methods: {
    // 选择利率
    onRateChange(picker, values) {
      this.rate = values[0];
      this.findPlan();
    },
    // 选择期限
    onLimitChange(picker, values) {
      this.limit = values[0];
      this.findPlan();
    },
    /* 获得订单详情 */
    getOrderDetail() {
      Indicator.open({
        text: "订单正在处理中...",
        spinnerType: "fading-circle"
      });
      Public.API_GET({
        url: "getOrderDetail",
        data: {
          orderId: this.orderNum
        },
        success: result => {
          if (result.isSuccess) {
            Indicator.close();
            this.data = result.data;
            this.baseOrderInfo = result.data.baseOrderInfo;
            this.feeDetailInfo = result.data.feeDetailInfo;
            this.findInitialAndPeriod();
            this.sign = true;
          } else {
          }
        }
      });
    },
    quankuan() {
      this.buyWay = "1";
      this.gotData1();
    },
    daikuan(index) {
      this.buyWay = "0";
      this.gotData1(index);
    },
    gotData1(index) {
      var dataParam = {};

      /* 全款 */
      dataParam.buyWay = this.buyWay;
      dataParam.period = this.limit;
      dataParam.initRate = this.rate;
      dataParam.orderId = this.orderNum;

      /*贷款 */
      if (this.buyWay === "0") {
        dataParam.amount = this.findPlanList[index].amount;
        dataParam.planName = this.findPlanList[index].planName;
        dataParam.planId = this.findPlanList[index].planId;
      }
      // localStorage.setItem(this.orderNum, JSON.stringify(dataParam))
      Public.API_GET({
        url: "setBuyWay",
        data: dataParam,
        success: result => {
          var data = result.data;
          if (result.isSuccess) {
            window.Hub.$emit("faceCheck", this.orderNum, "firstOpen");
          } else {
            this.$store.dispatch("Toast", this.orderNum);
          }
        }
      });
    },
    /* 获得金融筛选条件 */
    findInitialAndPeriod() {
      Public.API_GET({
        url: "findInitialAndPeriod",
        success: result => {
          if (result.isSuccess) {
            this.rateSlots[0].values = result.data.inits;
            this.limitSlots[0].values = result.data.periods;
            this.findPlan();
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    findPlan() {
      if (!this.rate || !this.limit) {
        return false;
      }

      Public.API_GET({
        url: "findPlan",
        data: {
          amount: this.baseOrderInfo.totalPrice,
          init: this.rate,
          period: this.limit
        },
        success: result => {
          if (result.isSuccess) {
            this.findPlanList = result.data;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    // 初始化
    init() {
      this.getOrderDetail();
      var timer = setInterval(() => {
        if (this.sign) {
          clearInterval(timer);
          return false;
        }
        this.getOrderDetail();
      }, 3000);
      $(".mint-loadmore-content").addClass("transform-no");
    }
  },
  mounted: function() {
    window.Hub.$emit("setTitle", "购买方式", false, null, false, false);
    window.Hub.$emit("setFooter", false);
    this.$configInfo.getServiceUrl();
    this.init();
  },
  beforeDestroy() {
    $(".mint-loadmore-content").removeClass("transform-no");
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "order") {
      next(false);
      MessageBox({
        title: "提示",
        message: "您确定要取消支付？",
        showCancelButton: true
      }).then(value => {
        if (value === "confirm") {
          location.href = location.origin + "/#/order/detail/" + this.orderNum;
        }
      });
    } else {
      next();
    }
  }
};
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../../assets/skin";
.order-way {
  .order-top {
    padding: pxToRem(30) pxToRem(30) 0;
    background-color: $white;
    .title {
      line-height: pxToRem(32);
      font-size: pxToRem(32);
      color: $ft-333;
      span:first-child {
        display: inline-block;
        width: 90%;
      }
      span:last-child {
        color: $c-009cff;
      }
    }
    .label {
      padding-top: pxToRem(20);
      font-size: pxToRem(24);
      span:last-child {
        margin-top: - pxToRem(2);
        font-size: pxToRem(24);
      }
    }
    .money {
      line-height: 2;
      font-size: pxToRem(28);
      color: $c-ff6d00;
    }
    .look {
      position: relative;
      padding: pxToRem(20) 0;
      border-top: 1px solid $ft-dedede;
      margin-top: pxToRem(20);
      font-size: pxToRem(26);
      color: $ft-333;
      &::before {
        content: "";
        position: absolute;
        right: pxToRem(4);
        top: 50%;
        width: pxToRem(16);
        height: pxToRem(16);
        border: 1px solid $ft-999;
        border-width: 1px 1px 0 0;
        margin-top: - pxToRem(8);
        transform: rotate(45deg);
      }
    }
  }
  .title-buy {
    font-size: pxToRem(28);
    color: $ft-333;
    @include ellipsis();
  }

  .buy-btn {
    display: block;
    width: pxToRem(144);
    height: pxToRem(50);
    line-height: pxToRem(50);
    border: 1px solid $c-009cff;
    text-align: center;
    font-size: pxToRem(28);
    color: $c-009cff;
    border-radius: pxToRem(10);
  }
  .item {
    padding: 0 pxToRem(30);
    margin-top: pxToRem(20);
    background-color: $white;
    &.buy-all {
      line-height: pxToRem(50);
      padding: pxToRem(20) pxToRem(30);
    }
    &.buy-loan {
      .loan-title {
        line-height: pxToRem(88);
        span:last-child {
          font-size: pxToRem(24);
          em:first-child {
            margin-right: pxToRem(28);
          }
        }
      }
      .filter {
        line-height: pxToRem(88);
        border-top: 1px solid $ft-dedede;
        border-bottom: 1px solid $ft-dedede;
        li {
          float: left;
          width: 50%;
          text-align: center;
          em {
            margin-left: pxToRem(30);
            font-size: pxToRem(24);
          }
        }
      }
      .loan-list {
        li {
          position: relative;
          padding: pxToRem(40) 0 pxToRem(40) pxToRem(64);
          & + li {
            border-top: 1px solid $ft-dedede;
          }
          .loan-price {
            padding: pxToRem(10) 0 pxToRem(4);
            font-size: pxToRem(28);
            color: $ft-333;
            .price {
              color: $c-ff6d00;
            }
          }
          .cost {
            font-size: pxToRem(24);
          }
          .buy-btn {
            position: absolute;
            right: 0;
            bottom: pxToRem(42);
          }
          i {
            position: absolute;
            left: 0;
            top: pxToRem(36);
            color: $c-009cff;
          }
        }
      }
    }
  }
}

.loan-popup {
  left: 0;
  width: 100%;
  transform: translateX(0);
  border-radius: pxToRem(20) pxToRem(20) 0 0;
  &.cost-popup {
    padding: 0 pxToRem(30) pxToRem(30);
    dl {
      padding: pxToRem(50) 0 pxToRem(20);
      dt {
        position: relative;
        float: left;
        width: pxToRem(212);
        height: pxToRem(160);
        margin-right: pxToRem(20);
        img {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          margin: 0 auto;
          max-width: 100%;
          max-height: 100%;
        }
      }
      dd {
        display: table;
        height: pxToRem(160);
        & > div {
          display: table-cell;
          vertical-align: middle;
          h3 {
            font-size: pxToRem(32);
            font-weight: normal;
            color: $ft-333;
          }
          p {
            padding-top: pxToRem(10);
            font-size: pxToRem(24);
          }
        }
      }
    }
    li {
      line-height: pxToRem(88);
      border-top: 1px solid $ft-dedede;
      overflow: hidden;
      font-size: pxToRem(28);
      color: $ft-333;
      em {
        font-size: pxToRem(36);
      }
    }
  }
  .close {
    position: absolute;
    top: pxToRem(20);
    right: pxToRem(30);
    width: pxToRem(44);
    height: pxToRem(44);
    line-height: pxToRem(44);
    text-align: center;
    font-size: pxToRem(18);
    background-color: $e1;
    border-radius: 50%;
  }
}
</style>
