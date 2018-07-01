<template>
    <div class="mine">
        <div class="mine-head">
            <div class="head-wrapper clearfix">
                <router-link to="/center/profile">
                  <div class="head ">
                    <img v-show="MemberInfo.face" :src="MemberInfo.face"/>
                    <i class="iconfont icon-head"></i>
                    </div>
                  </router-link>
                <div class="info">
                    <p class="f36">Hi,&ensp;{{MemberInfo.uname}}</p>
                     <router-link to="/center/profile"><p class="notice">{{MemberInfo.infoFull|infoFull}}</p></router-link>
                </div>
            </div>
            <router-link to="/center/message" class="information iconfont  icon-message ">
                <span v-if="mailList">{{mailList}}</span>
            </router-link>
            <div class="deal">
                <div class="Amount-of-repayments">
                    <p class="num">{{MemberInfo.waitRepaymentAmount}}元</p>
                    <p class="amount">待还款金额</p>
                </div>
                <div class="Order-to-be-processed">
                    <p>{{MemberInfo.waitHandleOrderTotal}}条</p>
                    <p>待处理订单</p>
                </div>
            </div>
        </div>
        <div class="check">
            <router-link to="/loan/list">
                <li class="view loan-view"><img src="../../assets/images/loan.png" />&ensp;&ensp;查看借款 </li>
            </router-link>
            <router-link to="/order/list">
                <li class="view order-view"><img src="../../assets/images/order.png" />&ensp;&ensp;查看订单 </li>
            </router-link>
        </div>
        <div class="mine-content">
            <ul class="more">
                <router-link to="/center/aboutUs">
                    <li class="aboutUs">
                        <i class="iconfont icon-aboutUs"></i>&ensp;&ensp;关于我们
                        <i class="iconfont icon-arrow-down"></i>
                    </li>
                </router-link>
                <router-link to="/center/setting/set">
                    <li class="setting">
                        <i class="iconfont icon-setting"></i>&ensp;&ensp;设置
                        <i class="iconfont icon-arrow-down"></i>
                    </li>
                </router-link>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
  data() {
        return {
        MemberInfo:'',
        mailList: null
        };
    },
    methods: {
        /*获取用户信息 */
        getMemberInfo(){
            Public.API_GET({
                url:"getMemberInfo",
                success: result => {
                    if (result.isSuccess) {
                        this.MemberInfo = result.data;
                    } else {
                        window.Hub.$emit("toast", result.message);
                    }
                }
            });
        },
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
        }
      },
        filters: {
        infoFull:function(value) {
           if(value == "1"){
             return "资料已完善"
           }else{
             return "资料待完善"
           }
        }
    },
  mounted: function() {
    this.getMemberInfo();
    this.getSiteMailList();
    window.Hub.$emit("setTitle", "我的", false, null, " ", null);
    window.Hub.$emit("setFooter", true);
  }
};
</script>
<style lang="scss" scoped type="text/css">
@import "../../assets/skin";
a {
  display: inline-block;
}
.loan-view {
  border-right: 1px solid #ebebeb;
}
.clearfix {
  &:before {
    content: " ";
    display: table;
  }
  &:after {
    content: " ";
    display: table;
    clear: both;
  }
}
.mine {
  text-align: center;
  margin: 0 auto;
  .mine-head {
    color: #fff;
    width: 100%;
    height: pxToRem(373);
    background: -webkit-linear-gradient(
      left bottom,
      rgb(0, 156, 255),
      rgb(0, 192, 255)
    );
    .head-wrapper {
      font-size: pxToRem(40);
      padding-top: pxToRem(50);
      padding-left: pxToRem(40);
      width: 80%;
      a{
        float: left;
      }
      .head {
        overflow: hidden;
        float: left;
        width: pxToRem(100);
        height: pxToRem(100);
        background: #fff;
        border-radius: 50%;
        margin-right: pxToRem(50);
        img{
          width: pxToRem(100);
          height: pxToRem(100);
        }

      }
      .info {
        float: left;
        .f36 {
          font-size: pxToRem(36);
          font-weight: normal;
          padding-bottom: pxToRem(10);
        }
        .notice {
          color:#fff;
          font-size: pxToRem(20);
          width: pxToRem(180);
          background: rgba(0, 0, 0, 0.19);
          line-height: pxToRem(40);
          border-radius: pxToRem(17);
        }
      }
    }
    .icon-head {
      text-align: center;
      font-size: pxToRem(90);
      color: rgb(208, 238, 255);
    }
    .information {
      position: absolute;
      top: pxToRem(120);
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
    .deal {
      margin-top: pxToRem(50);
      font-size: pxToRem(28);
      .Amount-of-repayments {
        margin-right: 30%;
        display: inline-block;
      }
      .Order-to-be-processed {
        display: inline-block;
      }
    }
  }
  .check {
    margin: 0 auto;
    position: absolute;
    box-shadow: 0px 3px 0px #dcdcdc;
    left: 50%;
    transform: translate(-50%);
    top: pxToRem(410);
    width: 90%;
    margin: 0 auto;
    height: pxToRem(152);
    background-color: #ffffff;
    border-radius: pxToRem(20);
    display: flex;
    justify-content: center;
    align-items: center;
    a {
      width: 50%;
      height: pxToRem(88);
      line-height: pxToRem(88);
      display: inline-block;
      font-size: pxToRem(28);
      li {
        list-style: none;
      }
      img {
        width: pxToRem(88);
        height: pxToRem(88);
      }
    }
  }
  .mine-content {
    background: rgb(248, 248, 248);
    .more {
      text-align: left;
      margin-top: pxToRem(120);
      padding-left: 5%;
      width: 100%;
      background: #fff;
      font-size: pxToRem(28);
      .iconfont {
        font-size: pxToRem(45);
        color: #009cff;
        text-align: center;
      }
      a {
        width: 100%;
        li {
          width: 90%;
          height: pxToRem(100);
          line-height: pxToRem(100);
        }
      }
      .aboutUs {
        border-bottom: 1px solid #ebebeb;
      }
      .icon-arrow-down {
        font-size: pxToRem(25);
        color: #999;
        float: right;
        transform: rotate(270deg);
      }
    }
  }
}
</style>
