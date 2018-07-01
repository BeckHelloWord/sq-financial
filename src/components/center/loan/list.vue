<template>
	<div class="loan-list">
		<div class="moeny">
			<div class="moeny-total">
				<p>{{totalReport.waitRepaymentThisMonth | formatMoney}}</p>
				<p class="moeny-total-txt">本月待还（元）</p>
			</div>
			<div class="moeny-detail">
				<div>
					<p>{{totalReport.waitRepaymentTotal| formatMoney}}</p>
					<span>待还总额(元)</span>
				</div>
				<div>
					<p>{{totalReport.overdueWaitRepayment| formatMoney}}</p>
					<span>逾期待还(元)</span>
				</div>
				<div>
					<p>{{totalReport.overdueCount}}</p>
					<span>逾期总次数</span>
				</div>
			</div>
		</div>
		<div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
			<template v-for="item in dataList">
				<loanList :item='item'></loanList>
			</template>
			<div class="empty">
				<empty v-show='dataList.length==0' :showImg='true' :padding='"20%"'></empty>
			</div>
		</div>
	</div>
</template>
<script>
import loanList from "../../public/loanList";
import empty from "../../public/empty";
export default {
  components: {
    loanList,
    empty
  },
  data: function() {
    return {
      dataList: [],
      totalReport: {},
      offset: 1,
      max: 10,
      hasNext: true,
      initLock: true,
      loadEnd: false
    };
  },
  methods: {
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
        url: "getLoanList",
        data: {
          pageNum: this.offset,
          pageSize: this.max
        },
        success: result => {
          if (!result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
          }
          this.dataList = this.dataList.concat(result.data);
          ++this.offset;
          this.loading = false;
          if (result.data.length < this.max) {
            this.hasNext = false;
          }
        }
	  });
	  this.getTotalReport();
    },
    /* 初始化 */
    initData(finishFun) {
      this.loadEnd = false;
      Public.API_GET({
        url: "getLoanList",
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
          this.dataList = result.data;
          ++this.offset;
          if (this.dataList.length < this.max) {
            this.hasNext = false;
          }
          this.initLock = false;
          if (typeof finishFun == "function") {
            finishFun();
          }
        }
      });
    },
    /* 获得借款信息统计报表 */
    getTotalReport() {
      Public.API_GET({
        url: "getTotalReport",
        success: result => {
          if (!result.isSuccess) {
            this.$store.dispatch("Toast", result.message);
          }
          this.totalReport = result.data;
        }
      });
    }
  },
  mounted: function() {
    window.Hub.$emit("setTitle", "还款", false, null, " ", null);
    window.Hub.$emit("setFooter", true);
    this.initData();
    this.getTotalReport();
  }
};
</script>
<style lang="scss" scoped type="text/css">
@import "../../../assets/skin";
.loan-list {
  .moeny {
    @include common-padding();
    text-align: center;
    color: $white;
    background: $c-0090ff;
    .moeny-total {
      padding: pxToRem(40) 0;
      font-size: pxToRem(55);
      .moeny-total-txt {
        margin-top: pxToRem(20);
        font-size: pxToRem(24);
      }
    }
    .moeny-detail {
      padding-bottom: pxToRem(25);
      font-size: 0;
      & > div {
        display: inline-block;
        width: 33.333%;
        line-height: 2;
        & > p {
          font-size: pxToRem(32);
        }
        font-size: pxToRem(24);
      }
    }
  }
}
</style>
