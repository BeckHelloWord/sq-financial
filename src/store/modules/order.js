const main = {
	//类参数
	state: {
		orderDetails: {
			spec: [],
			count: 0
		}
	},
	//类参数变动
	mutations: {
		SET_ORDER: (state, obj) => {
			state.orderDetails.spec = obj.spec;
			state.orderDetails.count = obj.count;
		}

	},
	//类方法
	actions: {}
}

export default main
