/*
 * @Introduction:'接口订单详情'
 * @Author: beck
 * @Date: 2018-06-11 19:12:36
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-29 18:50:26
 */
<template>
	<div class="loan-detail" v-if="dataObj">
		<!-- 订单状态 -->
		<p class="type">订单状态：
			<span>{{dataObj.baseInfo.statusDisplay}}</span>
		</p>
		<!-- 商品信息 -->
		<div class="goods-intro clearfix mt-20">
			<div class="goods-img fl">
				<img :src="dataObj.baseInfo.image">
			</div>
			<div class="goods-txt fr">
				<p class="name">{{dataObj.baseInfo.name}}</p>
				<p>{{dataObj.specDisplay}}</p>
			</div>
		</div>
		<!-- 提货地址 -->
		<div class="address mt-20">
			<p>
				<span class="iconfont icon-dizhi"></span>
				<span>提车地点：{{dataObj.pickUpPlace}}</span>
			</p>
		</div>
		<!-- 贷款期数 -->
		<table class="loan-list mt-20" v-if="dataObj.repaymentInfo">
			<thead>
				<tr>
					<th>期数</th>
					<th>应还金额(元)</th>
					<th>还款日期</th>
					<th>还款状态</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in dataObj.repaymentInfo">
					<td>
						<span class="nums">{{item.periods}}</span>/{{dataObj.repaymentInfo.length}}</td>
					<td>
						{{item.shouldRepaymentAmount}}</td>
					<td>
						{{item.shouldRepaymentDate}}</td>
					<td>
						<span class="loan-type">{{item.repaymentStatus}}</span>
					</td>
				</tr>
			</tbody>
		</table>
		<!-- 费用明细 -->
		<div class="details">
			<h2 class="title">费用明细</h2>
			<ul>
				<li v-for="item in dataObj.feeDetailInfo">
					<span class="fl">{{item.itemName}}x{{item.num}}</span>
					<span class="fr">￥{{item.displayPrice}}</span>
				</li>
				<li class="total-price">
					<span class="fl">订单总价</span>
					<span class="fr">￥{{dataObj.baseInfo.totalPrice}}</span>
				</li>
			</ul>
		</div>
		<!-- 付款明细 -->
		<div class="details">
			<h2 class="title">购车明细</h2>
			<ul>
				<li>
					<span class="fl">购买方式</span>
					<span class="fr">{{dataObj.loanInfo.planName?dataObj.loanInfo.planName:'贷款购买'}}</span>
				</li>
				<li>
					<span class="fl">首付({{dataObj.loanInfo.initRate}}%)</span>
					<span class="fr">￥{{dataObj.loanInfo.initAmount|formatMoney}}</span>
				</li>
				<li>
					<span class="fl">分期金额</span>
					<span class="fr">￥{{dataObj.loanInfo.loanAmount|formatMoney}}</span>
				</li>
				<li>
					<span class="fl">分期期限</span>
					<span class="fr">{{dataObj.loanInfo.period}}个月</span>
				</li>
				<li>
					<span class="fl">分期成本</span>
					<span class="fr">￥{{dataObj.loanInfo.totalCost|formatMoney}}</span>
				</li>
				<!-- 已还款||逾期中||还款中  显示-->
				<template v-if="isContract(dataObj.baseInfo.statusDisplay)">
					<li>
						<span class="fl">申请时间</span>
						<span class="fr">{{dataObj.baseInfo.date|formatDateLong}}</span>
					</li>
					<li class="pr">
						<a :href="dataObj.contractUrl" class="clearfix" target="_blank">
							<span class="fl">查看合同</span>
							<span class="fr arrow"></span>
						</a>
					</li>
				</template>
			</ul>
		</div>
		<!-- 立即还款按钮 待还款||逾期中 显示-->
		<div class="btns" v-if="isRepaymentBtn">
			<input type="button" value="立即还款" class="btn-loan" @click="goRepayment" />
		</div>
		<!-- 补件按钮 -->
		<router-link :to="{path: '/supplement/list/'+orderId}" class="supplement-btn" v-if="dataObj.baseInfo.statusDisplay=='待补件'">去补件</router-link>
	</div>
</template>

<script>
export default {
  data: function() {
    return {
      orderId: this.$route.params.orderId,
      dataObj: null,
      isRepaymentBtn: false
    };
  },
  methods: {
    /* 是否显示合同&&申请时间 */
    isContract: function(type) {
      if (type == "已还款" || type == "逾期中" || type == "还款中") {
        return true;
      } else {
        return false;
      }
    },
    /* 初始化 */
    initData() {
      Public.API_GET({
        url: "getLoanDetailInfo",
        data: {
          orderId: this.orderId
        },
        success: result => {
          this.dataObj = result.data;
          this.isRepayment(this.dataObj.repaymentInfo);
        }
      });
    },
    /* 贷款列表中状态有”还款中“||'已逾期'就显示按钮 */
    isRepayment(data) {
      if (!data) {
        return false;
      }
      for (var i = 0, len = data.length; i < len; i++) {
        var status = data[i].repaymentStatus;
        if (status == "还款中" || status == "已逾期") {
          this.isRepaymentBtn = true;
          return false;
        }
      }
    },
    goRepayment() {
      this.$router.push("/pay/payment?orderId=" + this.orderId + "&type=loan");
    }
  },
  mounted: function() {
    this.initData();
    window.Hub.$emit("setTitle", "借款详情", false, null, " ", null);
    window.Hub.$emit("setFooter", false);
    $(".mint-loadmore-content").addClass("transform-no");
  },
  beforeDestroy() {
    $(".mint-loadmore-content").removeClass("transform-no");
  }
};
</script>
<style lang="scss" scoped  type="text/css">
@import "../../../assets/skin";
.loan-detail {
  padding-bottom: pxToRem(100);
  .pr {
    position: relative;
    a {
      display: block;
    }
  }
  .mt-20 {
    margin-top: pxToRem(20);
  }
  .type {
    @include common-padding();
    padding-top: pxToRem(36);
    padding-bottom: pxToRem(36);
    font-size: pxToRem(30);
    background: $white;
    & > span {
      color: $c-009cff;
    }
  }
  .goods-intro {
    @include common-padding();
    background: $white;
    .goods-img {
      position: relative;
      width: 30%;
      height: pxToRem(190);
      img {
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
    .goods-txt {
      width: 70%;
      padding-left: pxToRem(20);
      padding-top: pxToRem(50);
      .name {
        margin-bottom: pxToRem(20);
        font-size: pxToRem(32);
        color: $ft-333;
      }
    }
  }
  .address {
    @include common-padding();
    padding-top: pxToRem(30);
    padding-bottom: pxToRem(30);
    font-size: pxToRem(28);
    color: $ft-333;
    vertical-align: middle;
    background: $white;
    span:last-child {
      margin-left: pxToRem(20);
    }
  }
  .loan-list {
    table-layout: fixed;
    width: 100%;
    text-align: center;
    background: $white;
    thead {
      font-size: pxToRem(26);
      color: $ft-666;
      background: $c-f4faff;
    }
    td,
    th {
      padding: pxToRem(20) 0;
    }
    .nums {
      font-size: pxToRem(36);
    }
    .loan-type {
      color: $c-0090ff;
    }
  }
  .details {
    margin-top: pxToRem(20);
    @include common-padding();
    background: $white;
    .title {
      position: relative;
      padding: pxToRem(18) 0;
      padding-left: pxToRem(16);
      font-size: pxToRem(30);
      color: $ft-333;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        width: pxToRem(4);
        height: pxToRem(28);
        background: $c-009cff;
        transform: translateY(-50%);
      }
    }
    li {
      width: 100%;
      padding: pxToRem(26) 0;
      font-size: pxToRem(26);
      color: $ft-333;
      overflow: hidden;
    }
    .total-price {
      span:first-child {
        font-size: pxToRem(30);
        color: $ft-333;
      }
      span:last-child {
        font-size: pxToRem(32);
        color: $c-ff6d00;
      }
    }
  }
  .btns {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: pxToRem(12) 0;
    background: $white;
    .btn-loan {
      @include common-btn-login();
      margin: 0 auto;
    }
  }
  .supplement-btn {
    display: block;
    margin: pxToRem(80) auto 0;
    width: 80%;
    height: pxToRem(70);
    line-height: pxToRem(70);
    font-size: pxToRem(36);
    text-align: center;
    color: $c-009cff;
    border: pxToRem(1) solid $c-009cff;
    border-radius: pxToRem(35);
  }
  .arrow {
    position: absolute;
    top: 50%;
    right: pxToRem(10);
    @include arrow-right();
    transform: rotate(45deg) translateY(-50%);
  }
}
</style>
