/*
 * @Introduction:'商品详情'
 * @Author: beck
 * @Date: 2018-06-07 10:57:16
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-27 17:37:04
 */

<template>
	<div class="product">
		<!-- banner图 -->
		<div>
			<router-link :to="'/models/imagePreview/'+data.goodsId">
				<banner :banner='bannerList' height='240px' :showIndex=true :isAuto=0 :setImgFields='ImgFields'></banner>
			</router-link>
			<div class="brands">
				<h2 class="name">{{data.name}}</h2>
				<div class="info clearfix price">
					<p class="fl">报价：
						<span v-html="$formatPrice(data.price)"></span>
					</p>
					<a :href="this.$store.getters.servicesUrl" target="_blank">
						<span class="fr iconfont icon-service"></span>
					</a>
				</div>
			</div>
		</div>
		<!-- 详细参数 -->
		<div class="parameter" v-if="parameterList.hasParam">
			<p class="title">参数配置：</p>
			<div class="detailed">
				<div v-for="(item ,index) in parameterList.list">
					<p class="txt">{{item.value?item.value:'/'}}</p>
					<p class="type">{{item.name?item.name:'/'}}</p>
				</div>
			</div>
		</div>
		<!-- go更多参数 -->
		<div class="go-parameter">
			<router-link :to="{ name: 'parameter', params: { id: goodsId }}"> 查看更多参数 </router-link>
		</div>
		<!-- 确认订单按钮 -->
		<div class="productBtns" ref="productBtns">
			<input type="button" value="确认订单" class="btn-confirm" @click="isSelectDeploy=true" />
		</div>
		<!-- 确认按钮 -->
		<mt-popup v-model="isSelectDeploy" position="bottom" class="select-deploy">
			<i class="btn-close iconfont icon-X" @click="isSelectDeploy=false"></i>
			<div class="brands">
				<h2 class="name">{{data.name}}</h2>
				<p class="info price clearfix">报价：
					<span v-html="$formatPrice(productObj.price?productObj.price:data.price)"></span>
				</p>
			</div>
			<div class="deploy">
				<template v-if="shopSpec">
					<div class="deploy-item" v-for="item in shopSpec.specList">
						<p class="name">{{item.specName}}</p>
						<template v-for="valueList in item.valueList">
							<label>
								<input type="radio" ref="radioDom" :data-value="valueList.specValue" :name="item.specId" @change="getSelectRadio">
								<div class="deploy-detail">{{valueList.specValue}}</div>
							</label>
						</template>
					</div>
				</template>

				<div class="nums clearfix">
					<span class="fl">数量</span>
					<div class="fr nums-btns">
						<button type="button" @click="addNum(false)">-</button>
						<span>{{count}}</span>
						<button type="button" @click="addNum(true)">+</button>
					</div>
				</div>
			</div>
			<div class="completeBtns">
				<!-- 有规格必选，没规格可不选 -->
				<input type="button" value="确认" :class="{'btn-complete':true,'btn-complete-disable':isBtnCompleteDisable&&shopSpec.haveSpec}" @click="goComplete" />
			</div>
		</mt-popup>
	</div>
</template>

<script type="text/javascript">
import banner from "../public/banner";
import { Popup } from "mint-ui";
export default {
  components: {
    banner,
    mtPopup: Popup
  },
  data: function() {
    return {
      isSelectDeploy: false,
      ImgFields: "big", //banner组件图片取值字段
      bannerList: "", //产品图片
      data: {},
      count: 1,
      productObj: {},
      price: 0,
      goodsId: this.$route.params.id, //商品id
      /* 参数配置 */
      parameterList: {
        hasParam: false,
        list: []
      },
      shopSpec: {},
      resultVal: [],
      isBtnCompleteDisable: true //确认按钮不可用状态
    };
  },
  methods: {
    /* 操作数量 */
    addNum(type) {
      /* 加||减 */
      if (type) {
        ++this.count;
      } else {
        --this.count <= 0 ? (this.count = 1) : "";
      }
    },
    /* 商品详情 */
    getGoodsDetail() {
      Public.API_GET({
        url: "goodsDetail",
        data: {
          goodsId: this.goodsId
        },
        success: result => {
          if (result.isSuccess) {
            this.data = result.data;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    // 商品参数
    goodsParameters() {
      Public.API_GET({
        url: "goodsParameters",
        data: {
          goodsId: this.goodsId
        },
        success: result => {
          if (result.isSuccess) {
            this.parameterList.hasParam = result.data.hasParam;
            if (Array.isArray(result.data.paramList)) {
              result.data.paramList.forEach((element, index, array) => {
                for (var i = 0, len = element.paramList.length; i < len; i++) {
                  if (this.parameterList.list.length < 6) {
                    this.parameterList.list.push(element.paramList[i]);
                  }
                }
              });
            }
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    // 商品相册列表
    getGoodsGalleryList() {
      Public.API_GET({
        url: "goodsGalleryList",
        data: {
          goodsId: this.goodsId
        },
        success: result => {
          if (result.isSuccess) {
            this.bannerList = result.data;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /* 查询商品规格 */
    getGoodsShopSpec() {
      Public.API_GET({
        url: "goodsShopSpec",
        data: {
          goodsId: this.goodsId
        },
        success: result => {
          if (result.isSuccess) {
            this.shopSpec = result.data;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    saveInfo() {
      /* 确认订单需要使用 */
      this.productObj.count = this.count;
      this.productObj.name = this.data.name;
      this.productObj.urlPath = this.bannerList[0];
      /* 没有规格取默认价格 */

      if (!this.shopSpec.haveSpec) {
        this.productObj.price = this.data.price;
        this.productObj.productId = this.goodsId;
      }
      localStorage.setItem("productObj", JSON.stringify(this.productObj));
    },
    /* 初始化信息 */
    initData() {
      this.getGoodsGalleryList();
      this.getGoodsDetail();
      this.goodsParameters();
      this.getGoodsShopSpec();
    },
    goComplete() {
      this.saveInfo();
      this.$router.push({ name: "order", params: { goodsId: this.goodsId } });
    },
    getSelectRadio() {
      var radioDomList = document.querySelectorAll(
          "input[type='radio']:checked"
        ) /* 获得选中的规格 */,
        specs = "",
        specsName = "";

      /* 必须选择所有规格 */
      if (radioDomList.length == this.shopSpec.specList.length) {
        /* 获取选中的选项 */
        radioDomList.forEach((element, index, array) => {
          specs +=
            element.dataset.value + (index == array.length - 1 ? "" : "、");
        });
        /* 根据选中的匹配结果 */
        var resultVal = this.shopSpec.productList.filter(
          (element, index, array) => {
            return element.specs == specs;
          }
        );

        this.resultVal = resultVal[0];

        /* 保存筛选出来的结果 */
        this.resultVal = resultVal[0];
        this.productObj.sn = this.resultVal.sn;
        this.productObj.productId = this.resultVal.productId;
        this.$set(this.productObj, "price", this.resultVal.price);
        this.productObj.spaceNames = specs;
        this.saveInfo();
        this.isBtnCompleteDisable = false;
      } else {
        this.isBtnCompleteDisable = true;
      }
    }
  },
  mounted: function() {
    this.$configInfo.getServiceUrl();
    this.initData();
    window.Hub.$emit("setTitle", "商品详情", false, null, false, false);
    window.Hub.$emit("hideHeader");
    window.Hub.$emit("setFooter", false);

    $(".mint-loadmore-content").addClass("transform-no");
  },
  beforeDestroy() {
    $(".mint-loadmore-content").removeClass("transform-no");
  }
};
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../assets/skin";
.product {
  min-height: 100vh;
  padding-bottom: pxToRem(94);

  .parameter {
    margin-top: pxToRem(20);
    @include common-padding;
    background: $white;
    .title {
      padding: pxToRem(14) 0;
      font-size: pxToRem(28);
      color: $ft-333;
      border-bottom: pxToRem(1) solid #e1e1e1;
    }
    .detailed {
      padding-top: pxToRem(40);
      font-size: 0;
      & > div {
        display: inline-block;
        width: 33.3%;
        line-height: 2;
        margin-bottom: pxToRem(38);
        font-size: pxToRem(28);
        color: $ft-333;
        text-align: center;
        .txt {
          @include ellipsis();
        }
        .type {
          font-size: pxToRem(26);
          color: $ft-666;
        }
      }
    }
  }
  .go-parameter {
    padding: pxToRem(28) 0;
    text-align: center;
    & > a {
      font-size: pxToRem(24);
      color: $ft-999;
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
  .brands {
    padding: pxToRem(30) pxToRem(90) pxToRem(30) pxToRem(30);
    background: $white;
    .name {
      margin-bottom: pxToRem(24);
      font-size: pxToRem(32);
      color: $ft-333;
      text-align: justify;
    }
    .info {
      font-size: pxToRem(24);
      color: $ft-666;
      strong {
        margin: 0 pxToRem(20);
        font-size: pxToRem(36);
        color: $c-ff6d00;
      }
    }
  }
  .select-deploy {
    width: 100%;
    max-height: 71%;
    overflow-y: auto;
    background: $white;
    .btn-close {
      position: absolute;
      top: 2%;
      right: 5%;
      width: pxToRem(44);
      height: pxToRem(44);
      line-height: pxToRem(50);
      font-size: pxToRem(22);
      text-align: center;
      background: $e1;
      border-radius: 50%;
    }
    .brands {
      border-top-left-radius: pxToRem(20);
      border-top-right-radius: pxToRem(20);
      .name {
        width: 92%;
      }
    }
    .nums {
      padding: pxToRem(30) 0 pxToRem(80);
      line-height: pxToRem(52);
      border-top: pxToRem(1) solid $e1;
      .nums-btns {
        button,
        span {
          display: inline-block;
          vertical-align: top;
          width: pxToRem(60);
          height: pxToRem(52);
          font-size: pxToRem(30);
          color: $c-999;
          text-align: center;
          background: $c-f5f5f5;
        }
        span {
          font-size: pxToRem(26);
          color: $ft-333;
        }
      }
    }
    .deploy {
      @include common-padding();
      background: $white;
      .deploy-item {
        padding: pxToRem(20) 0;
        border-top: pxToRem(1) solid $e1;
        & > label {
          position: relative;
          display: inline-block;
          margin-top: pxToRem(30);
          &:not(:first-child) {
            margin-right: pxToRem(20);
          }
          input[type="radio"] {
            position: absolute;
            top: 0;
            left: 0;
          }
          input[type="radio"]:checked + .deploy-detail {
            color: $white;
            @include common-gradient();
          }
        }
        .name {
          font-size: pxToRem(26);
          color: $ft-333;
        }
        .deploy-detail {
          padding: pxToRem(5) pxToRem(20);
          font-size: pxToRem(22);
          color: $ft-333;
          background: $c-f5f5f5;
          border-radius: pxToRem(25);
        }
      }
    }
    .btn-complete {
      @include common-btn-login();
      margin-top: 0;
      margin-bottom: pxToRem(15);
      .btn-completeBtns {
        text-align: center;
      }
    }
    .completeBtns {
      .btn-complete-disable {
        @include common-btn-disable();
      }
    }
  }
}
</style>
