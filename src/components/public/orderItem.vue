<template>
    <li>
        <router-link :to="{ path: '/order/detail/'+item.orderId}">
            <div class="orderTitle">
                <span>
                    申请时间：{{item.date|formatDateLong}}
                </span>
                <span class="orderStatus">
                    {{item.statusDisplay}}
                </span>
            </div>
            <div class="orderListBox">
                <div class="orderImage">
                    <img :src="item.image" alt="">
                </div>
                <div class="orderInfo">
                    <h2>{{item.name}}</h2>
                    <p v-if="item.buyWayDisplay">购买方式：{{item.buyWayDisplay }}</p>
                </div>
            </div>
            <div class="orderPrice">
                总价：
                <span v-html="$formatPrice(item.totalPrice)"></span>
            </div>
        </router-link>
    </li>
</template>

<script>
export default {
  props: ["item"],
  methods: {},
  mounted: function() {},
  beforeMount: function() {}
};
</script>

<style lang="scss" type="text/css">
@import "../../assets/skin";
.investList {
  padding-bottom: 44px;
  li {
    margin-top: pxToRem(20);
    background-color: #fff;
    padding: 0 3%;
    a {
      .orderTitle {
        line-height: pxToRem(70);
        font-size: pxToRem(26);
        .orderStatus {
          float: right;
          color: $c-009cff;
        }
      }
      .orderListBox {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        padding: 5px 0;
        .orderImage {
          height: pxToRem(135);
          overflow: hidden;
          position: relative;
          display: inline-block;
          width: 30%;
          img {
            width: pxToRem(180);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .orderInfo {
          display: inline-block;
          width: 65%;
          padding-left:4%;
          h2 {
            font-weight: normal;
            font-size: pxToRem(26);
            color: #333333;
            line-height: pxToRem(50);
          }
          p {
            font-size: pxToRem(24);
            color: #999999;
          }
        }
        &:after {
          content: "";
          display: block;
          position: absolute;
          width: 10px;
          height: 10px;
          border-right: 2px solid #e1e1e1;
          border-bottom: 2px solid #e1e1e1;
          right: 0;
          top: 50%;
          transform: rotate(-45deg) translate(0, -50%);
        }
      }
      .orderPrice {
        text-align: right;
        border-top: 1px solid #ebebeb;
        line-height: pxToRem(70);
        font-size: pxToRem(26);
        span {
          strong {
            font-weight: normal;
            color: $c-ff6d00;
          }
        }
      }
    }
  }
}
</style>