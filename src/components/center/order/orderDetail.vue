<template>
	<div class="orderDetail">
		<div class="detailStatus clearfix">订单状态：
			<span>{{detail.baseOrderInfo.statusDisplay}}</span>
			<a :href="this.$store.getters.servicesUrl" target="_blank" class="fr">
				<span class="fr iconfont icon-service"></span>
			</a>
		</div>
		<div class="orderListBox">
			<div class="orderImage">
				<img :src="detail.baseOrderInfo.image" alt="">
			</div>
			<div class="orderInfo">
				<h2>{{detail.baseOrderInfo.name}}</h2>
				<p>{{detail.specDisplay}}</p>
			</div>
		</div>
		<div class="address">
			<i class="iconfont icon-dizhi"></i>&ensp;{{detail.pickUpPlace}}
		</div>
		<div class="fee" v-if="detail.baseOrderInfo.totalPrice">
			<h2>费用明细</h2>
			<div class="feeList">
				<ul>
					<li v-for="item in detail.feeDetailInfo">
						<label>{{item.itemName}}x{{item.num}}</label>
						<span>
							<i v-show="item.itemType!=0">+</i>￥{{Number(item.displayPrice).toFixed(2)}}</span>
					</li>
					<li class="total">
						<label>订单总价</label>
						<span>￥{{detail.baseOrderInfo.totalPrice}}</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="fee" v-if="(detail.alreadyPayInfo&&detail.alreadyPayInfo.length>0)||(detail.loanInfo)">
			<h2>付款明细</h2>
			<div class="feeList">
				<ul>
					<li>
						<label>购买方式</label>
						<span>{{detail.loanInfo?detail.loanInfo.planName:detail.baseOrderInfo.buyWayDisplay}}</span>
					</li>
					<template v-if="detail.alreadyPayInfo&&detail.alreadyPayInfo.length>0">
						<li v-for="payItem in detail.alreadyPayInfo">
							<label>{{payItem.payType|payType}}</label>
							<span>￥{{payItem.payAmount}}</span>
						</li>
					</template>
					<template v-if="detail.loanInfo">
						<li>
							<label>首付（{{detail.loanInfo.initRate}}%）</label>
							<span>￥{{detail.loanInfo.initAmount|formatMoney}}</span>
						</li>
						<li>
							<label>分期金额</label>
							<span>￥{{detail.loanInfo.loanAmount|formatMoney}}</span>
						</li>
						<li>
							<label>分期期限</label>
							<span>{{detail.loanInfo.period}}个月</span>
						</li>
						<li>
							<label>分期成本</label>
							<span>￥{{detail.loanInfo.totalCost|formatMoney}}</span>
						</li>
					</template>
					<template v-if="detail.baseOrderInfo.buyWay==1">
						<li>
							<label>申请时间</label>
							<span>{{detail.baseOrderInfo.date|formatDateLong}}</span>
						</li>
					</template>
					<template v-if="isViewContract(detail.baseOrderInfo.status)">
						<li>
							<router-link :to="'/contract/preview/'+ this.$route.params.orderId+'?type=readOnly'" target='_blank'>
								<label>查看合同</label>
								<span>
									<i class="iconfont icon-arrow-down"></i>
								</span>
							</router-link>
						</li>
					</template>

				</ul>
			</div>
		</div>
		<div class="loginBtn" v-if="detail.baseOrderInfo.status==600">
			<input type="button" value="支付首付" @click='toPayMoney'>
		</div>
		<div class="loginBtn" v-if="detail.baseOrderInfo.status==130">
			<input type="button" value="支付尾款" @click='toPayMoney'>
		</div>
		<div class="loginBtn" v-if="detail.baseOrderInfo.status==90">
			<input type="button" value="查看合同" @click='viewContract'>
		</div>
		<div class="borrowBtn" v-if="detail.baseOrderInfo.status==1000 && detail.baseOrderInfo.buyWay==0">
			<input type="button" value="查看还款计划" @click='toBorrow'>
		</div>
		<div class="detailBuy" v-if="detail.baseOrderInfo.status==100 || detail.baseOrderInfo.status==300 || detail.baseOrderInfo.status==50">
			<!-- 待付款状态不显示“取消订单” -->
			<span @click="cancelOrder" v-if="detail.baseOrderInfo.status!=100&&detail.baseOrderInfo.status!=600&&detail.baseOrderInfo.status!=300">取消订单</span>
			<template v-if="detail.baseOrderInfo.status==50">
				<span class="toPay" @click="changeBuy">立即购买</span>
			</template>
			<template v-else>
				<span class="toPay" @click="toPay">去付款</span>
			</template>
		</div>
	</div>
</template>

<script type="text/javascript">
import { MessageBox } from "mint-ui";
export default {
  data: function() {
    return {
      detail: {
        pickUpPlace: "",
        feeDetailInfo: [],
        alreadyPayInfo: [],
        specDisplay: "",
        deposit: "",
        model: "",
        baseOrderInfo: {
          name: "",
          totalPrice: "",
          status: "",
          buyWay: "",
          date: "",
          orderId: "",
          image: "",
          num: "",
          statusDisplay: "",
          buyWayDisplay: ""
        }
      }
    };
  },
  methods: {
    initData(finishFun) {
      Public.API_GET({
        url: "getOrderDetail",
        data: {
          orderId: this.$route.params.orderId
        },
        success: result => {
          if (result.isSuccess) {
            this.detail = result.data;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    cancelOrder() {
      MessageBox.confirm("请确认是否取消订单?")
        .then(action => {
          if (action == "confirm") {
            this.doCancel();
          }
        })
        .catch(e => {});
    },
    doCancel() {
      Public.API_GET({
        url: "operateOrder",
        data: {
          orderId: this.$route.params.orderId,
          type: "cancel",
          reason: ""
        },
        success: result => {
          if (result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
            setTimeout(() => {
				this.$router.push('/order/list');
            }, 2000);
          } else {
            this.$store.dispatch("Toast", "取消失败");
          }
        }
      });
    },
    toPay() {
      this.$router.push("/pay/payment/?orderId=" + this.$route.params.orderId);
    },
    changeBuy() {
      this.$router.push("/order/way/" + this.$route.params.orderId);
    },
    toPayMoney() {
      this.$router.push("/pay/payment/?orderId=" + this.$route.params.orderId);
    },
    toBorrow() {
      this.$router.push("/loan/detail/" + this.$route.params.orderId);
    },
    viewContract() {
      this.$router.push("/contract/preview/" + this.$route.params.orderId);
    },
    isViewContract(status) {
      /* 待付款、支付待审核、待提车、已完成、状态页面新增查看合同板块，点击打开签署后合同 */
      if (
        status != 0 &&
        status != 100 &&
        status != 50 &&
        status != 70 &&
        status != 90 &&
        status != 620 &&
        status != 900
      ) {
        return false;
      }
    }
  },
  created() {},
  mounted: function() {
    this.initData();
    this.$configInfo.getServiceUrl();
    window.Hub.$emit("refresh", null);
    $(".mint-loadmore-content").addClass("transform-no");
    window.Hub.$emit("setTitle", "订单详情", false, null, null);
    window.Hub.$emit("showHeader");
    window.Hub.$emit("setFooter", false);
  },
  beforeDestroy() {
    $(".mint-loadmore-content").removeClass("transform-no");
  },
  filters: {
    payType(value) {
      switch (value) {
        case "deposit":
          return "定金";
          break;
        case "full":
          return "全额";
          break;
        case "tailMoney":
          return "尾款";
          break;
        case "firstPayment":
          return "首付款";
          break;
        default:
          break;
      }
      return "dfghjk";
    }
  }
};
</script>
<style lang="scss" scoped type="text/css">
@import "../../../assets/skin";
.orderDetail {
  padding-bottom: pxToRem(100);
  .detailStatus {
    background-color: #fff;
    line-height: pxToRem(110);
    padding: 0 3%;
    font-size: pxToRem(26);
    color: #666666;
    span {
      color: $c-009cff;
    }
  }
  .orderListBox {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    padding: pxToRem(20) 0;
    margin: pxToRem(20) 0;
    background-color: #fff;
    .orderImage {
      height: pxToRem(135);
      overflow: hidden;
      position: relative;
      display: inline-block;
      width: 30%;
      img {
        width: pxToRem(180);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .orderInfo {
      width: 65%;
      display: inline-block;
      h2 {
        font-weight: normal;
        font-size: pxToRem(26);
        color: #333333;
        line-height: pxToRem(50);
      }
      p {
        font-size: pxToRem(24);
        color: #999999;
      }
    }
  }
  .address {
    background-color: #fff;
    color: #333333;
    font-size: pxToRem(26);
    line-height: pxToRem(110);
    padding: 0 3%;
  }
  .fee {
    padding: 0 3%;
    background-color: #fff;
    margin-top: pxToRem(20);
    h2 {
      font-weight: normal;
      line-height: pxToRem(70);
      border-bottom: 1px solid #e1e1e1;
      padding-left: 10px;
      position: relative;
      font-size: pxToRem(26);
      &::before {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        top: pxToRem(22);
        width: 2px;
        height: pxToRem(26);
        background-color: $c-009cff;
      }
    }
    .feeList {
      ul {
        padding: pxToRem(20) 0;
        li {
          line-height: pxToRem(60);
          font-size: 0;
          label {
            display: inline-block;
            width: 40%;
            font-size: pxToRem(26);
          }
          span {
            display: inline-block;
            width: 60%;
            font-size: pxToRem(26);
            text-align: right;
            vertical-align: middle;
            .icon-arrow-down {
              font-size: pxToRem(25);
              color: #999;
              float: right;
              transform: rotate(270deg);
            }
          }
        }
        .total {
          font-size: 0;
          label {
            font-size: pxToRem(34);
          }
          span {
            font-size: pxToRem(34);
            color: #ff6d00;
          }
        }
      }
    }
  }
  .detailBuy {
    position: fixed;
    width: 100%;
    bottom: 0;
    padding: pxToRem(20) 3%;
    text-align: right;
    background-color: #fff;
    span {
      display: inline-block;
      padding: pxToRem(15) pxToRem(35);
      border: 1px solid #999999;
      color: #999999;
      border-radius: pxToRem(40);
      margin: 0 pxToRem(20);
      font-size: pxToRem(32);
    }
    .toPay {
      border: 1px solid $c-009cff;
      color: $c-009cff;
    }
  }
  .loginBtn {
    input[type="button"] {
      @include common-btn-login;
      &.login-btn-disable {
        @include common-btn-disable();
      }
    }
  }
  .borrowBtn {
    input[type="button"] {
      display: block;
      width: 80%;
      height: pxToRem(70);
      line-height: pxToRem(70);
      margin: pxToRem(64) auto pxToRem(44);
      font-size: pxToRem(28);
      border-radius: pxToRem(35);
      border: 1px solid $c-009cff;
      color: $c-009cff;
      background-color: #fff;
    }
  }
}
</style>
