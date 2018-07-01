<template>
  <div class="myFooter" v-show='showFlag'>
    <ul>
      <router-link to="/index/index"><li><i class="iconfont icon-index"></i>&ensp;&ensp;首页</li></router-link>
      <router-link to="/index/discovery"><li><i class="iconfont icon-find"></i>&ensp;&ensp;发现</li></router-link>
       <router-link to="/center/mine"><li><i class="iconfont icon-my"></i>&ensp;&ensp;我的</li></router-link>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showFlag: false
    }
  },
  beforeCreate:function(){
    //footer事件
    window.Hub.$on('setFooter', (flag) => { 
      this.showFlag = flag
    });
  }
}
</script>



 