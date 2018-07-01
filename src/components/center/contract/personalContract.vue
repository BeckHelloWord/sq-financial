<template>
<div class="personalContract">
    <div class="contractInfo">
       <div class="title"><img  class="icon" src="../../../assets/images/contractinfo.png">发票信息</div>
       <div class="form-item">签&nbsp;&nbsp;约&nbsp;&nbsp;人：<input type="text" v-model="personalName" readonly/></div>
       <div class="form-item">身份证号：<input type="text"  v-model="idCard" readonly/></div>       
       <div class="form-item">电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：<input type="text"  v-model="personalMobile" readonly/></div>
       <div class="form-item">住&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：<input type="text" v-model="address" placeholder="请填写住址"/></div>
       
    </div>
    <div class="finished">
        <button class="complete" @click="saveInvoiceInfo" id="btn" :disabled='idDisabled' :class="{bgColor:!idDisabled}">立即签署</button>
    </div>
</div>
</template>
<script>
 import upload from "../../public/upload";
 import { Cell } from 'mint-ui';
Vue.component(Cell.name, Cell);
    export default{
         components: {
            upload
        },
        data(){
            return{
                orderid: this.$route.query.orderid,
                personalName:'',
                idCard:'',
                personalMobile:'',
                address:'',
                idDisabled:false
            }
        },
        methods:{
            saveInvoiceInfo(){
                idDisabled: false 
                Public.API_GET({
                    url: "saveInvoiceInfo",
                    data: {
                    type: "0",
                    orderId:this.$route.query.orderid,
                    personalAddress:this.address
                    },
                    success: result => {
                    var data = result.data;
                    if (result.isSuccess) {
                        window.Hub.$emit("toast", result.message);
                        window.Hub.$emit("faceCheck", this.orderid, "order");
                    } else {
                        this.$store.dispatch("Toast", result.message);
                    }
                    }
                });
            },
            getPersonalInvoiceInfo(){
                Public.API_GET({
                url:"getPersonalInvoiceInfo",
                success: result => {
                    if (result.isSuccess) {
                        var personalInfo = result.data;
                        this.personalName = personalInfo.personalName;
                        this.idCard = personalInfo.idCard;
                        this.personalMobile = personalInfo.personalMobile;

                    } else {
                        window.Hub.$emit("toast", result.message);
                    }
                }
            });
            }
        },
         mounted: function() {
            this.getPersonalInvoiceInfo();
            window.Hub.$emit("setTitle", "签署合同", false, null, false, false);
            window.Hub.$emit("setFooter", false);
        }
    }
</script>
<style lang="scss" scoped>
@import "../../../assets/skin";
    .mint-cell-wrapper{
        background-image:none;
    }
    .personalContract{
        .icon{
            width:pxToRem(65);
            height:pxToRem(65);
        }
         .title{
                font-size: pxToRem(35);
                color:#000;
                height:pxToRem(120);
                line-height:pxToRem(120); 
            }
        .contractInfo{
            padding:0 3%;
            margin-bottom:pxToRem(40);
            background: $white;
           
            .form-item{
                font-size: pxToRem(30);
                height:pxToRem(120);
                line-height:pxToRem(120); 
                border-bottom: 1px solid #ebebeb;
                position: relative;
            }
            .form-item:last-child{
                border:none;
            }
        }
        .annexinfo{
            padding:0 3%;
            background: $white;
            position: relative;
            .licence{
                background: url("../../../assets/images/camera.png") no-repeat center 40%;
                background-size: 40%;
                text-align: center;
            }
        }
        .finished {
            width: 100%;
            height: pxToRem(100);
            line-height: pxToRem(100);
            background-color: $white;
            color: $white;
            text-align: center;
            // position: fixed;
            // bottom: 0;
            // left: 0;
            z-index: 100000000;
            .complete {
            width: 80%;
            height: pxToRem(70);
            line-height: pxToRem(70);
            text-align: center;
            margin: pxToRem(15) auto;
            border-radius: pxToRem(50);
            color: $white;
            }
            // 解决按钮设置为disabled属性后默认样式在ipone里面没有办法显示的问题
            button {
            cursor: pointer;
            -webkit-appearance: none;
            }
            button:disabled {
            background-color: #c0c0c0 !important;
            }
        }
    }
    .bgColor {background: linear-gradient(to right, #00c0ff, #009cff); /* 标准的语法 */}
</style>