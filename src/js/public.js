/**
 * Created by huangyexin on 2016/10/31.
 */
var Interface = require("./interface.js");
var MD5 = require("./md5.js");
require("./base64.js");
import myConfig from './config.js';
import store from '../store'
String.prototype.replaceAll = function (s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}
export default {
	myHost: Interface.default.myHost,
	Auth: {
		get: function () {
			var result = {};
			try {
				result = JSON.parse(localStorage['persion']);
				//添加时间戳 超过一天调用接口时 自动登出
				if (result && new Date().getTime() - result.timeStamp > 1800000) {
					this.remove()
					return 0
				}
			} catch (r) {
				result = sessionStorage['persion'] && JSON.parse(sessionStorage['persion']);
				if (result && new Date().getTime() - result.timeStamp > 1800000) {
					this.remove()
					return 0
				}
			}
			if ("object" === typeof result) {
				return result['accessToken'];
			}
			return 0;
		},
		set: function (_user) {
			window.setTokenFlag = true;
			//添加时间戳 超过一天调用接口时 自动登出
			_user.timeStamp = new Date().getTime()
			if (_user.accessToken && _user.accessToken == "app") {
				this.remove()
			} else {
				try {
					window.setTokenFlag = true
					localStorage['persion'] = JSON.stringify(_user);
				} catch (r) {
					sessionStorage['persion'] = JSON.stringify(_user);
				}
			}
		},
		remove: function () {
			try {
				localStorage.removeItem('persion');
			} catch (r) {
				sessionStorage.removeItem('persion');
			}
		}
	},
	API_GET: function (config) {
		var data = config['data'] || {};
		var _this = this
		config['success'] = config['success'] || function () {};
		//新加密方式
		var POST = "POST";
		var SIGNATURE_METHOD = "HmacSHA1";
		var SIGNATURE_VERSION = "2016-12-20";
		var ACCESS_TOKEN = myConfig.appKey;
		var ACCESS_SECRET = "rk64uXc6L1tgk548XwX7VvIdyf1uZMlBqg0PAIzXCLXbaGT9s783feEWwHz9p4TISUm5kqHXqcSPZsfR0DgzRiMGGlq3aM6zD2LEDwMUrI188yh2zfI0A7m1PF4Cjb1M";
		//
		// data.channel=ACCESS_TOKEN

		var timeStamp = new Date().getTime() + "";
		//签名数据
		var sigData = {
			accessToken: this.Auth.get() ? this.Auth.get() : ACCESS_TOKEN,
			signatureMethod: SIGNATURE_METHOD,
			timestamp: timeStamp,
			signatureVersion: SIGNATURE_VERSION,
			appVersion: "appVersion",
			parameter: encodeURIComponent(JSON.stringify(data))
		}
		//传送数据
		var sendData = {
			accessToken: this.Auth.get() ? this.Auth.get() : ACCESS_TOKEN,
			signatureMethod: SIGNATURE_METHOD,
			timestamp: timeStamp,
			signatureVersion: SIGNATURE_VERSION,
			appVersion: "appVersion",
			parameter: JSON.stringify(data),
			signature: this.sig(POST, sigData, ACCESS_SECRET)
		}
		config['xhr'] = $.ajax({
			url: Interface.default.Model[config['url']],
			type: "post",
			dataType: "json",
			timeout: 10000, //超时时间设置，单位毫秒
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(sendData),
			success: function (response, textStatus, request) {
				if (response.data == null) {
					response.data = [];
				}
				if (response.isSuccess == false) {
					if (response.status == "303") {
						store.dispatch("Toast", response.message)
						store.dispatch("LoginOut")
						if (typeof (config['error']) == "function") {
							config['error']();
						}
						return
					}
					if (response.status == "301") {
						store.dispatch("LoginOut")
						if (typeof (config['error']) == "function") {
							config['error']();
						}
						return
					}
					if (response.status == "500") {
						//系统异常
						window.Hub.$emit('toast', "服务器正忙，请稍后再试")
						// window.Hub.$emit("networkError", true);
						if (typeof (config['error']) == "function") {
							config['error']();
						}
						return
					}
					if (response.status == "501" || response.status == "401") {
						window.Hub.$emit("networkError", true);
						if (typeof (config['error']) == "function") {
							config['error']();
						}
						return
					}
				}
				//publicArr[cache['url']][cache['data']] = JSON.stringify(response);
				config['success'](response, request);
			},
			error: function (response) {
				//超时会进入error status = 0
				if (typeof (config['error']) == "function") {
					config['error']();
				}
				if (response.status == "301") {
					store.dispatch("LoginOut")
					_this.Auth.remove();

					return
				}
				window.Hub.$emit('toast', "服务器正忙，请稍后再试")
			}
		})
	},
	//签名算法
	sig: function (post, params, accessSecret) {
		var newobj = {},
			tmparr = [],
			queryEncode = [],
			query = [],
			name, value, subName, querytext;

		for (name in params) {
			tmparr.push(name);
			newobj[name] = params[name]; //复制一个新的obj,为了不影响原有formData数据
		}
		tmparr.sort();
		var queryStrParams;
		for (var i = 0, len = tmparr.length; i < len; i++) {
			name = tmparr[i];
			value = newobj[name];
			if (value instanceof Object) {
				value = JSON.stringify(value);
			}
			if (value !== undefined && value !== null && value !== '') {
				//name=myEncodeURIComponent(name);
				if (queryStrParams == '' || queryStrParams == undefined || queryStrParams == null) {
					if (name != 'parameter') {
						queryStrParams = '&' + this.myEncodeURIComponent(name) + '=' + this.myEncodeURIComponent(value);
					} else {
						value = this.myReplaceSomeStr(value);
						queryStrParams = '&' + this.myEncodeURIComponent(name) + '=' + value;
					}
				} else {
					if (name != 'parameter') {
						queryStrParams = queryStrParams + '&' + this.myEncodeURIComponent(name) + '=' + this.myEncodeURIComponent(value);
					} else {
						value = this.myReplaceSomeStr(value);
						queryStrParams = queryStrParams + '&' + this.myEncodeURIComponent(name) + '=' + value
					}
				}
				query.push(name + '=' + value);
				//sb.append(SEPARATOR).append(percentEncode(key)).append(EQUAL).append(percentEncode(value));
			}
		}
		// var querytext = post + "&" + this.myEncodeURIComponent("/") + "&" + this.myEncodeURIComponent("&" + query.join('&')) + "&" + this.myEncodeURIComponent(accessSecret);
		var querytext;
		if (queryStrParams == '' || queryStrParams == undefined || queryStrParams == null) {
			querytext = this.myEncodeURIComponent(post) + "&" + this.myEncodeURIComponent("/") + "&&" + this.myEncodeURIComponent(accessSecret);
		} else {
			querytext = this.myEncodeURIComponent(post) + "&" + this.myEncodeURIComponent("/") + "&" + this.myEncodeURIComponent(queryStrParams) + "&" + this.myEncodeURIComponent(accessSecret);
		}
		return Base64.encode(MD5.MD5(querytext))
	},
	//格式化URL代码
	myEncodeURIComponent: function (value) {
		return this.myReplaceSomeStr(encodeURIComponent(value));
	},
	myReplaceSomeStr: function (value) {
		var val = value;
		val = val.replaceAll("\\+", "%20");
		val = val.replaceAll("\\*", "%2A");
		val = val.replaceAll("%7E", "~");
		val = val.replaceAll("\\!", "%21");
		val = val.replaceAll("\\'", "%27");
		val = val.replaceAll("\\(", "%28");
		val = val.replaceAll("\\)", "%29");
		val = val.replaceAll("\\=", "%3D");
		return val;
	}
}
