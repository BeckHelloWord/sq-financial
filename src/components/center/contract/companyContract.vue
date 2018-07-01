<template>
<div class="companyContract">
    <div class="contractInfo">
       <div class="title"><img  class="icon" src="../../../assets/images/contractinfo.png">发票信息</div>
       <div class="form-item">公司抬头：<input type="text" v-model="companyName"/></div>
       <div class="form-item">税&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：<input type="text" v-model="invoiceTaxNumber"/></div>       
       <div class="form-item">单位地址：<input type="text" v-model="companyAddress"/></div>
       <div class="form-item">公司电话：<input type="text" v-model="companyPhone"/></div>       
       <div class="form-item">开户银行：<input type="text" v-model="bankName"/></div>
       <div class="form-item">银行账户：<input type="text" v-model="bankAccount"/></div>
    </div>
    <div class="annexinfo">
        <div class="title"><img  class="icon" src="../../../assets/images/annexinfo.png">附件信息</div>
         <upload uploadTxt='营业执照' @changeImg="changeImg" className='licence'></upload>
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
                companyName:'',
                invoiceTaxNumber:'',
                companyAddress:'',
                companyPhone:'',
                bankName:'',
                bankAccount:'',
                imgBase:'',
                imgSuffix:'',
                idDisabled:false
            }
        },
        methods:{
             changeImg(imgType, imgBase) {
                this.imgSuffix = imgType;
                this.imgBase = imgBase;
            },

            saveInvoiceInfo(){
                idDisabled: false 
                Public.API_GET({
                    url: "saveInvoiceInfo",
                    data: {
                    orderId:this.orderid,
                    type: "1",
                    companyName:this.companyName,
                    invoiceTaxNumber:this.invoiceTaxNumber,
                    companyAddress:this.companyAddress,
                    companyPhone:this.companyPhone,
                    bankName:this.bankName,
                    bankAccount:this.bankAccount,
                    image:this.imgBase,
                    imageSuffix:this.imgSuffix
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
            }
        },
         mounted: function() {
            window.Hub.$emit("setTitle", "签署合同", false, null, false, false);
            window.Hub.$emit("setFooter", false);
        }
    }
</script>
<style lang="scss">
@import "../../../assets/skin";
    .mint-cell-wrapper{
        background-image:none;
    }
    .companyContract{
        width: 100%;
        background-color: $background;
        color: $black;
        font-size: pxToRem(25);
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
            margin-bottom:pxToRem(30);
            background: $white;
           
            .form-item{
                font-size: pxToRem(30);
                height:pxToRem(120);
                line-height:pxToRem(120); 
                border-bottom: 1px solid #ebebeb;
                position: relative;
                input{
                    width:70%;
                    position: absolute;
                    top:50%;
                    right:pxToRem(20);
                    transform:translateY(-50%);
                }
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
                .upload .upload-txt {
                    position: absolute;
                    bottom: 5%;
                    left: 0;
                    width: 100%;
                    font-size: 1.16667rem;
                    color: #666;
                    text-align: center;
                }
            }
        }
        .finished {
            width: 100%;
            height: pxToRem(100);
            line-height: pxToRem(100);
            background-color: $white;
            color: $white;
            text-align: center;
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