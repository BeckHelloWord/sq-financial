/*
 * @Introduction:'贷款信息页面'
 * @Author: beck
 * @Date: 2018-06-27 16:28:16
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-27 17:48:39
 */

<template>
	<div class="confirmation">
		<div class="detail clearfix">
			<div class="img">
				<img :src="info.imgSrc" alt="">
			</div>
			<div class="count">
				<div class="productName">{{info.name}}
					<span class="num">X{{baseOrderInfo.num}}</span>
				</div>
				<div class="offer">报价：&ensp;
					<span class="quotation price color fontSize45">{{info.totalPrice}}元</span>&ensp;</div>
			</div>
		</div>
		<div class="expense common" @click="costDetailVisible.costDetailVisible=true">
			<span class="left changeOne">查看费用明细</span>
			<span class="right"> > </span>
		</div>
		<template v-if="endInit&&buyWay==1">
			<div class="purchase">
				<div>
					<div class="common">
						<span class="left">购买方式</span>
						<span class="right">全款购买</span>
					</div>
					<div class="common">
						<span class="left">{{ remark.slice(0,-1) }}</span>
						<span class="right price color fontSize25">￥{{info.deposit}}</span>
					</div>
					<div class="common  weikuan">
						<span class="left">尾款金额</span>
						<span class="right">￥{{ weikuan }}</span>
					</div>
				</div>
			</div>
			<div class="progress">
				<p>
					<span class="verticalLine"></span>
					<span class="pgroess">购买流程</span>
				</p>
				<ul>
					<li>
						<img src="../../assets/images/icon_01.png" alt="">支付定金，等待提车通知</li>
					<li>
						<img src="../../assets/images/icon_03.png" alt="">前往门店，验车并交付尾款</li>
					<li>
						<img src="../../assets/images/icon_05.png" alt="">现场提车</li>
				</ul>
			</div>
		</template>
		<template v-if="endInit&&buyWay==0">
			<div class="purchase">
				<div>
					<div class="common">
						<span class="left">购买方式</span>
						<span class="right">贷款购买</span>
					</div>
					<div class="common">
						<span class="left">贷款名称</span>
						<span class="right">{{planname}}</span>
					</div>
					<div class="common">
						<span class="left">首付比例</span>
						<span class="right">{{initRate}}%</span>
					</div>
					<div class="common">
						<span class="left">贷款期限</span>
						<span class="right">{{period}}个月</span>
					</div>
					<div class="common">
						<span class="left">分期成本</span>
						<span class="right">￥{{totalCost}}</span>
					</div>
				</div>
			</div>

			<div class="progress">
				<p>
					<span class="verticalLine"></span>
					<span class="pgroess">购买流程</span>
				</p>
				<ul>
					<li>
						<img src="../../assets/images/icon_01.png" alt=""> 支付定金，等待资料审核</li>
					<li>
						<img src="../../assets/images/icon_02.png" alt="">贷款审批，待审核成功之后，获得提车通知</li>
					<li>
						<img src="../../assets/images/icon_03.png" alt="">前往门店，验车并交付首付款，提车回家</li>
					<li>
						<img src="../../assets/images/icon_04.png" alt="">贷后管理，查看还款账单，掌握贷款情况</li>
				</ul>
			</div>
		</template>
		<!-- 		<div class="reverse">
			<span class="payment">
				{{ remark }}
				<span class="price fontSize45 color remark">￥{{info.deposit}}</span>
			</span>
			<router-link :to="{path:'/pay/payment',query: {orderId:orderId}}">
				<button type="button">{{ bottomName }}</button>
			</router-link>
		</div> -->
		<div class="productBtns">
			<input type="button" value="提交订单" class="btn-confirm" @click="submitOrder">
		</div>
		<pop-up :costDetailVisible="costDetailVisible" :totalPrice="totalPrice" :baseOrderInfo="baseOrderInfo" :feeDetailInfo="feeDetailInfo" :orderId="orderId"></pop-up>
	</div>
</template>
<script>
import popUp from "../public/popUp.vue";
export default {
  data() {
    return {
      orderId: this.$route.params.goodsId,
      num: this.$route.query.num,
      buyWay: "",
      // 费用明细
      costDetailVisible: {
        costDetailVisible: false
      },
      // 传输到弹框的组件
      baseOrderInfo: "",
      feeDetailInfo: "",
      data: {},
      bottomName: "",
      planname: "",
      initRate: "",
      totalCost: "",
      info: {
        imgSrc: "",
        name: "",
        totalPrice: "",
        deposit: "",
        finalPayment: ""
      },
      weikuan: "",
      remark: "",
      model: "",
      totalPrice: 0,
      endInit: false
    };
  },
  components: {
    popUp
  },

  methods: {
    gotData2() {
      Public.API_GET({
        url: "getPayInfo",
        data: {
          orderId: this.orderId
        },
        success: result => {
          var data = result.data;
          this.endInit = true;
          if (result.isSuccess) {
            this.info.deposit = data.shouldPay;
            this.data = data;
            this.baseOrderInfo = data.baseInfo;
            this.feeDetailInfo = data.feeDetailInfo;
            this.buyWay = data.baseInfo.buyWay;
            for (var i = 0; i < this.feeDetailInfo.length; i++) {
              this.totalPrice += this.feeDetailInfo[i].displayPrice * 1;
            }
            this.info.imgSrc = data.baseInfo.image;
            this.info.name = data.baseInfo.name;
            this.info.totalPrice = data.baseInfo.totalPrice;
            if (data.baseInfo.buyWay == 0) {
              this.initRate = data.loanInfo.initRate;
              this.totalCost = data.loanInfo.totalCost;
              this.period = data.loanInfo.period;
              this.planname = data.loanInfo.planName;
            }
            this.weikuan = (data.baseInfo.totalPrice - data.shouldPay).toFixed(
              2
            );
            this.model = data.model;
            if (this.model == "deposit") {
              this.remark = "定金金额:";
              this.bottomName = "立即预定";
            } else if (this.model == "full") {
              this.remark = "全款金额：";
              this.bottomName = "立即购买";
              $(".weikuan").remove();
            } else if (this.model == "firstPayment") {
              this.remark = "首付款金额：";
              this.bottomName = "立即购买";
            } else {
              //tailMoney
              this.remark = "尾款金额：";
              this.bottomName = "立即购买";
              $(".weikuan").remove();
            }
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    submitOrder() {
      Public.API_GET({
        url: "confirmBuyWay",
        data: {
          orderId: this.orderId
        },
        success: result => {
          if (result.isSuccess) {
            this.$router.push("/pay/orderSuccess/" + this.orderId);
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    }
  },
  mounted() {
    window.Hub.$emit("setTitle", "购买方式确认", null, false, "", null);
    window.Hub.$emit("refresh", null);
    this.gotData2();
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/skin";
.confirmation {
  font-size: pxToRem(30);
  width: 100%;
  .detail {
    width: 100%;
    @include common-padding();
    padding-top: pxToRem(30);
    padding-bottom: pxToRem(30);
    background-color: $white;
    border-bottom: 1px solid $borderShallow;
    .img {
      display: table-cell;
      vertical-align: middle;
      width: 32%;
      text-align: center;
      img {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .count {
      display: table-cell;
      vertical-align: middle;
      width: 68%;
      padding-left: 2%;
      line-height: 1.2;
      .productName {
        position: relative;
        font-size: pxToRem(34);
        color: $ft-333;
      }
      .num {
        padding-left: 4%;
      }
      .offer {
        color: $ft-666;
        margin-top: pxToRem(5);
        font-size: pxToRem(30);
      }
    }
  }
  .expense {
    margin-bottom: pxToRem(40);
    color: $ft-333;
    span.changeOne {
      color: $ft-333;
    }
  }
  .purchase {
    margin-bottom: pxToRem(40);
  }
  .progress {
    color: $ft-333;
    background-color: $white;
    margin-bottom: pxToRem(70);
    p {
      width: 100%;
      height: pxToRem(125);
      line-height: pxToRem(125);
      vertical-align: middle;
      font-size: pxToRem(30);
      padding-left: pxToRem(50);
      span {
        display: inline-block;
        height: pxToRem(125);
        line-height: pxToRem(125);
      }
      .verticalLine {
        width: pxToRem(6);
        height: 35%;
        margin-top: pxToRem(30);
        background-color: $c-009cff;
      }
      .pgroess {
        position: relative;
        top: pxToRem(-10);
      }
    }
    ul {
      padding-bottom: pxToRem(30);
      li {
        vertical-align: middle;
        margin-bottom: pxToRem(40);
        font-size: pxToRem(30);
        img {
          margin-left: pxToRem(50);
          margin-right: pxToRem(30);
          width: 8%;
          height: 100%;
        }
      }
    }
  }
  .reverse {
    width: 100%;
    height: pxToRem(120);
    line-height: pxToRem(120);
    background-color: $white;
    color: $ft-333;
    padding-left: pxToRem(50);
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    .payment {
      display: inline-block;
      width: 60%; //    border: 1px solid green;
    }
    a {
      display: inline-block;
      width: 35%;
      text-align: right; //    border: 1px solid red;
      button {
        width: 100%;
        height: pxToRem(70);
        border-radius: pxToRem(50);
        background: -webkit-linear-gradient(left, #00c0ff, #009cff);
        /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right, #00c0ff, #009cff);
        /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right, #00c0ff, #009cff);
        /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #00c0ff, #009cff);
        /* 标准的语法 */
        color: $white;
      }
    }
  }
  .productBtns {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: pxToRem(12) 0;
    background: $white;
    .btn-confirm {
      @include common-btn-login();
      margin: 0 auto;
    }
  }
}

.remark {
  display: inline-block;
  width: 20%;
}

.price.color {
  color: $c-ff6d00 !important;
}

.fontSize45 {
  font-size: pxToRem(38);
}

.fontSize25 {
  font-size: pxToRem(30);
}

.common {
  height: pxToRem(100);
  line-height: pxToRem(100);
  font-size: pxToRem(30);
  background-color: $white;
  border-bottom: 1px solid $borderShallow;
  .left {
    float: left;
    margin-left: pxToRem(50);
    color: $ft-666;
  }
  .right {
    float: right;
    margin-right: pxToRem(50);
    color: $ft-333;
  }
}
</style>
