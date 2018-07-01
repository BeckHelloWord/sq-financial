<template>
    <div class="aboutUs">
        <div class="logo">
             <img src="../../assets/images/sq_logo.png">
        </div>
        <div class="introduce">
            <span> 3汽金融公司目的是为中国卡车用户提供专业、丰富的卡车导购服务，并为卡车厂商和卡车经销商提供卓有成效的互联网营销解决方案。汽金融公司将不断强化对用户的连接, 重新定义用户提升在购车和用车过程中的体验，为用户带来更简单、更精彩的购车服务。</span>   
        </div>
        <div class="tel">
            <span>客服电话</span>
            <span class="right"><a :href="'tel:'+$configInfo.publicInfo.tel">{{$configInfo.publicInfo.tel}}</a></span>
        </div>
        <div class="wechat">
            <span>微信公众号</span>
            <span class="right">{{$configInfo.publicInfo.weChat}}</span>
        </div>
    </div>
</template>
<script>
export default {
    mounted:function(){
       window.Hub.$emit("setTitle", "关于我们", false, null, " ", null); 
    }
}
</script>
<style lang="scss" scoped>
 @import "../../assets/skin";    
    .aboutUs{
        font-size: pxToRem(28);
        background: #f8f8f8;
        // border: 1px solid red;
        .logo{
            width: 100%;
            height: pxToRem(250);
            line-height:  pxToRem(250);
            text-align: center;
        }
        .introduce{
            width: 100%;
            background: #ffffff;
            padding:pxToRem(40)  pxToRem(60);           
            display: table-cell;
            vertical-align: middle;
            span{
                display: table;
                text-indent: pxToRem(40);
            }
        }
        .tel{
           margin-top: pxToRem(40);
           border-bottom: 1px solid $ft-dedede;
        }
        .tel,.wechat{
            width: 100%;
            height: pxToRem(100);
            line-height:pxToRem(100); 
            padding:0 pxToRem(60);
            background: #ffffff;
            position: relative;
            .right{
               position: absolute;
               right:pxToRem(60); 
            }
        }
    }
</style>
