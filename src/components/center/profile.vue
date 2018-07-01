

<template>
<div class="profile">
        <div class="form-item head">
           <label>头像</label>
           <i class="iconfont icon-arrow-down right"></i>
           <div class="first">
                    <img v-show="MemberInfo.face" :src="MemberInfo.face"/>
                    <i class="iconfont icon-head"></i>
            </div>
            <upload @changeImg="changeImg" className='head-sculpture'>
            </upload>
        </div>
        <div class="form-item uname" @click="changeUname" >
            <label>用户名</label>
             <i class="iconfont icon-arrow-down right"></i>
            <span>{{MemberInfo.uname}}</span>
        </div>
        <div class="form-item">
            <label>绑定手机号</label>
             <span>{{hmobile}}</span>
        </div>
        <div class="form-item" @click="changeSex">
            <label>性别</label>
            <i class="iconfont icon-arrow-down right"></i>
            <span>{{sex|sexfilter}}</span>
        </div>
        <div class="form-item" @click="openPicker"><label>生日</label>
        <i class="iconfont icon-arrow-down right"></i>
        <span class="birthday">{{formatDate}}</span>
        </div>
        <mt-popup
            v-model="popupVisible"
            position="bottom"
            popup-transition="popup-fade">
            <mt-radio
            title="请选择性别"
            @change="check"
            v-model="sex"
            :options="options">
            </mt-radio>
        </mt-popup>
        <mt-datetime-picker
            ref="picker"
            type="date"
            position="bottom"
            cancelText="取消"
            @confirm="handleConfirm"
            @cancel="checkinCancel"
            :startDate="new Date('1960')"
            :endDate="new Date()"
            v-model="pickerValue"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            >
        </mt-datetime-picker>
</div>
</template>
<script>
import upload from "../public/upload";
import { MessageBox } from "mint-ui";
import { DatetimePicker } from "mint-ui";
import { Radio } from "mint-ui";
Vue.component(Radio.name, Radio);
Vue.component(Popup.name, Popup);
import { Popup } from "mint-ui";
import { Toast } from "mint-ui";
Vue.component(DatetimePicker.name, DatetimePicker);
export default {
  components: {
    upload
  },
  data() {
    return {
      options: [
        {
          label: "女",
          value: "0"
        },
        {
          label: "男",
          value: "1"
        }
      ],
      popupVisible: false,
      unameVisible: false,
      imgUrl:"",
      sex: "",
      MemberInfo: "",
      hmobile: "",
      birthday: "",
      imgData: "",
      // 传输的图片的base64
      imgBase: "",
      // 传输图片的后缀名
      faceSuffix: "",
      pickerValue: "",
      faceFlag: 0
    };
  },
  methods: {
    //获取用户信息
    getMemberInfo() {
      Public.API_GET({
        url: "getMemberInfo",
        success: result => {
          if (result.isSuccess) {
            this.MemberInfo = result.data;
            var Mobile = this.MemberInfo.mobile;
            var mymobile = Mobile.substr(3, 4);
            this.hmobile = Mobile.replace(mymobile, "****");
            if (this.MemberInfo.birthday) {
              this.pickerValue = this.stringToDate(this.MemberInfo.birthday);
            }
            this.sex = this.MemberInfo.sex;
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    changeImg(imgType, imgBase) {
      $(".first").hide();
      this.MemberInfo.face = "";
      this.faceSuffix = imgType;
      this.imgBase = imgBase;
      this.updateInfo("faceImage",this.imgBase,this.faceSuffix);
    },
    stringToDate(str) {
      var year = parseInt(str.substring(0, 4));
      var month = parseInt(str.substring(4, 6))-1;
      var day = str.substring(6, 8);
      var date = new Date(0);
      date.setFullYear(year, month, day);
      return date;
    },
    //修改用户信息函数
    updateInfo(type, value, suffix = "") {
      Public.API_GET({
        url: "updateInfo",
        data: {
          type: type,
          value: value,
          faceSuffix: suffix
        },
        success: result => {
          var data = result.data;
          if (result.isSuccess) {
            window.Hub.$emit("toast", result.message);
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
    //修改用户名弹窗
    changeUname() {
      MessageBox.prompt("请输入姓名")
        .then(({ value, action }) => {
          if (this.MemberInfo.changeUserNameFlag == 1) {
            return;
          } else {
            this.MemberInfo.uname = value;
            this.updateInfo("userName",value);
          }
        })
        .catch(() => {
          return;
        });
    },
    //修改性别弹窗
    changeSex() {
      this.popupVisible = true;
    },
    //修改性别
    check() {
      var sex = "";
      if (this.sex == "1") {
        sex = "0";
      } else {
        sex = "1";
      }
      this.updateInfo("sex", sex);
    },
    //修改生日弹窗
    openPicker() {
      this.$refs.picker.open();
    },
    //修改生日
    handleConfirm(value) {
      this.pickerValue = value;
      var birthday = "";
      if (this.formatDate) {
        birthday = this.formatDate.replace(/-/g, "");
      } else {
        birthday = this.MemberInfo.birthday;
      }
      this.updateInfo("birthday", birthday);
    },
    checkinCancel() {
      this.pickerValue = this.stringToDate(this.MemberInfo.birthday);
    },
    formatTen(num) {
      return num > 9 ? num + "" : "0" + num;
    }
  },
  filters: {
    sexfilter: function(value) {
      if (value == "0") {
        return "女";
      } else if (value == "1") {
        return "男";
      } else {
        return "";
      }
    }
  },
  computed: {
    formatDate: function() {
      if (!this.pickerValue) {
        return "";
      } else {
        var val = Date.parse(this.pickerValue);
        var date = new Date(val);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);
      }
    }
  },
  mounted: function() {
    this.getMemberInfo();
    window.Hub.$emit("setTitle", "完善资料", false, null, false, false);
    window.Hub.$emit("setFooter", false);
  }
};
</script>
<style lang="scss" type="text/css">
@import "../../assets/skin";
.mint-popup{
  width:100%;
}
.left {
  position: absolute;
  color: #000;
  left: pxToRem(20);
  transform: rotate(90deg);
}
.right {
  font-size: pxToRem(14);
  float: right;
  transform: rotate(270deg);
}
.profile {
  height: 100vh;
  .head {
    position: relative;
    .first {
        overflow: hidden;
        float: right;
        width: pxToRem(100);
        height: pxToRem(100);
        background:rgb(208, 238, 255);;
        border-radius: 50%;
        margin-right: pxToRem(30);
        img{
          width: pxToRem(100);
          height: pxToRem(100);
        }
        i{
          text-align: center;
          font-size: pxToRem(90);
          color: $white;
        }

      }
  }
  .uname {
    margin-bottom: pxToRem(40);
  }
  .form-item {
    background: #fff;
    width: 100%;
    font-size: pxToRem(35);
    height: pxToRem(100);
    line-height: pxToRem(100);
    padding: 0 pxToRem(20);
    border-bottom: 1px solid #ebebeb;
    margin-right: pxToRem(35);
    .head{
      position: relative;
    }
    .head-sculpture {
      position:absolute;
      right:0;
      top:0;
      background-size: pxToRem(98);
      width: 100%;
      height: pxToRem(100);
      border: none;
      i{
        display:none;
      }
      label {
        width:100%;
        height: pxToRem(98);
        position:absolute;
        top:0;
        right:0;
        opacity:1;
         border:none;
        input{
          width:100%;
          height:inherit;
          position: absolute;
          left:0;
          right:0;
          top:0;
          bottom:0;
        }
      }
      .mask{
        position:absolute;
        top:0;
        right:0;
        opacity:1;
         &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 0%;

    }
      }
        .thumb {
        height: 100%;
        width:13%;
        border-radius:50%;
        position: absolute;
        top: 0;
        right:pxToRem(120);
        z-index: 99999;
        margin-left:78%;
        max-width: 100%;
        max-height: 100%;
      }
    }
    span {
      float: right;
      margin-right: pxToRem(10);
    }
  }
}
</style>
