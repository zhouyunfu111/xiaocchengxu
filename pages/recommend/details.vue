<template>
	<view class="recommend-details">
		<jyf-parser :html="content" :tag-style="tagStyle"></jyf-parser>
	</view>
</template>

<script>
	import parser from "@/components/jyf-parser/jyf-parser";
	export default {
		data(){
			return {
				content: '',
				tagStyle: {
					img: 'width:100%;display:block;',
					table: 'width:100%',
					video: 'width:100%'
				},
			}
		},
		components:{
			"jyf-parser": parser
		},
		onLoad(params){
			uni.setNavigationBarTitle({
				title: params.title.length > 7 ? params.title.substring(0, 7) + "..." : params.title
			});
			const evenChannel = this.getOpenerEventChannel();
			evenChannel.on('toDetails', (data) => {
				this.content = data
			})		
		},
		
	}
</script>

<style lang="scss">
	.recommend-details {
		padding: 40rpx 30rpx;
		.interlayer  {
			align-content: inherit;
			    align-items: inherit;
			    display: inherit;
			    flex-direction: inherit;
			    flex-wrap: inherit;
			    justify-content: inherit;
			    width: 100%;
			    white-space: inherit;
		}
	}
</style>