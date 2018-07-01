<template>
	<li>
        <div class="messageTitle" v-if="!item.isReadDisplay">
           <span>●</span> {{item.msgContent}}         
        </div>
        <div class="messageTitle read" v-else>
           {{item.msgContent}}         
        </div>
        <div class="messagePrice" >
            {{item.sendTimeDisplay|formatDateLongToS}}
        </div>      
	</li>
</template>

<script>
    export default {
        props: ['item'],
        methods: {
        },
        mounted: function() {

        },
        beforeMount: function() {

        }
    }
</script>

<style lang="scss" type="text/css">
    @import "../../assets/skin";
    .messageList {
        li {
            margin-top: pxToRem(20);
            background-color: #fff;
            padding: pxToRem(20) 3%;
            .messageTitle {
                line-height: pxToRem(40);
                font-size: pxToRem(28);
                color: #333333;
                span{
                    color: #009cff;
                }
            }
            .read{
                color: #666;
            }
            .messagePrice{
                text-align: right;
                line-height: pxToRem(40);
                font-size: pxToRem(24);
                color: #999999;
            }
        }
    }
</style>