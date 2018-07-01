export default {
	formatName(value) {
		/*处理名字*/
		if (value && value.length != 0 && value.indexOf('null') == -1) {
			var len = value.length;
			var symbol = value.slice(1, len).length;
			var str = "";
			for (var i = 0; i < symbol; i++) {
				str += "*";
			}
			return value.replace(value.slice(1, len), str);
		} else {
			return "未实名";
		}
	},
	formatIdCart(value) {
		//身份证
		if (value) {
			var length = value.length;
			var temp = "";
			for (var i = 0; i < value.length - 4; i++) {
				temp += "*";
			}
			var last = value.substr(length - 4, length);
			return temp + last;
		}
	},
	formatMobile(value) {
		/*处理手机*/
		if (!value) {
			return "请填写预留手机号";
		}

		if (value && value.length == 11) {
			return value.substr(0, 3) + " **** " + value.substr(7, 11);
		}
	},
	formatMoney(value) {
		/*处理金额,保留两位小数*/
		value = value == null ? 0 : value;
		return Number(Math.abs(value)).toFixed(2);
	},
	formatBankCard(value) {
		/*处理银行卡*/
		if (value) {
			var length = value.length - 8;
			var last = value.length - 4;
			var num = "";
			for (var i = 0; i < length; i++) {
				num += "*";
			}
			return value.substr(0, 4) + num + value.substr(last, value.length);
		}
	},
	formatDate(value) {
		// 格式化年月
		var arr = value.split('');
		arr.splice(4, 1, '年')
		arr.splice(7, 1, '月')

		return arr.join('');
	},
	formatSpecifiedDate(value, fmt) {
		// 对Date的扩展，将 Date 转化为指定格式的String   
		// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
		// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
		// 例子：   
		// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
		// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
		var o = {
			"M+": value.getMonth() + 1, //月份   
			"d+": value.getDate(), //日   
			"h+": value.getHours(), //小时   
			"m+": value.getMinutes(), //分   
			"s+": value.getSeconds(), //秒   
			"q+": Math.floor((value.getMonth() + 3) / 3), //季度   
			"S": value.getMilliseconds() //毫秒   
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (value.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
	formatDateLong(value) {
		if (!value) {
			return "-"
		}
		// 格式化年月
		var arr = []
		arr.push(value.substr(0, 4))

		arr.push(value.substr(4, 2))
		arr.push(value.substr(6, 2))
		return arr.join('.');
	},
	formatDateLongToS(value) {
		if (!value) {
			return "-"
		}
		// 格式化年月
		var arr = []
		arr.push(value.substr(0, 4))
		arr.push(value.substr(4, 2))
		arr.push(value.substr(6, 2))
		var clock = [];
		clock.push(value.substr(8, 2))
		clock.push(value.substr(10, 2))
		return arr.join('.') + "  " + clock.join(':');
	}
}
