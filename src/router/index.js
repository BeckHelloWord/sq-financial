import VueRouter from "vue-router";
import indexRouter from "./index-router.js"
import centerRouter from "./center-router.js"
// 创建一个路由器实例
// 并且配置路由规则
const routerOption = {
	base: __dirname,
	routes: [{
		path: '/',
		redirect: '/index/index'
	}, {
		path: '/index',
		redirect: '/index/index'
	}]
}

function pushRouter(childRouter) {
	for (var i in childRouter) {
		routerOption.routes.push(childRouter[i])
	}
}
pushRouter(indexRouter);
pushRouter(centerRouter);
routerOption.scrollBehavior = (to, from, savedPosition) => {
	return {
		x: 0,
		y: 0
	};
}

const router = new VueRouter(routerOption);

router.beforeEach(({
	meta,
	path
}, from, next) => {
	if (!Public.Auth.get()) {
		//未登陆
		if (meta.requiresAuth) {
			next({
				path: '/index/login',
				query: {
					"redirect": path
				}
			});
		} else {
			next()
		}
	} else {
		//已登陆
		if (path == '/index/login') {
			next({
				path: '/center/mine'
			});
		} else {
			next()
		}
	}

})


export default router;
