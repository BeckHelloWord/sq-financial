/*
 * @Introduction:'确认订单'
 * @Author: beck
 * @Date: 2018-06-07 10:57:33
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-29 11:27:19
 */
<template>
	<div class="order">
		<!-- 订单信息 -->
		<div class="order-top">
			<div>
				<div class="img">
					<img :src="productObj.urlPath?productObj.urlPath.thumbnail:''" />
				</div>
				<div class="txt">
					<h3>
						<span class="juzhong">{{productObj.name}}</span>
					</h3>
					<p class="price clearfix">
						<span class="title">报价:</span>
						<span class="money" v-html="$formatPrice(productObj.price)"></span>
						<span class="nums">x{{productObj.count}}</span>
					</p>
				</div>
			</div>
			<p>{{productObj.spaceNames}}</p>
		</div>
		<!-- 提车地点 -->
		<div class="location">
			<p class="location-title">提车地点</p>
			<div class="location-txt" @click="popupVisible=true">
				<input type="text" class="location-value" placeholder="请选择提车门店地址" readonly v-model="location">
				<span class="location-select">请选择</span>
			</div>
			<mt-popup v-model="popupVisible" position="bottom" class="location-city" popup-transition="popup-fade">
				<mt-picker :slots="myAddressSlots" value-key='address' @change="onValuesChange">

				</mt-picker>
			</mt-popup>
		</div>
		<!-- 相关服务 -->
		<div class="item">
			<div class="title clearfix">
				<span class="fl">相关服务</span>
				<a :href="this.$store.getters.servicesUrl" target="_blank" class="fr">
					<span class="iconfont icon-service"></span>
				</a>
			</div>
			<div>
				<div class="service-item clearfix" v-for="item  in  data">
					<span class="fl">{{item.name}}</span>
					<template v-if="item.remark">
						<span class="tips icon-tishi iconfont" @click="showTips">
							<i>{{item.remark}}</i>
						</span>
					</template>
					<label class="fr">
						<input type="checkbox" @change="clickService" :data-price=item.displayPrice :data-id=item.serviceId checked>
						<span class="item-radio">
							<i class="iconfont icon-xuanzhong"></i>
						</span>
					</label>
					<span class="fr">¥ {{item.displayPrice}}</span>
				</div>
			</div>
		</div>
		<!-- 商品金额&&服务总价 -->
		<div class="item price">
			<ul>
				<li class="clearfix">
					<span class="fl">商品金额</span>
					<span class="fr">¥ {{goodsPrice | formatMoney}}</span>
				</li>
				<li class="clearfix">
					<span class="fl">服务总价</span>
					<span class="fr">+ ¥ {{servicePriceCount| formatMoney}}</span>
				</li>
			</ul>
		</div>
		<!-- 备注信息 -->
		<div class="item">
			<ul>
				<li class="remark clearfix">
					<span class="fl">备注信息：</span>
					<span>
						<textarea placeholder="请填写备注信息" v-model="remark"></textarea>
					</span>
				</li>
			</ul>
		</div>
		<!-- 确认订单按钮 -->
		<div class="order-btn clearfix">
			<span class="fl">
				<em>¥</em> {{totalPrice | formatMoney}}</span>
			<span class="fr" @click="quickSubmitOrder">确认订单</span>
		</div>
	</div>
</template>

<script type="text/javascript">
import { Popup, Picker } from "mint-ui";
export default {
  components: {
    mtPopup: Popup,
    mtPicker: Picker
  },
  data: function() {
    return {
      popupVisible: false,
      data: "",
      myAddressSlots: [
        {
          flex: 1,
          defaultIndex: 0,
          values: [],
          textAlign: "center"
        }
      ],
      orderToken: "",
      goodsId: this.$route.params.goodsId,
      productObj: {},
      servicePrice: 0,
      location: "",
      locationShipId: "",
      remark: "",
      services: []
    };
  },
  computed: {
    /* 商品金额*数量 */
    goodsPrice: {
      get: function() {
        return this.productObj.price * this.productObj.count;
      }
    },
    /* 服务金额 */
    servicePriceCount: {
      set: function(value) {
        this.servicePrice = value;
      },
      get: function() {
        return this.productObj.count * this.servicePrice;
      }
    },
    /* 总额 */
    totalPrice: {
      get: function() {
        return this.goodsPrice + this.servicePriceCount;
      }
    }
  },
  methods: {
    /* 选择城市 */
    onValuesChange(picker, values) {
      if (values[0]) {
        this.location = values[0].address;
        this.locationShipId = values[0].shopDeliveryId;
      }
    },
    /* 获得订单Token,提交订单的时候携带 */
    getOrderToken() {
      Public.API_GET({
        url: "getOrderToken",
        success: result => {
          if (result.isSuccess) {
            this.orderToken = result.data.token;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /* 提交订单 */
    quickSubmitOrder() {
      Public.API_GET({
        url: "quickSubmitOrder",
        data: {
          productId: this.productObj.productId,
          num: this.productObj.count,
          type: "car",
          token: this.orderToken,
          haveSpec: this.productObj.sn ? 1 : 0,
          remark: this.remark,
          services: this.services,
          shipId: this.locationShipId
        },
        success: result => {
          if (result.isSuccess) {
            this.$router.push({
              name: "way",
              params: { goodsId: result.data }
            });
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /*获得商品服务 */
    getGoodsServiceList() {
      Public.API_GET({
        url: "getGoodsServiceList",
        data: {
          goodsId: this.goodsId
        },
        success: result => {
          if (result.isSuccess) {
            this.data = result.data;
            // 默认累加
            var sum = 0;
            this.data.forEach(element => {
              sum += Number(element.displayPrice);
              this.services.push({
                serviceId: element.serviceId,
                num: this.productObj.count
              });
            });
            this.servicePriceCount = sum;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /* 获取自提点 */
    getFindDeliveryList() {
      Public.API_GET({
        url: "findDeliveryList",
        data: JSON.parse(localStorage.getItem("location")),
        success: result => {
          if (result.isSuccess) {
            this.myAddressSlots[0].values = result.data;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /* 显示tips */
    showTips(event) {
      var currentDom = event.target;
      document.querySelectorAll(".tips").forEach(function(element) {
        if (element == currentDom) {
          element.classList.toggle("showTips");
        } else {
          element.classList.remove("showTips");
        }
      });
    },
    /* 初始化信息 */
    init() {
      this.getOrderToken();
      this.getGoodsServiceList();
      this.getFindDeliveryList();
      $(".mint-loadmore-content").addClass("transform-no");
    },
    /* 选择规格 */
    clickService(event) {
      var tempPrice = 0;
      var checkedDom = document.querySelectorAll(
        "input[type='checkbox']:checked"
      );
      this.services = [];
      checkedDom.forEach(element => {
        tempPrice += +element.dataset.price;
        this.services.push({
          serviceId: element.dataset.id,
          num: this.productObj.count
        });
      });
      this.servicePriceCount = tempPrice;
    }
  },
  mounted: function() {
    window.Hub.$emit("setTitle", "确认订单", false, null, false, false);
    window.Hub.$emit("setFooter", false);
    this.$configInfo.getServiceUrl();
    this.init();
    this.productObj = JSON.parse(localStorage.getItem("productObj"));
  },
  beforeDestroy() {
    $(".mint-loadmore-content").removeClass("transform-no");
  }
};
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../../assets/skin";
.order {
  padding-bottom: pxToRem(120);
  .order-top {
    padding: pxToRem(30) pxToRem(30) 0;
    background-color: $white;
    & > p {
      padding: pxToRem(20) 0;
      border-top: 1px solid $ft-dedede;
      margin-top: pxToRem(20);
      font-size: pxToRem(26);
    }
    .img,
    .txt {
      display: table-cell;
      vertical-align: middle;
    }
    .img {
      position: relative;
      width: 36%;
      img {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
      }
    }
    .txt {
      width: 64%;
      padding-left: 2%;
      h3 {
        font-size: pxToRem(32);
        color: $ft-333;
      }
    }
  }
  .item {
    padding: 0 pxToRem(30);
    margin-top: pxToRem(20);
    background-color: $white;
    .title {
      line-height: pxToRem(24);
      padding: pxToRem(24) 0;
      border-bottom: 1px solid $ft-dedede;
      font-size: pxToRem(24);
      > span:first-child {
        padding-left: pxToRem(14);
        border-left: pxToRem(3) solid $c-009cff;
      }
    }
    .service-item {
      display: block;
      width: 100%;
      line-height: pxToRem(30);
      padding: pxToRem(24) 0;
      font-size: pxToRem(28);
      color: $ft-333;
      .tips {
        position: relative;
        i {
          display: none;
          position: absolute;
          top: -30px;
          left: 0;
          width: pxToRem(280);
          height: auto;
          font-size: pxToRem(22);
          color: $ft-666;
          padding: pxToRem(8);
          background: $c-f5faff;
          border-radius: pxToRem(10);
        }
      }
      .showTips {
        i {
          display: block;
        }
      }
      & > span:first-child {
        margin-right: 2%;
        max-width: 52%;
      }
      & + .service-item {
        border-top: 1px solid $ft-dedede;
      }
      &.remark {
        span:last-child {
          display: block;
          margin-left: pxToRem(146);
          textarea {
            width: 100%;
            height: pxToRem(120);
            line-height: pxToRem(30);
            border: none;
            resize: none;
          }
        }
      }
      .item-radio {
        float: left;
        width: pxToRem(34);
        height: pxToRem(34);
        line-height: pxToRem(34);
        border: 1px solid $ft-dedede;
        border-radius: 50%;
        margin: - pxToRem(2) 0 0 pxToRem(50);
        text-align: center;
        box-sizing: border-box;
        i {
          display: none;
        }
      }
      input[type="checkbox"] {
        opacity: 0;
      }
      input[type="checkbox"]:checked + .item-radio {
        background: $c-ff000;
        border-color: $c-009cff;
        background-color: $c-009cff;
        i {
          display: block;
          font-size: pxToRem(16);
          color: #fff;
        }
      }
    }
    li {
      line-height: pxToRem(30);
      padding: pxToRem(24) 0;
      font-size: pxToRem(28);
      color: $ft-333;
      overflow: hidden;
      & + li {
        border-top: 1px solid $ft-dedede;
      }
      &.remark {
        span:last-child {
          display: block;
          margin-left: pxToRem(146);
          textarea {
            width: 100%;
            height: pxToRem(120);
            line-height: pxToRem(30);
            border: none;
            resize: none;
          }
        }
      }
    }
    &.price {
      li {
        border-top: none;
        & + li {
          margin-top: - pxToRem(24);
        }
        span:last-child {
          color: $c-ff6d00;
        }
      }
    }
  }

  .order-btn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    line-height: pxToRem(72);
    padding: pxToRem(12) pxToRem(30);
    background-color: $white;
    span:first-child {
      font-size: pxToRem(50);
      color: $c-ff6d00;
      em {
        font-size: pxToRem(28);
      }
    }
    span:last-child {
      @include common-btn-login;
      width: pxToRem(240);
      height: pxToRem(72);
      line-height: pxToRem(72);
      margin: 0;
      text-align: center;
      box-shadow: 0 pxToRem(5) pxToRem(17) $c-00a3fa;
    }
  }
  .price {
    span {
      display: inline-block;
    }
    .title {
      width: 16%;
    }
    .money {
      width: 65%;
    }
    .nums {
      width: 15%;
      text-align: right;
    }
  }
  .location {
    margin-top: pxToRem(20);
    @include common-padding();
    padding-top: pxToRem(20);
    padding-bottom: pxToRem(20);
    background: $white;
    .location-title {
      margin-bottom: pxToRem(16);
      font-size: pxToRem(28);
      color: $ft-333;
    }
    .location-txt {
      padding: pxToRem(10) 0;
      height: pxToRem(48);
      line-height: pxToRem(28);
      font-size: 0;
      .location-select,
      .location-value {
        display: inline-block;
        font-size: pxToRem(28);
        color: $ft-999;
      }
      .location-select {
        position: relative;
        width: 20%;
        padding-right: pxToRem(20);
        text-align: right;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          right: 0;
          width: pxToRem(18);
          height: pxToRem(18);
          border: 1px solid $ft-999;
          border-top: none;
          border-left: none;
          transform: translateY(-50%) rotate(-45deg);
        }
      }
      .location-value {
        width: 80%;
        text-align: left;
      }
    }
  }
  .location-city {
    width: 100%;
    height: pxToRem(300);
    text-align: center;
  }
}
</style>
