<template>
    <div class="modifyTelOne">
        <label class="userName">
            <input type="tel" placeholder="输入原手机号" v-model='telNumber' maxlength="11" >
            <div class="del iconfont icon-clear" v-show='telNumber' @click="clearModel"></div>
        </label>
        <div class="button">
            <button @click = "next">下一步</button>
        </div>

    </div>
</template>

<script>
export default {
  data: function() {
    return {
      telNumber: "", 
      cNumber:''     
    };
  },
 
  methods: {
   clearModel(){
      this.telNumber =""
   },
   check(){  // 手机号为空，错误的情况 都是不等于原手机号的情况
        if(this.telNumber != this.cNumber){
          this.$store.dispatch("Toast", "请输入正确的手机号");
          return true;
        }
   },
   getMemberInfo(){
       Public.API_GET({
        url: "getMemberInfo",
        success: result => {
          var data = result.data
          if (result.isSuccess) {
             this.cNumber = data.mobile 
          } else {
            this.$store.dispatch("Toast", result.message);
          }
        }
      });
   },
   next(){
      if( this.check() )return false
      this.$router.push({
        name: "modifyTelN",
        params: {tel: this.cNumber}
      })
   }
  },
  mounted: function() {   
    this.getMemberInfo()   
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "更改手机号", false, "null", "", "");
    window.Hub.$emit("setFooter", false);
    $("body").css("background", "white");
  },
};
</script>
<style lang="scss" type="text/css" scoped="">
@import "../../../assets/skin";
.modifyTelOne {
     width: 100%;
     padding:pxToRem(70) pxToRem(40);
    .button{
        width: 100%;
        height: pxToRem(80);
        margin-top: pxToRem(80);
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
  .userName{
    @include common-sign;
  }
</style>