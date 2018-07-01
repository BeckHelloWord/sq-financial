/*
 * @Introduction:'首页'
 * @Author: beck
 * @Date: 2018-06-22 14:38:18
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-27 14:17:14
 */

<template>
	<div class="index" v-if="loadEnd">
		<div class="banner-wrap">
			<banner :banner='bannerList' :isFull="true" :height='"150px"' :showIndex=false :setImgFields='ImgFields' jumpUrl='jumpUrl'></banner>
			<a @click="choiceCity()" class="address">{{chooseCity}}</a>
			<router-link to="/center/message" class="information iconfont  icon-message">
				<span v-if="mailList">{{mailList}}</span>
			</router-link>
		</div>
		<city :is-show.sync='city.isShow' :on-choose='onChoose' :city-data='city.cityData' :local-city='city.localCity' :close="close"></city>
		<div class="investList">
			<h2 class="investList-title">好车贩卖</h2>
			<ul class="clearfix" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
				<template v-for="item in investList">
					<productItem :item='item'></productItem>
				</template>
			</ul>
		</div>
		<div class="empty">
			<empty v-show='investList.length==0' :showImg='true' :padding='"120px"'></empty>
		</div>
	</div>
</template>

<script>
import banner from "../public/banner";
import productItem from "../public/productItem";
import empty from "../public/empty";
import city from "../public/cityPicker";
export default {
  components: {
    banner,
    productItem,
    empty,
    city
  },
  data: function() {
    return {
      chooseCity: "上海市",
      city: {
        isShow: false,
        cityData: [],
        onChoose: null,
        localCity: {
          cityId: 301,
          cityName: "上海市",
          citySpell: "SHANGHAI",
          cityFirstLetter: "S"
        }
      },
      ImgFields: "fileUrl", //banner组件图片取值字段
      bannerList: [], //banner图片列表
      investList: [], //商品列表
      offset: 1,
      max: 10,
      hasNext: true,
      initLock: true,
      loadEnd: false,
      mailList: null
    };
  },
  methods: {
    onChoose(res) {
      //ToDo: 选完城市后......
      this.city.isShow = false;
      this.chooseCity = res.cityName;
      localStorage.setItem(
        "location",
        JSON.stringify({ cityName: res.cityName, district: "", province: "" })
      );
    },
    choiceCity() {
      this.city.isShow = true;
      $(".mint-loadmore-content").addClass("noScorll");
      $(".mint-loadmore").addClass("noScorll");
    },
    close() {
      this.city.isShow = false;
      $(".mint-loadmore-content").removeClass("noScorll");
      $(".mint-loadmore").removeClass("noScorll");
    },
    /* 加载更多 */
    loadMore() {
      if (this.initLock) {
        return;
      }
      if (!this.hasNext) {
        return;
      }
      this.loading = true;
      Public.API_GET({
        url: "searchList",
        data: {
          pageNum: this.offset,
          pageSize: this.max
        },
        success: result => {
          if (!result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
          }
          this.investList = this.investList.concat(result.data);
          ++this.offset;
          this.loading = false;
          if (result.data.length < this.max) {
            this.hasNext = false;
          }
        }
      });
    },
    /* 初始化 */
    initData(finishFun) {
      this.loadEnd = false;
      Public.API_GET({
        url: "searchList",
        data: {
          pageNum: this.offset,
          pageSize: this.max
        },
        success: result => {
          if (!result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
            return false;
          }
          this.loadEnd = true;
          this.investList = result.data;
          ++this.offset;
          if (this.investList.length < this.max) {
            this.hasNext = false;
          }
          this.initLock = false;
          if (typeof finishFun == "function") {
            finishFun();
          }
        }
      });
    },
    /* 获得banner */
    getBannerList() {
      Public.API_GET({
        url: "getBannerList",
        data: {
          type: "appHomePage"
        },
        success: result => {
          if (!result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
            return false;
          }
          this.bannerList = result.data;
        }
      });
    },
    /* 获取未读消息 */
    getSiteMailList() {
      Public.API_GET({
        url: "getSiteMailList",
        data: {
          status: 0
        },
        success: result => {
          if (!result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
            return false;
          }
          this.mailList = result.data.length;
        }
      });
    },
    showMsg(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      var point = new BMap.Point(lng, lat); // 创建坐标点
      var myGeo = new BMap.Geocoder();
      myGeo.getLocation(point, result => {
        let myCity = {
          cityName: result.addressComponents.city,
          district: result.addressComponents.district,
          province: result.addressComponents.province
        };
        localStorage.setItem("location", JSON.stringify(myCity));
        var city = result.addressComponents.city;
        this.chooseCity = city;
        this.city.localCity.cityName = city;
      });
    },
    getPosition() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.showMsg(position);
          },
          error => {
            localStorage.setItem(
              "location",
              JSON.stringify({
                cityName: "上海市",
                district: "浦东新区",
                province: "上海市"
              })
            );
            /*             switch (error.code) {
              case 0:
                this.$store.dispatch(
                  "Toast",
                  "尝试获取您的位置信息时发生错误：" + error.message
                );
                break;
              case 1:
                this.$store.dispatch("Toast", "用户拒绝了获取位置信息请求。");
                break;
              case 2:
                this.$store.dispatch(
                  "Toast",
                  "浏览器无法获取您的位置信息：" + error.message
                );
                break;
              case 3:
                this.$store.dispatch("Toast", "获取您位置信息超时。");
                break;
            } */
          }
        );
      } else {
        this.$store.dispatch(
          "Toast",
          "您当前使用的浏览器不支持Geolocation服务"
        );
        localStorage.setItem(
          "location",
          JSON.stringify({
            cityName: "上海市",
            district: "浦东新区",
            province: "上海市"
          })
        );
      }
    }
  },
  mounted: function() {
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "首页", false, null, " ", null);
    window.Hub.$emit("setFooter", true);
    window.Hub.$emit("hideHeader");
    this.initData();
    this.getBannerList();
    this.getSiteMailList();
    this.getPosition();
  }
};
</script>

<style lang="scss" scoped="" type="text/css">
@import "../../assets/skin";
.index {
  .banner-wrap {
    position: relative;
    .address {
      position: absolute;
      top: 10px;
      left: 4%;
      font-size: pxToRem(30);
      color: $white;
      &::before {
        content: "";
        position: absolute;
        top: 40%;
        right: pxToRem(-30);
        width: pxToRem(14);
        height: pxToRem(14);
        border: pxToRem(2) solid $white;
        border-top: none;
        border-left: none;
        transform: translateY(-50%) rotate(45deg);
      }
    }
    .information {
      position: absolute;
      top: 10px;
      right: 4%;
      font-size: pxToRem(40);
      color: $white;
      span {
        position: absolute;
        top: -2%;
        right: -30%;
        min-width: 100%;
        height: pxToRem(30);
        line-height: pxToRem(30);
        font-size: pxToRem(24);
        color: $white;
        text-align: center;
        background: $c-ff6d00;
        box-shadow: 0 0 pxToRem(20) $c-ff6d00;
        border-radius: pxToRem(15);
      }
    }
  }
  .investList {
    margin-top: pxToRem(30);
    padding: 0 pxToRem(30) 44px;
    background: $white;
    .investList-title {
      position: relative;
      padding: pxToRem(30) 0 pxToRem(30) pxToRem(16);
      height: pxToRem(90);
      line-height: pxToRem(30);
      font-size: pxToRem(28);
      vertical-align: middle;
      color: $ft-333;
      vertical-align: middle;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        width: pxToRem(3);
        height: pxToRem(30);
        vertical-align: middle;
        background: $c-009cff;
        transform: translateY(-58%);
      }
    }
  }
}
</style>
