<template>
	<view class="login-code" >
		<view class="login-header">
			<view class="title">输入验证码</view>
			<view class="flex">
				<text style="color:#999;margin-right: 20rpx;">验证码已发送至:</text>
				<text class="font-weight: 600">+86 {{account}}</text>
			</view>			
		</view>
		<view class="code-box">
			<u-code-input v-model="captcha" @change="change" :focus="true"></u-code-input>
		</view>
		<button class="btn-code" :style="{ opacity: disabled ? '0.5' : '1' }" @click="getCode">{{ text }}</button>
	</view>
</template>

<script>
	import {
		loginMobile,
		registerVerify,
		getCodeApi,
		getUserInfo,
		phoneWxSilenceAuth
	} from "@/api/user";
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		bindingPhone
	} from '@/api/api.js'
	import {
		getUserPhone,
		iosBinding
	} from '@/api/public';
	import {
		mapGetters
	} from "vuex";
	const BACK_URL = "login_back_url";
	import Routine from '@/libs/routine';
	export default {
		name: "getCode",
		computed: mapGetters(['userInfo', 'isLogin']),
		data() {
			return {
				account: '',
				captcha: '',
			}
		},
		mixins:[sendVerifyCode],
		onLoad(params) {
			this.account = params.account
			this.getCode()
		},
		methods: {
			async getCode() {
				if(this.disabled) return
				try {
					const { msg } = await registerVerify(this.account)
					this.$util.Tips({
						title: msg
					});
					this.sendCode();
				} catch(err) {	
					console.log(err,this.$util)
					this.$util.Tips({
						title: err
					})
				}
			},
			change(value) {
				if(value.length < 6) return
				this.captcha = value
				this.loginMobile()
			},
			//手机号验证码登录
			async loginMobile() {
				if (!/^[\w\d]+$/i.test(this.captcha)) return this.$util.Tips({
					title: '请输入正确的验证码'
				});
				uni.showLoading({
					title: '正在登录中'
				})		
				try {
					const code = await Routine.getCode()
					const { data, data:{token} } = await loginMobile({
						code,
						phone: this.account,
						captcha: this.captcha,
						spread_spid: this.$Cache.get("spread")
					})					
					this.$store.commit("LOGIN", {token});
					await this.$store.dispatch("GETADDRESSLIST")
					uni.$emit('upDateHome')
					this.getUserInfoFun(data);
					uni.hideLoading()
				} catch(e) {
					this.$util.Tips({
						title: e
					});
				}			
			},
			/**
			 * 获取个人用户信息
			 */
			async getUserInfoFun(logingData) {
				try {
					this.$store.commit("SETUID", logingData.uid);
					this.$store.commit("SETOPENID", logingData.openId);
					const loginBackUrl = this.$Cache.get("login_back_url") || '/pages/index/index'
					const { data } = await getUserInfo()
					this.$store.commit("UPDATE_USERINFO", data);
					uni.reLaunch({
						url: loginBackUrl?.indexOf('/pages/users/login/index') !== -1  ?  "/pages/index/index" : loginBackUrl
					});		
				} catch(e) {
					console.log(e)
				}	
			},
		}
	}
</script>

<style lang="scss">
	.login-code {
		background-color: #fff;
		padding: 60rpx 30rpx;
		height: 100vh;
		.login-header{
			.title {
				font-size: 36rpx;
				color: #333;
				margin-bottom: 25rpx;
				font-weight: 600;
			}
		}
	}
	
	.btn-code {
		background: #FF920F;
		border-radius: 16rpx;
		color: #fff;
		height: 82rpx;
		margin-top: 80rpx;
		font-size: 32rpx;
		line-height: 82rpx;
	}
	.code-box {
		margin-top: 60rpx;
	}

</style>