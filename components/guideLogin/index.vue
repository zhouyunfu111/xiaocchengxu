<template>
	<view>
		<view class="guide-login" v-if="!isLogin" :class="bottomNavigationIsCustom?'bottom-custom':''">
			<view class="no-login flex">
				<text>登录并完善商家信息可查看商品价格</text>
				<view><button @click="toLogin">去登录</button></view>
			</view>
		</view>
		<view class="guide-login" v-if="isLogin && !shopList.length">
			<view class="no-login flex">
				<text>请完善门店信息后继续使用功能</text>
				<view><button @click="toPerfectInfo">去填写</button></view>
			</view>
		</view>
		<!-- <view class="guide-login" v-if="isLogin && !shopList.length">
			<view class="no-login flex">
				<text>请完善门店信息后继续使用功能</text>
				<view><button @click="toPerfectInfo">去填写</button></view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	export default {
		computed: {
			...mapGetters(['isLogin', 'shopList','bottomNavigationIsCustom']),
		},
		data () {
			return {
				
			}
		},
		methods:{
			toLogin() {
				uni.navigateTo({
					url:"/pages/users/wechat_login/index"
				})
			},
			toPerfectInfo() {
				uni.navigateTo({
					url:"/pages/users/user_shop_list/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.guide-login {
		background: rgba(51,51,51,0.8);
		padding: 22rpx 30rpx;
		color: #fff;
		width: 100%;	
		position: fixed; 
		bottom: 0;
		left: 0;
		line-height: 46rpx;
		z-index: 9999;
		button {
			background-color: #FE5C2D;
			color: #fff;
			padding: 8rpx 34rpx;
			font-size: 24rpx;
			width: 140rpx;
			height: 48rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.bottom-custom{
		bottom: calc(98rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		bottom: calc(98rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}
	.no-login {
		justify-content: space-between;
	}
</style>