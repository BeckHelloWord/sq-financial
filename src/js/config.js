import city from './city';
import store from '../store'
import fingerprint from 'fingerprintjs2'; //浏览器指纹
export default {
	isWeiXin: function () {
		var ua1 = window.navigator.userAgent.toLowerCase();
		if ((ua1.indexOf("micromessenger") > -1) || (ua1.indexOf("dingtalk") > -1)) {
			return true;
		} else {
			return false;
		}
	},
	setTopClass: function () {
		if (this.isWeiXin()) {
			return ""
		} else {
			return "loadmoreTop"
		}
	},
	/* 验证码是否能发送校验 */
	checkCountDown(telNumber, type) {
		var _this = this;
		var pastTime = JSON.parse(localStorage.getItem(telNumber + type));
		if (!pastTime) {
			this.getCodeBtnDisable = false;
		} else {
			var surplusTime = parseInt((pastTime.endTime - new Date().getTime()) / 1000),
				pastMobile = pastTime.mobile,
				pastType = pastTime.type;

			if (surplusTime > 0 && pastMobile == telNumber && pastType == type) {
				/* 不可以 */
				this.getCodeBtnDisable = true;
				this.$configInfo.setVerificationBtnDisable.call(this, surplusTime, telNumber, type);
			} else {
				/* 可以 */
				this.getCodeBtnDisable = false;
			}
		}
	},
	/* 获取验证码 */
	setVerificationBtnDisable: function (time, telNumber, type) {
		clearInterval(timerId);
		this.getCodeBtnDisable = true;
		this.getCodePending = false;

		var saveTime = {
			endTime: new Date().getTime() + time * 1000,
			mobile: telNumber,
			type: type
		}
		localStorage.setItem(telNumber + type, JSON.stringify(saveTime));

		var timerId = setInterval(() => {
			if (--time <= 0) {
				clearInterval(timerId);
				if (!this.telNumber || this.telNumber.length != 11) {
					this.getCodeBtnDisable = true;
				} else {
					this.getCodeBtnDisable = false;
				}
				this.getCodePending = true;
				this.getCodeTxt = "获取验证码";
				localStorage.removeItem(telNumber + type);
			} else {
				this.getCodeTxt = time + "S";
			}
		}, 1000);
	},
	swapPassWord: function () {
		this.closePassword = !this.closePassword;
		!this.closePassword ? (this.$refs.passwordVal.type = "password") : (this.$refs.passwordVal.type = "text");
	},
	appToken: function () {
		return 'f8e3dbe9-f171-4fa3-975d-2b27f8e5bc7e'
	},
	reg: {
		telReg: /^[1][3,4,5,7,8][0-9]{9}$/,
		passwordReg: /^\S{6,30}$/,
		codeReg: /^\d{6}$/,
		chineseNameReg: /^[\u4E00-\u9FA5]{2,4}$/,
		idCardReg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
		bankCardReg: /^\d{16,21}$/,

	},
	appKey: 'f8e3dbe9-f171-4fa3-975d-2b27f8e5bc7e',
	publicInfo: {
		projectName: '3汽金融',
		tel: '021—56824555',
		weChat: "陕汽服务号",
		// serviceUrl: 'http://10.0.6.54:8080/im/text/0BFJcU.html', //开发地址
		// serviceUrl: 'http://218.80.1.134:7878/im/text/04NgAd.html', //开发地址2
		serviceUrl: 'http://10.0.1.208:8083/im/text/11hAos.html', //测试地址
		// serviceUrl: 'http://118.184.219.180:8083/im/text/11hAos.html' //生产地址
	},
	address: city,
	// 获取加密后的客服地址
	getServiceUrl() {
		var accessToken = '06a0b1eb-79ac-11e8-85d1-1831bfb598d2',
			accessSecret = 'MDZhMGIxZWItNzlhYy0xMWU4LTg1ZDEtMTgzMWJmYjU5OGQy';

		var persion = localStorage.getItem('persion'),
			userInfo = null,
			signature = null;
		if (persion && JSON.parse(persion).data.userid) {
			userInfo = JSON.parse(persion).data;
			signature = Public.sig("GET", {
				userid: userInfo.userid
			}, accessSecret);
			store.commit('monitorUrl', this.publicInfo.serviceUrl + '?userid=' + userInfo.userid + '&signature=' + signature + '&accessToken=' + accessToken + '&uname=' + userInfo.uname);
		} else {
			var _this = this;
			new fingerprint().get(function (result, components) {
				signature = Public.sig("GET", {
					userid: result
				}, accessSecret);
				store.commit('monitorUrl', _this.publicInfo.serviceUrl + '?userid=' + result + '&signature=' + signature + '&accessToken=' + accessToken)
			})
		}
	}
}
