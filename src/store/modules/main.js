import Public from '../../js/public';

import VueRouter from "../../router/index";
import center from "../../router/center-router";
import index from "../../router/index-router";

import {
	Toast
} from "mint-ui";
const main = {
	//类参数
	state: {
		menuList: [],
		showMenu: "init",
		onceFlag: false,
		orderDetails: {
			spec: [],
			count: 0
		}
	},
	//类参数变动
	mutations: {
		SET_MENU: (state, menus) => {
			state.showMenu = menus
		},
		TOAST_ONCE: (state) => {
			state.onceFlag = true;
			window.setTimeout(() => {
				state.onceFlag = false
			}, 2000)
		},
		SET_ORDER: (state, obj) => {
			state.orderDetails.spec = obj.spec;
			state.orderDetails.count = obj.count;
		}

	},
	//类方法
	actions: {

		// 登出
		NotificOnce({
			commit,
			state
		}, data) {
			return new Promise((resolve, reject) => {
				commit('SET_MENU', "test")
			})
		},
		// 登出
		LoginOut({
			dispatch,
			commit,
			state
		}, data) {
			return new Promise((resolve, reject) => {
				var hash = location.hash.replace("#", "")
				var needOut = true
				for (var item in center) {
					if (center[item].path.indexOf(hash) > -1) {
						needOut = center[item].meta.requiresAuth
					}
				}
				for (var item in index) {
					if (index[item].path.indexOf(hash) > -1) {
						needOut = false
					}
                }
                
                //忘记密码需要退出，重新登录
                if(hash=='/index/forget'){
                    needOut=true;
                }

				if (needOut) {
					// dispatch("Toast", "登录超时")
					Public.Auth.remove();
					VueRouter.push({
						path: "/index/login"
					});
				} else {
					resolve()
				}
			})
		},
		// 登出
		Toast({
			commit,
			state
		}, message) {
			return new Promise((resolve, reject) => {
				if (state.onceFlag) {
					resolve(false)
				} else {
					Toast({
						message: message,
						position: "bottom",
						duration: 2000
					});
					commit('TOAST_ONCE')
					resolve(true)
				}
			})
		}
	}
}

export default main
