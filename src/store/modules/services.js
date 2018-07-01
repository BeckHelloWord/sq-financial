const main = {
	//类参数
	state: {
		servicesUrl: ''
	},
	//类参数变动
	mutations: {
		monitorUrl: (state, url) => {
			state.servicesUrl = url;
		}
	}
}

export default main
