<template>
    <div>
 
		<mt-popup class="loan-popup cost-popup" v-model="costDetailVisible.costDetailVisible" position="bottom">
			<dl class="clearfix">
				<dt><img :src="baseOrderInfo.image" alt="" /></dt>
				<dd>
					<div>
						<h3>{{baseOrderInfo.name}}</h3>
						<p>{{data.specDisplay}}</p>
					</div>
				</dd>
			</dl>
			<ul>
				<li  v-for="item in feeDetailInfo">
					<span class="fl">{{item.itemName}}x{{item.num}}</span>
					<span class="fr">¥ {{Number(item.displayPrice).toFixed(2)}}</span>
				</li>
				<li>
					<span class="fr">订单总价：
						<i class="price">¥</i>
						<em class="price">{{totalPrice.toFixed(2)}}</em>
					</span>
				</li>
			</ul>
			<div @click="costDetailVisible.costDetailVisible=false" class="close iconfont icon-X"></div>
		</mt-popup>
    </div>
</template>
<script type="text/javascript">
	import {
		Popup,
		Picker,
		MessageBox
	} from 'mint-ui';
	export default {
		components: {
			mtPopup: Popup,
			mtPicker: Picker
        },
        props:["costDetailVisible","baseOrderInfo" ,"feeDetailInfo","orderId","totalPrice"],
		data: function() {
			return {
				// // 费用明细。先改为从父组件中传递过来
				// costDetailVisible: false
				// idNum:this.$route.params.id,
				data:{}
			};
		},
		methods: {
			/* 获得订单详情 */
    getOrderDetail() {
      Public.API_GET({
        url: "getOrderDetail",
        data: {
          orderId: this.orderId
        },
        success: result => {
          if (result.isSuccess) {
			this.data = result.data;
			
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
    },
			// 初始化
			init() {
				$(".mint-loadmore-content").addClass("transform-no");
			}
		},
		mounted: function() {
			// this.gotTotalPrice()
			this.getOrderDetail()			
			window.Hub.$emit("setTitle", "购买方式", false, function() {
				MessageBox({
					title: '提示',
					message: '您确定要取消支付？',
					showCancelButton: true
				}).then((value)=>{
					if(value==="confirm"){
						history.go(-1);
					}
				});
			}, false, false);
			window.Hub.$emit("setFooter", false);
			this.init();
		},
		beforeDestroy() {
			$(".mint-loadmore-content").removeClass("transform-no");
		}
	};
</script>
<style lang="scss" type="text/css">
	.transform-no {
		transform: none !important;
	}
</style>
<style lang="scss" scoped="" type="text/css">
    @import "../../assets/skin";
    .price {
			color: $c-ff6d00;
		}
	.loan-popup {
		left: 0;
		width: 100%;
		transform: translateX(0);
		border-radius: pxToRem(20) pxToRem(20) 0 0;
		&.cost-popup {
			padding: 0 pxToRem(30) pxToRem(30);
			dl {
				padding: pxToRem(50) 0 pxToRem(20);
				dt {
					float: left;
					width: pxToRem(212);
					height: pxToRem(160);
					margin-right: pxToRem(20);
					img {
						width: 100%;
						height: 100%;
					}
				}
				dd {
					display: table;
					height: pxToRem(160);
					&>div {
						display: table-cell;
						vertical-align: middle;
						h3 {
							font-size: pxToRem(32);
							font-weight: normal;
							color: $ft-333;
						}
						p {
							padding-top: pxToRem(10);
							font-size: pxToRem(24);
						}
					}
				}
			}
			li {
				line-height: pxToRem(88);
				border-top: 1px solid $ft-dedede;
				overflow: hidden;
				font-size: pxToRem(28);
				color: $ft-333;
				em {
					font-size: pxToRem(36);
				}
			}
		}
		.close {
			position: absolute;
			top: pxToRem(20);
			right: pxToRem(30);
			width: pxToRem(44);
			height: pxToRem(44);
			line-height: pxToRem(44);
			text-align: center;
			font-size: pxToRem(18);
			background-color: $e1;
			border-radius: 50%;
		}
	}
</style>


