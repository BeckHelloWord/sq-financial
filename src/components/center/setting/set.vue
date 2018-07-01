<template>
    <div class="set">
        <div class="modifyTel">
            
                <router-link to="/center/setting/modifyTel">
                    <span>修改手机号</span>
                    <span class="right"><i class="iconfont icon-arrow-down"></i></span>
                </router-link>  
                               
        </div>
         <div class="modifyPass">
             <div class="border">
               <router-link to="/center/setting/updatePassword">
                <span>修改密码</span>
                <span class="right"><i class="iconfont icon-arrow-down"></i></span>
               </router-link>            
            </div>  
        </div>
        <div class="quit" >
            <button @click ="quit">安全退出</button> 
        </div>
    </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
export default {
    data(){
        return{
            
        }
    },
    methods:{
       quit(){
           MessageBox({
                title: '提示',
                message: '确定退出吗?',
                showCancelButton: true
            }).then(action => {
                if(action == "confirm"){
                    this.$store.dispatch("LoginOut")
                }
            });       
       }
    },
    mounted(){
         window.Hub.$emit("setTitle","设置",null,false,"", null)
         window.Hub.$emit("setFooter", false);
    }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/skin";
    .set{
        background: $background;
        font-size: pxToRem(30);      
        .modifyTel,.modifyPass{
            width: 100%;
            height: pxToRem(86);
            line-height: pxToRem(86);            
            background: $white;
            padding-right: pxToRem(60);  
            padding-left: pxToRem(60);
            span{
                display: inline-block;
                width: 30%;                                
            }
            .right{
                width: 60%;               
                text-align: right;               
            }
        }
        .modifyPass{  
            .border{             
                border-top: 1px solid $ft-dedede;
            }         
            
        }
        .modifyPass{
            margin-bottom: pxToRem(120);
        }
        .quit{
            width: 100%;
            height: pxToRem(80);
            line-height: pxToRem(80);
            text-align: center;
            button{
                width: 90%;
                height: 100%;
                color:$white;
                border-radius: pxToRem(50);
                @include common-gradient;
            }         
        }
    }
    .icon-arrow-down {
        font-size: pxToRem(25);
        color: #999;
        float: right;
        transform: rotate(270deg);
      }
</style>
