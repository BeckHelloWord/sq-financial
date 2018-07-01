<template>
	<div class="investList" v-if="loadEnd">
		<ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
			<template v-if="investList.length>0" v-for="item in investList">
				<order-item :item="item"></order-item>
			</template>
		</ul>
		<empty v-if="investList.length == 0" :padding="'30%'"></empty>
	</div>
</template>

<script>
	/*
	        标的列表
	        	接口：/api/order/getOrderList
	    		传参：
	    		 pageNum: 0,
	    		pageSize: 10,
	         * @return Map
	             *          data	Object	
	        返回的数据

	          name	String	    商品名称
	          totalPrice	String	    总价格
	          status	String	    状态【参照订单状态接口】
	          buyWay	String	    购买方式
	          date	String	    申请时间[yyyyMMddHHmmss]
	          orderId	String	    订单编号
	          image	String	    图片地址
	        日期		作者		操作
	        5-8 	倪文斌		新建
	        */
	import {
		InfiniteScroll
	} from 'mint-ui';
	import orderItem from '../../public/orderItem';

	import empty from "../../public/empty";
	Vue.use(InfiniteScroll);
	export default {
		components: {
            orderItem: orderItem,
            empty
		},
		data: function () {
			return {
				investList: [],
				list: {},
				pageNum: 1,
				pageSize: 10,
				hasNext: true,
				initLock: true,
				loadEnd: false
			}
		},
		methods: {
			loadMore() {
				if (this.initLock) {
					return
				}
				if (!this.hasNext) {
					return
				}
				this.loading = true;
				Public.API_GET({
					url: 'getOrderList',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					},
					success: (result) => {
                        if (result.isSuccess) {
                            for (var item in result.data) {
                                this.investList.push(result.data[item])
                            }
                            this.pageNum += 1;
                            this.loading = false;
                            if (result.data.length < this.pageSize) {
                                this.hasNext = false
                            }
                        } else {
                            this.$store.dispatch("Toast", result.message);
                        }
						
					}
				});
			},
			initData(finishFun) {
				this.pageNum = 1;
				this.pageSize = 10;
				this.hasNext = true;
				this.investList = [];
				this.loadEnd = false;
				Public.API_GET({
					url: 'getOrderList',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					},
					success: (result) => {
                        this.loadEnd = true
                        if (result.isSuccess) {
                            this.investList = result.data;
                            this.pageNum += 1;
                            if (result.data.length < this.pageSize) {
                                this.hasNext = false
                            }
                            this.initLock = false
                            if (typeof (finishFun) == "function") {
                                finishFun()
                            }
                        } else {
                            this.$store.dispatch("Toast", result.message);
                        }
						
					}
				});
			}
		},
		mounted: function () {

			this.initData()
			window.Hub.$emit('refresh', this.initData);
			window.Hub.$emit('setTitle', "全部订单", false, null, false, false);
			window.Hub.$emit('setFooter', true);
			window.Hub.$emit('showHeader')
		},
		beforeDestroy() {

			window.Hub.$emit('refresh', null);
		}
	}

</script>
<style lang="scss" scoped="" type="text/css">


</style>
