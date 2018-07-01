<template>
	<div class="discoveryList" v-if="loadEnd">
		<div class="myCar" v-show="false">
			<label>我的车辆</label>
			<span>1台</span>
		</div>
		<div class="newsTitle">新闻动态</div>
		<ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
			<template v-if="investList.length>0" v-for="item in investList">
				<router-link :to="{path:'/index/discoveryArticle/'+item.articleId}" v-if="item">
					<li>
						<div class="">
							<img :src="item.shopArticleImageVos[0].original" alt="">
						</div>
						<div class="">
							<h2>{{item.articleTitle}}</h2>
							<p>
								{{item.publishDate}}</p>
						</div>
					</li>
				</router-link>
			</template>
		</ul>
		<div class="empty">
		</div>
	</div>
</template>

<script>
/*
                阅读全部
                	接口：/api/sitemail/shopMessageFront/readAllSiteMail
                站内信列表
                	接口：/api/sitemail/shopMessageFront/getSiteMailList
            		传参：
            		 pageNum: 0,
            		pageSize: 10,
                 * @return Map
                     *          data	Object
                返回的数据

                  isReadDisplay	String	    是否已读 0:未读 1：已读
                  sendTimeDisplay	String	    时间[yyyyMMddHHmmss]
                  msgTitle	String	    消息title
                  msgContent	String	   消息内容
                  msgIdDisplay	String	    消息内容ID
                日期		作者		操作
                5-8 	倪文斌		新建

                */
import { InfiniteScroll } from "mint-ui";
import messageItem from "../public/messageItem";
Vue.use(InfiniteScroll);
export default {
  components: {
    messageItem: messageItem
  },
  data: function() {
    return {
      investList: [
        {
          msgTitle: "恭喜三汽平台，交易额突破十个亿！",
          msgContent: "龟仙人老爷爷用龟派气功把月球打炸啦",
          msgIdDisplay: 1,
          isReadDisplay: 1,
          sendTimeDisplay: "20180612132011",
          image:
            "//bxwd-img.oss-cn-hangzhou.aliyuncs.com/upload/image/1805/d2a5db9c-3753-4274-a13f-321b9edd7a6e.png"
        }
      ],
      list: {},
      pageNum: 1,
      pageSize: 10,
      hasNext: true,
      initLock: true,
      loadEnd: false
    };
  },
  methods: {
    loadMore() {
      if (this.initLock) {
        return;
      }
      if (!this.hasNext) {
        return;
      }
      this.loading = true;
      Public.API_GET({
        url: "findArticleList",
        data: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        success: result => {
          for (var item in result.data) {
            this.investList.push(result.data[item]);
          }
          this.pageNum += 1;
          this.loading = false;
          if (result.data.length < this.pageSize) {
            this.hasNext = false;
          }
        }
      });
    },
    initData(finishFun) {
      this.pageNum = 0;
      this.pageSize = 10;
      this.hasNext = true;
      // this.investList=[];
      this.loadEnd = false;
      Public.API_GET({
        url: "findArticleList",
        data: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        success: result => {
          this.loadEnd = true;
          if (result.data && result.data.length > 0) {
            this.investList = result.data;
          }
          this.pageNum += 1;
          if (result.data.length < this.pageSize) {
            this.hasNext = false;
          }
          this.initLock = false;
          if (typeof finishFun == "function") {
            finishFun();
          }
        }
      });
    }
  },
  mounted: function() {
    this.initData();
    window.Hub.$emit("refresh", null);
    window.Hub.$emit("setTitle", "发现", false, null, false, false);
    window.Hub.$emit("setFooter", true);
  },
  beforeDestroy() {
    window.Hub.$emit("refresh", null);
  }
};
</script>
<style lang="scss" scoped="" type="text/css">
@import "../../assets/skin";
.discoveryList {
  .myCar {
    background-color: #fff;
    padding: 0 3%;
    line-height: pxToRem(88);
    label {
      display: inline-block;
      width: 50%;
    }
    span {
      display: inline-block;
      text-align: right;
      width: 50%;
    }
  }
  .newsTitle {
    margin: pxToRem(30) 0;
    line-height: pxToRem(36);
    font-size: pxToRem(36);
    text-align: center;
    color: #333333;
    position: relative;
    &:after {
      display: block;
      content: "";
      position: absolute;
      height: 1px;
      width: 20px;
      bottom: -5px;
      left: 50%;
      margin-left: -10px;
      background-color: #666666;
    }
  }
  li {
    margin-top: pxToRem(20);

    background-color: #fff;
    img {
	  position: relative;
	  left:50%;
      max-width: 100%;
	  max-height: 100%;
	  transform: translateX(-50%);
    }
    p {
      padding: 0 3%;
      color: #999999;
      font-size: pxToRem(24);
      margin-top: pxToRem(10);
      padding-bottom: pxToRem(10);
    }
    h2 {
      font-weight: normal;
      margin-top: pxToRem(20);
      font-size: pxToRem(32);
      padding: 0 3%;
      color: #333333;
    }
  }
}
</style>
