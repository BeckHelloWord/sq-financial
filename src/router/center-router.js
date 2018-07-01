// 创建一个路由器实例
// 并且配置路由规则
const centerRouter = [
	/* 车型详情 */
	{
		path: '/models/detail/:id',
		component: (resolve) => {
			require(['../components/models/detail.vue'], resolve)
		},
		meta: {
			requiresAuth: false
		}
	},
	/* 车型参数详情 */
	{
		path: '/models/parameter/:id',
		name: 'parameter',
		component: (resolve) => {
			require(['../components/models/parameter.vue'], resolve)
		},
		meta: {
			requiresAuth: false
		}
	},
	/* 车型图片预览 */
	{
		path: '/models/imagePreview/:id',
		component: (resolve) => {
			require(['../components/models/imagePreview.vue'], resolve)
		},
		meta: {
			requiresAuth: false
		}
	}, {
		// 确认订单
		path: "/order/order/:goodsId",
		name: 'order',
		component: (resolve) => {
			require(['../components/center/order/order.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	}, {
		// 购买方式
		path: "/order/way/:goodsId",
		name: 'way',
		component: (resolve) => {
			require(['../components/center/order/way.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		// 付款通用界面
		path: '/pay/payment',
		component: (resolve) => {
			require(['../components/pay/payment.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		// 实名认证
		path: '/auth/self',
		component: (resolve) => {
			require(['../components/auth/self.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		// 付贷款信息确认界面
		path: '/pay/confirm/:goodsId',
		name: "confirm",
		component: (resolve) => {
			require(['../components/pay/confirm.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	}, {
		// 付贷款信息确认界面
		path: '/pay/back/:bizno',
		component: (resolve) => {
			require(['../components/pay/back.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		// 付款信息确认界面
		path: '/public/popUp',
		component: (resolve) => {
			require(['../components/public/popUp.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		// 交易完成
		path: '/pay/deal/:orderId',
		component: (resolve) => {
			require(['../components/pay/deal.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		// 订单列表
		path: '/order/list',
		component: (resolve) => {
			require(['../components/center/order/list.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		// 订单详情
		path: '/order/detail/:orderId',
		component: (resolve) => {
			require(['../components/center/order/orderDetail.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		// 消息中心
		path: '/center/message',
		component: (resolve) => {
			require(['../components/center/message.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	//我的页面
	{
		path: '/center/mine',
		component: (resolve) => {
			require(['../components/center/mine.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	}, ,
	//借款列表
	{
		path: '/loan/list',
		component: (resolve) => {
			require(['../components/center/loan/list.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/loan/detail/:orderId',
		component: (resolve) => {
			require(['../components/center/loan/detail.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	//完善用户信息
	{
		path: '/center/profile',
		component: (resolve) => {
			require(['../components/center/profile.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},

	{
		path: '/center/setting/updatePassword',
		component: (resolve) => {
			require(['../components/center/setting/updatePassword.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	// 补件申请成功
	{
		path: '/supplement/result',
		component: (resolve) => {
			require(['../components/center/supplement/result.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	// 贷款补件
	{
		path: '/supplement/list/:orderId',
		component: (resolve) => {
			require(['../components/center/supplement/list.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	// 补件照片
	{
		path: '/supplement/uploadStuff/:name',
		component: (resolve) => {
			require(['../components/center/supplement/uploadStuff.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/center/setting/set',
		component: (resolve) => {
			require(['../components/center/setting/set.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/center/setting/modifyTel',
		name: "modifyTel",
		component: (resolve) => {
			require(['../components/center/setting/modifyTel.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/center/setting/modifyTelN/:tel',
		name: "modifyTelN",
		component: (resolve) => {
			require(['../components/center/setting/modifyTelN.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/center/aboutUs',
		component: (resolve) => {
			require(['../components/center/aboutUs.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/models/article',
		component: (resolve) => {
			require(['../components/models/article.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	}, {
		/* 订单提交成功 */
		path: '/pay/orderSuccess/:orderId',
		component: (resolve) => {
			require(['../components/pay/orderSuccess.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	}, {
		/* 合同预览 */
		path: '/contract/preview/:orderId',
		component: (resolve) => {
			require(['../components/center/contract/preview.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},{
		/* 签署合同（公司） */
		path: '/contract/companyContract',
		component: (resolve) => {
			require(['../components/center/contract/companyContract.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	},{
		/* 签署合同（个人） */
		path: '/contract/personalContract',
		component: (resolve) => {
			require(['../components/center/contract/personalContract.vue'], resolve)
		},
		meta: {
			requiresAuth: true
		}
	}
]

export default centerRouter;
