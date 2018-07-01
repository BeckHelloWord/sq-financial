<template>
	<div class="main-body">
		<my-header :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" v-show="showHeader"></my-header>
		<mt-loadmore :top-method="refresh" ref="my_track" @top-status-change="handleTopChange" :class="loadmoreTop">
			<div slot="top" class="mint-loadmore-top">
				<span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">
					<div class="loadingCoin"></div>
				</span>
				<span v-show="topStatus === 'loading'">
					<div class="loadingCoin"></div>
				</span>
			</div>
			<router-view></router-view>
		</mt-loadmore>
		<my-footer></my-footer>
	</div>
</template>

<script>
import "mint-ui/lib/style.css";
import "./assets/font/iconfont.css";
import "./assets/normalize.css";
import Interface from "./js/interface.js";
import header from "./components/public/header.vue";
import footer from "./components/public/footer.vue";
import Loadmore from "./components/public/loadmore.vue";
import Public from "./js/public.js";
import config from "./js/config.js";
window.Public = Public;
window.config = config;
export default {
  components: {
    myHeader: header,
    myFooter: footer,
    mtLoadmore: Loadmore
  },
  watch: {
    $route: function() {
      this.$refs.my_track.onTopLoaded();
    }
  },
  data() {
    return {
      title: "",
      leftIcon: "",
      rightIcon: "",
      showHeader: config.isWeiXin(),
      topStatus: "",
      toastFlag: false,
      loadmoreTop: ""
    };
  },
  methods: {
    handleTopChange(status) {
      this.topStatus = status;
    },
    refresh: function() {
      var _this = this;
      this.refreshFun(function() {
        _this.$refs.my_track.onTopLoaded();
      });
    },
    setTitle: function(Name) {
      this.title = Name;
      document.title = Name;
      var titletxt = Name;
      //解决ios无法获取title问题
      setTimeout(function() {
        var body = document.getElementsByTagName("body")[0];
        document.title = titletxt;
        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        var d = function() {
          setTimeout(function() {
            iframe.removeEventListener("load", d);
            document.body.removeChild(iframe);
          }, 0);
        };
        iframe.addEventListener("load", d);
        document.body.appendChild(iframe);
      }, 0);
    },
    refreshFun: function() {
      this.$refs.my_track.onTopLoaded();
    },
    refreshFunDef: function() {
      this.$refs.my_track.onTopLoaded();
    },
    rightFunDef: function() {},
    leftFunDef: function() {
      history.back();
    }
  },
  beforeCreate: function() {
    //设置下拉刷新方法
    window.Hub.$on("refresh", event => {
      if (typeof event == "function") {
        window.Hub.$emit("closeLoaderMore", true);
        this.refreshFun = event;
      } else {
        window.Hub.$emit("closeLoaderMore", false);
        this.refreshFun = this.refreshFunDef;
      }
    });
    //header事件
    window.Hub.$on(
      "setTitle",
      (title, leftIcon, leftFun, rightIcon, rightFun) => {
        this.leftIcon = leftIcon;
        this.rightIcon = rightIcon;

        window.Hub.$emit("hideHeader");
        var setLeftFun =
          typeof leftFun == "function" ? leftFun : this.leftFunDef;
        var setRightFun =
          typeof rightFun == "function" ? rightFun : this.rightFunDef;
        window.Hub.$emit("setHeader", setLeftFun, setRightFun);
        this.setTitle(title);
      }
    );
    window.Hub.$on("hideHeader", () => {
      this.showHeader = false;
      this.loadmoreTop = "";
      $(".mint-loadmore-content").css("paddingTop", "0");
    });
    window.Hub.$on("showHeader", () => {
      this.showHeader = false;
      this.loadmoreTop = "";
      $(".mint-loadmore-content").css("paddingTop", "0");
    });

    // 人脸识别
    window.Hub.$on("faceCheck", (orderId, first) => {
      Public.API_GET({
        url: "getToken",
        data: {
          orderId: orderId,
          return_url: "http://" + location.host + "/index.html#/pay/back",
          type: first
        },
        success: result => {
          if (!result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
            return false;
          }
          if (result.data.isNeedFace === "notNeed") {
            //不需要人脸识别
            this.$router.push({
              name: "confirm",
              params: {
                goodsId: orderId
              }
            });
          } else {
            //需要人脸识别
            location.href =
              "https://api.megvii.com/faceid/lite/do?token=" +
              result.data.token;
          }
        }
      });
    });
  },
  mounted: function() {}
};
</script>
<style lang="scss" type="text/css">
.transform-no {
  transform: none !important;
}
.noScorll {
  transform: none !important;
  overflow: hidden !important;
  height: 100%;
}
</style>
<style lang="sass-loader">
@import "./assets/skin";
@import "./assets/pubilc";
</style>

