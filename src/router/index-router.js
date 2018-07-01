// 创建一个路由器实例
// 并且配置路由规则
const indexRouter = [{
	//首页
	path: "/index/index",
	component: (resolve) => {
		require(['../components/index/index.vue'], resolve)
	}
}, {
	//登录
	path: "/index/login",
	component: (resolve) => {
		require(['../components/index/login.vue'], resolve)
	}
}, {

	//注册
	path: '/index/register',
	component: (resolve) => {
		require(['../components/index/register.vue'], resolve)
	}
}, {

	//发现
	path: '/index/discovery',
	component: (resolve) => {
		require(['../components/index/discovery.vue'], resolve)
	}
}, {

	//发现
	path: '/index/discoveryArticle/:id',
	component: (resolve) => {
		require(['../components/index/discoveryArticle.vue'], resolve)
	}
}, {

	//忘记密码
	path: '/index/forget',
	component: (resolve) => {
		require(['../components/index/forget.vue'], resolve)
	}

}]

export default indexRouter;
