<template>
	<div class="messageList" v-if="loadEnd">
		<ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
			<template v-if="investList.length>0" v-for="item in investList">
				<message-item :item="item"></message-item>
			</template>
		</ul>		
		<empty v-if="investList.length == 0" :padding="'30%'"></empty>
	</div>
</template>

<script>
	/*
	        阅读全部
	        	接口：/api/sitemail/shopMessageFront/readAllSiteMail
	        站内信列表
	        	接口：/api/sitemail/shopMessageFront/getSiteMailList
	    		传参：
	    		 pageNum: 0,
	    		pageSize: 10,
	         * @return Map
	             *          data	Object	
	        返回的数据

	          isReadDisplay	String	    是否已读 0:未读 1：已读
	          sendTimeDisplay	String	    时间[yyyyMMddHHmmss]
	          msgTitle	String	    消息title
	          msgContent	String	   消息内容
	          msgIdDisplay	String	    消息内容ID
	        日期		作者		操作
	        5-8 	倪文斌		新建
	        
	        */
	import {
		InfiniteScroll
	} from 'mint-ui';
    import messageItem from '../public/messageItem';
    
	import empty from "../public/empty";
	Vue.use(InfiniteScroll);
	export default {
		components: {
            messageItem: messageItem,
            empty
		},
		data: function () {
			return {
				investList: [
					// {
					//     msgTitle:"月球爆炸啦",
					//     msgContent:"龟仙人老爷爷用龟派气功把月球打炸啦",
					//     msgIdDisplay:1,
					//     isReadDisplay:1,
					//     sendTimeDisplay:"20180612132011"
					// },{
					//     msgTitle:"月球爆炸啦",
					//     msgContent:"龟仙人老爷爷用龟派气功把月球打炸啦,龟仙人老爷爷用龟派气功把月球打炸啦,龟仙人老爷爷用龟派气功把月球打炸啦,龟仙人老爷爷用龟派气功把月球打炸啦",
					//     msgIdDisplay:1,
					//     isReadDisplay:0,
					//     sendTimeDisplay:"20180612132011"
					// },{
					//     msgTitle:"月球爆炸啦",
					//     msgContent:"龟仙人老爷爷用龟派气功把月球打炸啦",
					//     msgIdDisplay:1,
					//     isReadDisplay:0,
					//     sendTimeDisplay:"20180612132011"
					// },{
					//     msgTitle:"月球爆炸啦",
					//     msgContent:"龟仙人老爷爷用龟派气功把月球打炸啦",
					//     msgIdDisplay:0,
					//     isReadDisplay:0,
					//     sendTimeDisplay:"20180612132011"
					// },{
					//     msgTitle:"月球爆炸啦",
					//     msgContent:"龟仙人老爷爷用龟派气功把月球打炸啦",
					//     msgIdDisplay:1,
					//     isReadDisplay:1,
					//     sendTimeDisplay:"20180612132011"
					// }
				],
				list: {},
				pageNum: 1,
				pageSize: 10,
				hasNext: true,
				initLock: true,
				loadEnd: false
			}
		},
		methods: {
			readAll() {
				Public.API_GET({
					url: 'readAllSiteMail',
					success: (result) => {}
				});
			},
			loadMore() {
				if (this.initLock) {
					return
				}
				if (!this.hasNext) {
					return
				}
				this.loading = true;
				Public.API_GET({
					url: 'getSiteMailList',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					},
					success: (result) => {
                        if(!result.isSuccess){
                            this.$store.dispatch("Toast", result.message);
                            return
                        }
						for (var item in result.data) {
							this.investList.push(result.data[item])
						}
						this.pageNum += 1;
						this.loading = false;
						if (result.data.length < this.pageSize) {
							this.hasNext = false
						}
					}
				});
			},
			initData(finishFun) {
				this.pageNum = 0;
				this.pageSize = 10;
				this.hasNext = true;
				this.investList = [];
				this.loadEnd = false;
				Public.API_GET({
					url: 'getSiteMailList',
					data: {
						pageNum: this.pageNum,
						pageSize: this.pageSize
					},
					success: (result) => {
                        this.loadEnd = true                        
                        if(!result.isSuccess){
                            this.$store.dispatch("Toast", result.message);
                            return
                        }
						if (result.data && result.data.length > 0) {
							this.investList = result.data;
						}
						this.pageNum += 1;
						if (result.data.length < this.pageSize) {
							this.hasNext = false
						}
						this.initLock = false
						if (typeof (finishFun) == "function") {
							finishFun()
						}
					}
				});
			}
		},
		mounted: function () {
			this.initData()
			window.Hub.$emit('refresh', this.initData);
			window.Hub.$emit('setTitle', "消息中心", false, null, false, false);
			window.Hub.$emit('setFooter', false);
			this.readAll()
		},
		beforeDestroy() {
			window.Hub.$emit('refresh', null);
		}
	}

</script>
<style lang="scss" scoped="" type="text/css">


</style>
