<template>
	<div class="payment">
		<div class="details">
			<div class="cash padBotton25 price ">￥{{cash | formatMoney}}</div>
			<div class="num padBotton25">
				订单号：{{ num }}
				<button class="copy paddingRight" v-clipboard:copy="num" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</button>
			</div>
			<div class="remark padBotton25">订单备注：{{remark}}</div>
		</div>
		<div class="account">
			<span class="purchase">线下购买</span>
			<div class="per">
				<div class="padBotton15 padTop15">
					<span>账户名称：&ensp;</span>{{ company }}</div>
				<div class="padBotton15">
					<span>转账账号： &ensp;</span>{{ account }}</div>
				<div class="padBotton15">
					<span>转账银行： &ensp;</span>{{ bank }}</div>
				<div class="padBotton15">
					<span>转账金额： &ensp;</span>￥{{ cash | formatMoney }}</div>
			</div>
			<div class="attention ">
				<upload @changeImg="changeImg" uploadTxt='上传附件' className='vouchers'></upload>
				<div class="care">
					<p>注意事项:</p>
					<ul>
						<li>1.请在转账时，备注订单号</li>
						<li>2.转账成功后，请上传转账凭证截图</li>
						<li>3.上传转账凭证截图后，请点击转账完成，通知平台</li>
						<li>4.如有任何问题，请联系客服
							<a :href="'tel:'+$configInfo.publicInfo.tel">{{$configInfo.publicInfo.tel}}</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div>
			<div class="finished">
				<button class="complete" @click="confirm" id="btn" :disabled='idDisabled' :class="{bgColor:!idDisabled}">转账完成</button>
			</div>
		</div>
	</div>
</template>
<script>
import { Toast } from "mint-ui";
import upload from "../public/upload";
export default {
  components: {
    upload
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      type: this.$route.query.type,
      num: this.$route.query.orderId,
      remark: "",
      account: "",
      bank: "",
      company: "",
      count: 0,
      imgBase: "", // 传输的图片的base64
      imgSuffix: "", // 传输图片的后缀名
      cash: "", // 转账金额
      model: "", // 转账模式,传输的类型
      tokenNum: "",
      start: "",
      isDisabled: ""
    };
  },
  computed: {
    idDisabled() {
      if (this.imgBase) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
      return this.isDisabled;
    }
  },
  methods: {
    changeImg(imgType, imgBase) {
      this.imgSuffix = imgType;
      this.imgBase = imgBase;
    },
    /* 复制功能 */
    onCopy() {
      this.$store.dispatch("Toast", "订单号复制成功");
    },
    onError() {
      this.$store.dispatch("Toast", "订单号复制失败");
    },
    gotData() {
      Public.API_GET({
        url: "getPayInfo",
        data: { orderId: this.orderId, type: this.type ? "loan" : "" },
        success: result => {
          var data = result.data;
          if (result.isSuccess) {
            this.account = data.accountNo;
            this.bank = data.accountBank;
            this.company = data.accountName;
            this.cash = data.shouldPay;
            this.model = data.model;
            if (this.model == "deposit") {
              this.remark = "定金支付";
            } else if (this.model == "full") {
              this.remark = "支付全款";
            } else if (this.model == "firstPayment") {
              this.remark = "首付款支付";
            } else if (this.model == "loan") {
              this.remark = "还款支付";
            } else if (this.model == "tailMoney") {
              this.remark = "尾款支付";
            }
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /* 获取支付token */
    token() {
      Public.API_GET({
        url: "getPayToken",
        success: result => {
          var data = result.data;
          if (result.isSuccess) {
            this.tokenNum = data;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    /* 点击转账完成按钮完成转账 */
    confirm() {
      Public.API_GET({
        url: "transferAccounts",
        data: {
          orderId: this.orderId,
          model: this.model,
          transferMoney: this.cash,
          image: this.imgBase,
          imageSuffix: this.imgSuffix,
          token: this.tokenNum,
          type: this.type ? "loan" : ""
        },
        success: result => {
          var data = result.data;
          if (result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
            setTimeout(() => {
              this.$router.push({
                path: "/pay/deal/" + this.orderId
              });
            }, 2000);
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    }
  },

  mounted() {
    window.Hub.$emit("setTitle", "付款", false, null, "", null);
    window.Hub.$emit("refresh", null);
    this.gotData();
    this.token();
    $(".mint-loadmore-content").addClass("transform-no");
  },
  beforeDestroy() {
    $(".mint-loadmore-content").removeClass("transform-no");
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/skin";
.payment {
  width: 100%;
  background-color: $background;
  color: $black;
  font-size: pxToRem(25);
  .details {
    background-color: $white;
    @include common-padding();
    padding-top: pxToRem(40);
    .cash {
      text-align: center;
      font-size: pxToRem(65);
    }
    .copy {
      border: 1px solid $ft-dedede;
      text-align: center;
      display: inline-block;
      width: pxToRem(100);
      border-radius: pxToRem(10);
      background-color: transparent;
      color: $ft-666;
    }
    .type {
      padding-top: pxToRem(70);
      text-indent: pxToRem(-80);
      font-size: pxToRem(30);
    }
  }
  .account {
    width: 100%;
    @include common-padding();
    font-size: pxToRem(30);
    background-color: $white;
    color: $ft-333;
    background-color: $white;
    .purchase {
      position: relative;
      display: block;
      padding: pxToRem(25) 0 pxToRem(25) pxToRem(20);
      height: pxToRem(90);
      line-height: pxToRem(40);
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        width: pxToRem(4);
        height: pxToRem(32);
        background: $c-009cff;
        transform: translateY(-50%);
      }
    }
  }
  .attention {
    padding-top: pxToRem(25);
    position: relative;
    .vouchers {
      background: url("../../assets/images/camera.png") no-repeat center 40%;
      background-size: 40%;
      text-align: center;
    }
    .wrap {
      margin: auto;
      border: 1px solid red;
    }
    .care {
      margin-top: pxToRem(50);
      padding-bottom: pxToRem(50);
      p {
        border-bottom: none;
      }
      ul {
        padding-bottom: pxToRem(50);
        li {
          margin-bottom: pxToRem(10);
        }
      }
    }
  }
  .finished {
    width: 100%;
    height: pxToRem(100);
    line-height: pxToRem(100);
    background-color: $white;
    color: $white;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100000000;
    .complete {
      width: 80%;
      height: pxToRem(70);
      line-height: pxToRem(70);
      text-align: center;
      margin: pxToRem(15) auto;
      border-radius: pxToRem(50);
      color: $white;
    }
    // 解决按钮设置为disabled属性后默认样式在ipone里面没有办法显示的问题
    button {
      cursor: pointer;
      -webkit-appearance: none;
    }
    button:disabled {
      background-color: #c0c0c0 !important;
    }
  }
}

.bgColor {
  background: linear-gradient(to right, #00c0ff, #009cff); /* 标准的语法 */
}
.price {
  color: $c-ff6d00;
}
.padBotton25 {
  padding-bottom: pxToRem(25);
}
.padBotton15 {
  padding-bottom: pxToRem(25);
}
.padTop15 {
  padding-top: pxToRem(40);
}
.borderWrap {
  border: 1px solid $border-shadow;
  border-radius: pxToRem(10);
}
.paddingRight {
  margin-right: pxToRem(60);
  float: right;
}
</style>
