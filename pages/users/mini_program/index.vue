<template>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	export default {
		//computed: mapGetters(['chatUrl']),
		data() {
			return {
			}
		},
		onLoad(option) {
			let appId = option.appId;
			let path = decodeURIComponent(option.path);
			console.log("path--",path)
			wx.navigateToMiniProgram({
			  appId: appId,
			  path: path,
			  extraData: {
			    foo: 'bar'
			  },
			  // envVersion: 'develop',
			  success(res) {
			    // 打开成功
			  },
			  complete(){
				  // 关闭当前页面，返回上一页面
				  uni.navigateBack();
			  }
			})
		}
	}
</script>
