<template>
	<div class="identity">
		<div class="identity-success" v-if="loading">
			<div class="info">
				<div class="identity-info">
					<p class="title">识别中......</p>
				</div>
				<i class="box"></i>
			</div>
		</div>
		<template v-if="!loading">
			<div class="identity-success" v-if="through">
				<div class="info">
					<i class="iconfont icon-success"></i>
					<div class="identity-info">
						<p class="title">身份认证成功！</p>
					</div>
					<i class="box"></i>
				</div>
			</div>
			<div class="identity-fail" v-else>
				<div class="info">
					<i class="iconfont icon-error"></i>
					<div class="identity-info">
						<p class="title">身份认证失败！</p>
						<div class="tips">
							<p>认证成小秘诀</p>
							<ul>
								<li>镜头对准您的脸，按提示操作。</li>
								<li>请摘下眼镜，不要遮挡眼睛；不要戴帽子。</li>
								<li>光线充足；保持水平拍摄。</li>
							</ul>
						</div>
					</div>
					<i class="box"></i>
				</div>
				<div class="btnSign" @click="toIndex">返回首页</div>
				<div class="btnSign" @click="toList">订单列表</div>
			</div>
		</template>
	</div>
</template>
<script>
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      bizno: this.$route.params.bizno,
      text: "",
      text2: "",
      loading: true
    };
  },
  methods: {
    init() {
      // Indicator.open({
      // 	text: "认证中...",
      // 	spinnerType: "fading-circle"
      // });
      Public.API_GET({
        url: "getResult",
        data: {
          bizNo: this.bizno
        },
        success: result => {
          this.text = JSON.stringify(result);
          if (result.isSuccess) {
            Public.API_GET({
              url: "authData",
              data: {
                bizNo: this.bizno
              },
              success: result => {
                // Indicator.close()
                this.loading = false;
                if (result.isSuccess) {
                  this.through = true;
                  /* bizNO以Authentication 开头是首次 */
                  if (this.bizno.indexOf("Authentication") == "0") {
                    window.setTimeout(() => {
                      this.$router.push({
                        name: "confirm",
                        params: {
                          goodsId: result.data.orderId
                        }
                      });
                    }, 2000);
                  } else {
                    window.setTimeout(() => {
                      this.$router.push("/order/list");
                    }, 2000);
                  }
                } else {
                  this.through = false;
                  this.$store.dispatch("Toast", result.message);
                }
              }
            });
          } else {
            // Indicator.close()
            this.loading = false;
            this.through = false;
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    toIndex() {
      this.$router.push("/");
    },
    toList() {
      this.$router.push("/order/list");
    },
    toIndexAfter2() {
      window.setTimeout(() => {
        this.$router.push("/");
      }, 2000);
    },
    toListAfter2() {
      window.setTimeout(() => {
        this.$router.push("/order/list");
      }, 2000);
    },
    setBuyWay(dataParam) {
      Public.API_GET({
        url: "setBuyWay",
        data: JSON.parse(dataParam),
        success: result => {
          var data = result.data;
          if (result.isSuccess) {
          } else {
            this.$store.dispatch("Toast", this.orderNum);
          }
        }
      });
    }
  },
  mounted: function() {
    this.init();
    window.Hub.$emit("setTitle", "认证结果", false, null, " ", null);
    window.Hub.$emit("setFooter", false);
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/skin";
.identity {
  height: 100%;
  position: relative;
  .icon-error {
    color: red;
    font-size: pxToRem(180);
  }
  .icon-success {
    color: limegreen;
    font-size: pxToRem(180);
  }
  img {
    width: 100%;
  }
  .info {
    width: 100%;
    text-align: center;
    font-size: pxToRem(40);
    margin-top: pxToRem(80);
    position: relative;
    .identity-info {
      width: 90%;
      margin: 0 auto;
      position: relative;
      z-index: 999;
      background: $white;
      .title {
        position: relative;
        border-radius: 4px;
        -webkit-border-radius: 4px;
      }
      .tips {
        padding: 1.6rem 4rem;
        text-align: left;
        p {
          font-size: pxToRem(30);
          color: #666;
        }
        ul {
          li {
            font-size: pxToRem(26);
            color: #999;
            list-style: disc;
          }
        }
      }
    }
  }
  .box {
    width: 80%;
    height: 100%;
    margin: 0 auto;
    position: absolute;
    left: 10%;
    bottom: 0;
    z-index: 0;
    display: block;
    box-shadow: 0px 14px 40px rgba(114, 82, 0, 0.2);
  }
  .identity-success .title {
    height: 9rem;
    line-height: 9rem;
  }
  .btnSign {
    text-align: center;
    @include common-btn-login;
    width: 40%;
    float: left;
    margin: pxToRem(100) 5%;
  }
  .identity-fail .title {
    height: 5.4rem;
    line-height: 5.4rem;
    border-bottom: 1px dashed #dadade;
  }
  .identity-fail .title:before {
    left: -1rem;
  }
  .identity-fail .title:after {
    right: -1rem;
  }
}
</style>
