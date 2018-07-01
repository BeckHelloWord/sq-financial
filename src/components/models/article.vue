<template>
	<div class="article">
        <div class="title">{{articleTitle}}</div>
        <div class="time">{{publishDate}}</div>
        <article class="content"><p>{{content}}</p></article>
    </div>
</template>

<script>

    import {
        InfiniteScroll
    } from 'mint-ui';
    Vue.use(InfiniteScroll);
    export default {
        data: function() {
            return {
                articleId:'',
                articleTitle:'',
                publishDate:'',
                content :''
            }

        },
        methods: {
            getArticle(){
                Public.API_GET({
                url:"getArticle",
                data:{
                    articleId:"1"
                },
                success: result => {
                    if (result.isSuccess) {
                        var article = result.data
                        this.articleId = article.articleId
                        this.articleTitle = article.articleTitle
                        window.Hub.$emit("setTitle", this.articleTitle, false, null, " ", null);
                        this.publishDate = article.publishDate.replace(/-/g,'.').substr(0,10)
                        this.content = article.content
                    }else {
                        this.$store.dispatch("Toast", result.message);
                    }
                }
            })
        }
    },
        mounted: function() {
            this.getArticle();
            window.Hub.$emit('refresh', null);
        },
        beforeDestroy() {
            window.Hub.$emit('refresh', null);
        }
    }
</script>
<style lang="scss" scoped="" type="text/css">
    @import "../../assets/skin";
    .article{
        background: #fff;
        width:100%;
        height:100vh;
        padding:3%;
        font-size:pxToRem(38);
        .title{
        width:100%;
        padding:pxToRem(10);
        font-size:pxToRem(40);
        color:#333;
        }
        .time{
            color:#999;
            margin-bottom: pxToRem(15);
        }
        .content{
        width:100%;
        color:#666;
        font-weight: normal;
        font-stretch: normal;
        line-height:pxToRem(50);
        letter-spacing: 0px;
        color: #666666;
        p{
            width:100%;
            word-wrap:break-word;
            // text-indent:pxToRem(40);

        }
        }
    }


</style>
