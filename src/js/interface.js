//正式版本服务器
// var host = "http://10.0.20.101";
// var host = "http://10.0.1.33:8686";
var host = "";
var channel = "miss"; //想念

export default {
	myHost: host,
	Model: {
		// 登录发送验证码
		sendVerifyForLogin: host + '/api/validSmsCode/createSmsCode',
		// 找回密码
		backPassword: host + '/api/member/shopMember/backPassword',
		//商品详情
		goodsDetail: host + '/api/goods/shopGoods/goodsDetail',
		// 查询相册列表
		goodsGalleryList: host + '/api/goods/shopGoodsGallery/goodsGalleryList',
		// 商品特性
		goodsAttribute: host + '/api/goods/shopGoods/goodsAttribute',
		// 商品参数
		goodsParameters: host + '/api/goods/shopGoods/goodsParameters',
		//获得订单Token,提交订单的时候携带过来
		getOrderToken: host + '/api/order/getOrderToken',
		//用手机号码注册或登录 验证短信码
		register: host + '/api/member/shopMember/register',
		//首页列表
		searchList: host + '/api/goods/shopGoods/searchList',
		//城市列表
		sysProvince: host + '/api/city/sysProvince/list',
		//登录
		loginOn: host + "/api/login/ajaxLogin",
		/* 快速提交订单 */
		quickSubmitOrder: host + '/api/order/quickSubmitOrder',
		/* 查询商品规格 */
		goodsShopSpec: host + '/api/goods/shopGoods/goodsShopSpec',
		// 获得订单列表数据
		getOrderList: host + '/api/order/getOrderList',
		// 获得订单详情
		getOrderDetail: host + '/api/order/getOrderDetail',
		// 取消订单
		operateOrder: host + '/api/order/operateOrder',
		// 站内信列表
		getSiteMailList: host + '/api/sitemail/shopMessageFront/getSiteMailList',
		// 阅读全部站内信
		readAllSiteMail: host + '/api/sitemail/shopMessageFront/readAllSiteMail',
		/* 获得商品服务 */
		getGoodsServiceList: host + '/api/shopGoodsService/getGoodsServiceList',
		/* 获得贷款方案 */
		getFinancialSchemeList: host + '/api/financialScheme/getFinancialSchemeList',
		/* 获得商品服务 */
		getGoodsServiceList: host + '/api/shopGoodsService/getGoodsServiceList',
		// 订单确认
		setBuyWay: host + '/api/order/setBuyWay',
		// 订单确认
		getPayInfo: host + '/api/shopPay/getPayInfo',
		//获取支付token
		getPayToken: host + '/api/shopPay/getPayToken',
		// 转账  /api/shopPay/transferAccounts
		transferAccounts: host + '/api/shopPay/transferAccounts',
		// 获得金融筛选条件
		findInitialAndPeriod: host + '/api/financialScheme/findInitialAndPeriod',
		/* 获得金融方案 */
		findPlan: host + '/api/financialScheme/findPlan',
		/*获得用户信息*/
		getMemberInfo: host + '/api/member/shopMember/getMemberInfo',
		/*修改用户信息*/
		updateInfo: host + '/api/member/shopMember/updateInfo',
		/*修改登录密码*/
		updatePasswordNew: host + '/api/member/shopMember/updatePasswordNew',
		// 获得借款订单列表
		getLoanList: host + '/api/loan/getLoanList',
		/* 提交补件信息 */
		uploadSupplementInfo: host + '/api/loan/uploadSupplementInfo',
		/* 获得补件信息 */
		getSupplementInfo: host + '/api/loan/getSupplementInfo',
		/* 获得借款订单详情 */
		getLoanDetailInfo: host + '/api/loan/getLoanDetailInfo',
		/* 获得banner */
		getBannerList: host + '/api/banner/getBannerList',
		getLoanDetailInfo: host + '/api/loan/getLoanDetailInfo',
		// 修改手机号
		updateMobile: host + "/api/member/shopMember/updateMobile",
		// 修改手机号（后台清楚缓存）
		loginOut: host + "/api/login/loginOut",
		// 人脸识别token获取
		getToken: host + "/api/face/getToken",
		// 人脸识别token获取
		getResult: host + "/api/face/getResult",
		// 人脸识别token获取
		authData: host + "/api/face/authData",
		/* 提交补件信息 */
		uploadSupplementInfo: host + '/api/loan/uploadSupplementInfo',
		/* 获得文章列表 */
		findArticleList: host + '/api/article/shopArticle/findArticleList',
		/* 获得文章详情 */
		getArticle: host + '/api/article/shopArticle/getArticle',
		/* 获得借款信息统计报表 */
		getTotalReport: host + '/api/loan/getTotalReport',
		/* 获得自提点 */
		findDeliveryList:host+'/api/shopDelivery/findDeliveryList',
		/* 确认购买方式 */
		confirmBuyWay:host+'/api/order/confirmBuyWay',
		/* 预览合同 */
		previewContract:host+'/api/contract/previewContract',
		/*保存发票信息*/
		saveInvoiceInfo:host+'/api/invoice/saveInvoiceInfo',
		/*获得个人发票信息*/
		getPersonalInvoiceInfo:host+'/api/invoice/getPersonalInvoiceInfo',
	}
}
