/*
 * @Introduction:'贷款补件'
 * @Author: beck
 * @Date: 2018-06-12 11:54:55
 * @Last Modified by: beck
 * @Last Modified time: 2018-06-26 11:43:00
 */

<template>
	<div class="supplement-list">
		<template v-for="item in dataList">
			<router-link :to="{path:'/supplement/uploadStuff/'+item.name,query:{orderId:orderId}}">
				<div class="item">
					<span class="fl">{{item.name}}</span>
					<span class="fr">{{item.status}}</span>
				</div>
			</router-link>
		</template>
		<div class="btns" v-if="dataList.length>0">
			<input type="button" value="补件申请" @click='apply' :class="{'login-btn-disable':loginDisable.length}">
		</div>
		<mt-popup v-model="popupJob" position="bottom" class="popup-job" popup-transition="popup-fade">
			<mt-picker :slots="slots" @change="onChangeJob"></mt-picker>
		</mt-popup>
	</div>
</template>
<script>
import { Picker, Popup } from "mint-ui";
export default {
  components: {
    mtPicker: Picker,
    mtPopup: Popup
  },
  data() {
    return {
      dataList: [],
      loginDisable: [],
      orderId: this.$route.params.orderId,
      popupJob: false,
      jobTxt: "无业者",
      slots: [
        {
          values: [
            "无业者",
            "司机",
            "专业技术人员",
            "生活服务人员",
            "不便分类的其他从业人员"
          ],
          textAlign: "center"
        }
      ]
    };
  },
  methods: {
    /* 选择职业 */
    onChangeJob(picker, values) {
      this.jobTxt = values[0];
    },
    /* 补件申请 */
    apply() {
      this.$router.push("/supplement/result");
    },
    /* 初始化 */
    initData() {
      Public.API_GET({
        url: "getSupplementInfo",
        data: {
          orderId: this.orderId
        },
        success: result => {
          this.dataList = result.data;
          /* 判断是否补充完全 */
          this.loginDisable = this.dataList.filter(element => {
            return element.status == "待补充";
          });
        }
      });
    }
  },
  mounted() {
    this.initData();
    window.Hub.$emit("setTitle", "贷款补件", false, null, "", null);
    window.Hub.$emit("refresh", null);
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/skin";
.supplement-list {
  height: 100vh;
  @include common-padding();
  background: $white;
  .item {
    position: relative;
    padding: pxToRem(30) pxToRem(50) pxToRem(30) 0;
    overflow: hidden;
    font-size: pxToRem(28);
    color: $c-999;
    .wait {
      color: $c-009dff;
    }
    span:first-child {
      color: $ft-333;
    }
    &::after {
      content: "";
      position: absolute;
      top: 50%;
      right: pxToRem(10);
      @include arrow-right();
      transform: translateY(-50%) rotate(45deg);
    }
  }
  .item + .item {
    border-top: pxToRem(1) solid $e1;
  }
  .popup-job {
    width: 100%;
  }
  .btns {
    input[type="button"] {
      @include common-btn-login;
      &.login-btn-disable {
        @include common-btn-disable();
      }
    }
  }
}
</style>
