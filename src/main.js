import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router";
import router from './router';
import store from './store';
import Vuex from 'vuex';
import 'mint-ui/lib/style.css';
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import {
	InfiniteScroll
} from 'mint-ui';
Vue.use(InfiniteScroll);
import configInfo from './js/config';
import fileters from './js/filters';

Vue.prototype.$configInfo = configInfo;
Vue.prototype.$formatPrice = function (val) {
	val ? val : val = 0;

	if (val < 10000) {
		return "<strong>" + Number(val).toFixed(2) + "</strong><i>元</i>";
	} else {
		return "<strong>" + (Number(val) / 10000).toFixed(2) + "</strong><i>万元</i>";
	}
};

window.Vue = Vue;
// 开启debug模式
// Vue.config.debug = false;

// Vue.use(Mint);
Vue.use(VueRouter);
// Vue.use(VueResource);

window.Hub = new Vue();

//添加过滤器
Object.keys(fileters).forEach((key) => {
	Vue.filter(key, fileters[key]);
})

// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
const app = new Vue({
	router: router,
	store,
	render: h => h(App)
}).$mount('#app')
