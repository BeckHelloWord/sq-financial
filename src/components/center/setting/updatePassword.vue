<template>
    <div class="updatepassword">
		<div class="content">
			<label class="oldPassword">
				<input type="password" placeholder="输入原密码" v-model='oldPassword' maxlength="11" >
				<div class="del iconfont icon-clear" v-show='oldPassword' @click="clearModel('oldPassword')"></div>
			</label>
			<label class="newPassword">
				<input type="password" placeholder="输入新密码" v-model='newPassword' maxlength="11">
				<div class="del iconfont icon-clear" v-show='newPassword' @click="clearModel('newPassword')"></div>
			</label>
			
			<div class="btn-forget clearfix">
				<router-link to="/index/forget" class="fr">忘记密码?</router-link>
			</div>
		</div>
        <!-- 提交 -->
        <div class="setBtn">
            <input type="button" value="完成" @click='update' :class="loginBtnDisable">
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'mint-ui';
export default {
  data: function() {
    return {
      oldPassword: "",
	  newPassword: "",
	  loginBtnDisable:"",
    };
  },
  methods: {
    /* 清空输入框 */
    clearModel(model) {
      this[model] = "";
	},
	//提交
	update(){
		if (!this.$configInfo.reg.passwordReg.test(this.newPassword)) {
          this.$store.dispatch("Toast", "请输入正确的密码");
          return false;
		}else{
			var parameter = {
				password :this.newPassword,
				oldPassword :this.oldPassword
			}
			Public.API_GET({
			url: "updatePasswordNew",
			data: parameter,
			success: result => {
          		if (result.isSuccess) {
					MessageBox.alert('登录密码重置成功，请重新登录','').then(action => {
						if(action=="confirm"){
							this.$store.dispatch("LoginOut")
						 }
					});
					
            } else {
             this.$store.dispatch("Toast", result.message);
            }
         
        }
      });
		}
		
	}
  },
  mounted: function() {
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "修改密码", false, "null", "", "");
    window.Hub.$emit("setFooter", false);
    $("body").css("background", "white");
  },
}
</script>
<style lang="scss" type="text/css" scoped="">
@import "../../../assets/skin";
.updatepassword {
	height:100%;
	height: 100%;
	background: white;
	padding: 0 ;
	.content{
		padding:0 pxToRem(30);
		input {
		&[type="checkbox"] {
		width: pxToRem(16 * 2);
		height: pxToRem(16 * 2);
		float: left;
		margin-right: pxToRem(5 * 2);
		padding: 0;
		margin-top: pxToRem(9 * 2);
		}
	}
		.oldPassword,
		.newPassword {
		@include common-sign;
	}
	.btn-forget {
		display: block;
		margin: 8% auto 0;
		text-align: center;
		font-size: pxToRem(26);
		color: $ft-666;
	}
		

	}
 
	.setBtn {
		input[type="button"] {
		@include common-btn-login;
		&.login-btn-disable {
			@include common-btn-disable();
		}
		}
	}
}
</style>