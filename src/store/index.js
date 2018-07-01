import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import main from './modules/main'
import order from './modules/order'
import services from './modules/services'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		main,
		order,
		services
	},
	getters
})

export default store
