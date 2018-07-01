<template >
    <div class="imagePreview">
        <!-- <div class="title"></div> -->
        <banner :banner='bannerList' :height='height' :showIndex=true :isAuto=0 :setImgFields='ImgFields'></banner>
    </div>
</template>
<script type="text/javaScript">
import banner from "../public/banner.vue";
export default {
  components: {
    banner
  },
  data: function() {
    return {
      height: "240px",
      ImgFields: "original", //banner组件图片取值字段
      bannerList: [],
      titleName: ""
    };
  },
  methods: {
    // goodsGalleryList
    gotData(goodsId) {
      Public.API_GET({
        url: "goodsGalleryList",
        data: { goodsId: goodsId },
        success: result => {
          if (!result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
            return false;
          }
          this.bannerList = result.data;
          window.Hub.$emit(
            "setTitle",
            result.data[0].goodsName,
            false,
            null,
            " ",
            null
          );
        }
      });
    }
  },
  mounted: function() {
    this.gotData(this.$route.params.id);
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setFooter", false);
    $("body").css("background", "#1b1b1b");
  },
  beforeDestroy() {
    $("body").removeAttr("style");
  }
};
</script>

<style  scoped   lang="scss"  type="text/css">
@import "../../assets/skin";
.imagePreview {
  width: 100%;
  margin-top: 45%;
  //   background-color: #1b1b1b;
  .title {
    color: $white;
    text-align: center;
    height: 120px;
    line-height: 120px;
    font-size: pxToRem(40);
  }
}
</style>

