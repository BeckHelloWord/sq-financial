/*
 * @Introduction:'图片上传组件' 
 * @Author: beck 
 * @Date: 2018-06-12 16:10:17 
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-20 15:26:42
 */

<template>
    <div class="upload" :class="className">
        <i class="closed-thumb iconfont icon-clear" v-show="imgUrl" @click="removeImg"></i>
        <label :class="{mask:imgUrl}">
            <img :src="imgUrl" class="thumb" v-show ="imgUrl"/>
            <input type="file" accept="image/png, image/jpeg" @change="changeFile" ref='fileImg' />
            <p class="upload-txt" v-if="uploadTxt">{{uploadTxt}}</p>
        </label>
    </div>
</template>

<script>
export default {
  props: ["uploadTxt", "className"],
  data() {
    return {
      imgUrl: "",
      imgBase: "",
      imgType: "",
      start: "",
      delimiter: "base64,",
      maxsize: 1024 * 100
    };
  },

  methods: {
    changeFile() {
      var _file = this.$refs.fileImg.files[0];
      this.imgType = _file.type.substr(_file.type.indexOf("/") + 1);
      this.fileToBase64ByQuality(_file);
    },
    compress(img) {
      var initSize = img.src.length;
      var width = img.width;
      var height = img.height;
      // 用于压缩图片的canvas
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");

      // 瓦片canvas
      var tCanvas = document.createElement("canvas");
      var tctx = tCanvas.getContext("2d");

      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      var ratio;
      if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }

      canvas.width = width;
      canvas.height = height;

      // 铺底色,
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 如果图片像素大于100万则使用瓦片绘制
      var count;
      if ((count = width * height / 1000000) > 1) {
        //计算要分成多少块瓦片
        count = ~~(Math.sqrt(count) + 1);

        // 计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);

        tCanvas.width = nw;
        tCanvas.height = nh;

        for (var i = 0; i < count; i++) {
          for (var j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );

            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }

      //进行最小压缩
      var ndata = canvas.toDataURL("image/jpeg", 0.5);

      // console.log('压缩前：' + initSize);
      // console.log('压缩后：' + ndata.length);
      // console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

      return ndata;
    },
    // 转换为base64
    fileToBase64ByQuality(file, quality) {
      var _this = this;
      var fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function() {
        _this.imgUrl = this.result;
        var img = new Image();
        img.src = _this.imgUrl;
        if (_this.imgUrl.length <= _this.maxsize) {
          // 如果图片大小小于200kb，则直接上传
          _this.imgBase = _this.imgUrl.substr(
            _this.imgUrl.indexOf(_this.delimiter) + _this.delimiter.length
          );
          _this.$emit("changeImg", _this.imgType, _this.imgBase);
          return false;
        }
        img.onload = function() {
          if (img.complete) {
            //图片压缩
            _this.imgUrl = _this.compress(img);
            _this.imgBase = _this.imgUrl.substr(
              _this.imgUrl.indexOf(_this.delimiter) + _this.delimiter.length
            );
            _this.$emit("changeImg", _this.imgType, _this.imgBase);
          }
        };
      };
    },
    /* 删除图片 */
    removeImg() {
      this.imgUrl = "";
      this.$refs.fileImg.value = "";
      this.$emit("changeImg", "", "");
    }
  },
  mounted: function() {},
  beforeMount: function() {}
};
</script>

<style lang="scss" type="text/css">
@import "../../assets/skin";

.upload {
  position: relative;
  width: 66%;
  margin: 0 auto;
  border: pxToRem(2) solid $border-shadow;
  border-radius: pxToRem(10);
  label {
    display: block;
    height: pxToRem(280);
    input[type="file"] {
      opacity: 0;
    }
  }
  .mask {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: inherit;
      z-index: 99998;
      background: $white;
    }
  }
  .upload-txt {
    position: absolute;
    bottom: 10%;
    left: 0;
    width: 100%;
    font-size: pxToRem(28);
    color: $ft-666;
    text-align: center;
  }

  .thumb {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 99999;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .closed-thumb {
    position: absolute;
    top: -2%;
    right: 0;
    z-index: 999999;
  }
}
</style>