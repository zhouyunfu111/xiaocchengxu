<template>
	<view class="page" :data-theme="theme" :style="{'background-image': `url(${backBg})`}">
		<view class="system-height" :style="{height:statusBarHeight}"></view>
		<!-- #ifdef MP -->
		<view class="title-bar" style="height: 43px;">
			<view class="icon" @click="back" v-if="!isHome">
				<u-icon name="arrow-left" size="22" color="#333" ></u-icon>
			</view>
			<view class="icon" @click="home" v-else>
				<!-- <image :src="urlDomain+'crmebimage/perset/usersImg/home.png'"></image> -->
				<u-icon name="home" size="22" color="#333" ></u-icon>
			</view>
			账户登录
		</view>
		<!-- #endif -->
		<view class="wechat_login">
			<view class="img acea-row row-center">
				<image src="@/static/images/login/logo.png" mode="widthFix" class="image"></image>
			</view>
			<view class="company">让餐饮更简单，让入口更安全</view>
			<view class="btn-wrapper">
				<!-- #ifdef MP -->
				<button hover-class="none"
					@click="getUserProfile" class="btn1 item1">手机号授权登录</button>
				<!-- <view v-else>
					<button v-if="routinePhoneVerification == 1 || routinePhoneVerification.length===3"  hover-class="none"
						@click="onUserPhone" class="btn1"><text
							class='iconfont'></text>一键绑定手机号</button>
					<button v-if="routinePhoneVerification == 2 || routinePhoneVerification.length===3" hover-class="none"
						@click="onUserPhone('isPhone')" class="btn2">手动绑定手机号</button>
				</view> -->
				<button class="btn2" @click="toLogin">输入手机号码登录</button>
				<!-- #endif -->
			</view>
		</view>
		<block v-if="isUp">
			<mobileLogin :isUp="isUp" :loginConfig="loginConfig" @close="maskClose" :authKey="authKey" @wechatPhone="wechatPhone"></mobileLogin>
		</block>
		<atModel v-if="isPhoneBox" :userPhoneType="true" :isPhoneBox="isPhoneBox" :authKey="authKey"
			:content="getPhoneContent" @closeModel="bindPhoneClose" @confirmModel="confirmModel"></atModel>
		<privacy :value.sync="privacyVal" :isShowPrivacy.sync="isShowPrivacy" />
	</view>
</template>

<script>
	const app = getApp();
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	import mobileLogin from '@/components/login_mobile/index.vue'
	import atModel from '@/components/accredit/index.vue'
	import privacy from '@/components/privacy'
	import {
		mapGetters
	} from "vuex";
	import {
		getUserPhone
	} from '@/api/public';
	import {
		LOGO_URL,
		EXPIRES_TIME,
		USER_INFO,
		STATE_R_KEY
	} from '@/config/cache';
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	import {
		getUserInfo,
		spread
	} from '@/api/user.js'
	import Routine from '@/libs/routine';
	import wechat from "@/libs/wechat";
	export default {
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				isUp: false, // 绑定手机号手动输入弹窗
				phone: '',
				statusBarHeight: statusBarHeight,
				isHome: false,
				isPhoneBox: false, //授权手机号弹窗
				code: '',
				authKey: '',
				options: '',
				userInfo: {},
				codeNum: 0,
				pageStyle: {}, //背景图
				theme: app.globalData.theme,
				// urlDomain: this.$GLOBAL.urlDomain,
				backBg: '', //背景图片
				getPhoneContent: '申请获取您的手机号用于注册，完成后可使用商城更多功能',
				wxCode: '', //小程序code值
				companyName: app.globalData.companyName, //公司名称
				routinePhoneVerification: app.globalData.routinePhoneVerification, //小程序手机号校验类型（多选）1微信小程序验证 2短信验证
				loginConfig: '' ,//小程序绑定手机号，isPhone其他手机号绑定
				wxLogin: true ,//登录显示
				mobileLoginLogo: app.globalData.mobileLoginLogo ,// 登录页logo，
				privacyVal: false,
				isShowPrivacy: false
			}
		},
		components: {
			mobileLogin,
			atModel,
			privacy
		},
		onLoad(options) {
			//背景图片
			switch (app.globalData.theme) {
				case 'theme1':
					this.backBg = `${this.urlDomain}crmebimage/preset/wxbj1.png`;
					break;
				case 'theme2':
					this.backBg = `${this.urlDomain}crmebimage/preset/wxbj2.png`;
					break;
				case 'theme3':
					this.backBg = `${this.urlDomain}crmebimage/preset/wxbj3.png`;
					break;
				case 'theme4':
					this.backBg = `${this.urlDomain}crmebimage/preset/wxbj.png`;
					break;
				case 'theme5':
					this.backBg = `${this.urlDomain}crmebimage/preset/wxbj5.png`;
					break;
			}

			let that = this
			// #ifdef H5
			document.body.addEventListener("focusout", () => {
				setTimeout(() => {
					const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop ||
						0;
					window.scrollTo(0, Math.max(scrollHeight - 1, 0));
				}, 100);
			});
			const {
				code,
				state,
				scope
			} = options;
			this.options = options
			// 获取确认授权code
			this.code = code || ''
			console.log(this.options)
			//if(!code) location.replace(decodeURIComponent(decodeURIComponent(option.query.back_url)));
			if (code && this.options.scope !== 'snsapi_base') {
				let spread = app.globalData.spread ? app.globalData.spread : 0;
				//公众号授权登录回调 wechatAuth(code, Cache.get("spread"), loginType)
				wechat.auth(code, spread).then(res => {
					if (res.type === 'register') {
						this.authKey = res.key;
						this.isUp = true
					}
					if (res.type === 'login') {
						this.$store.commit('LOGIN', {
							token: res.token
						});
						this.$store.commit("SETUID", res.uid);
						this.getUserInfo();
						//this.wechatPhone();
						//location.replace(decodeURIComponent(decodeURIComponent(option.query.back_url)));
					}
				}).catch(error => {});
			}
			// #endif
			try{
				let pages = getCurrentPages();
				let prePage = pages[pages.length - 2] || {};
				const goHomeRoute = ['pages/users/wechat_login/index','pages/order_addcart/order_addcart']
				if (goHomeRoute.includes(prePage?.route || pages[0]?.route || '')) {
					this.isHome = true
				} else {
					this.isHome = false
				}
			}catch(error){
				console.log(error) 
			}
			
		},
		methods: {
			toLogin() {
				uni.navigateTo({
					url:'/pages/users/login/index?authKey='+ this.authKey
				})
			},
			getWxInfo() {
				uni.login({
					provider: 'weixin', //使用微信登录
					success: function (loginRes) {
						console.log(loginRes.authResult);
					}
				})
			},
			//绑定手机号弹窗回调
			confirmModel() {
				this.isPhoneBox = false;
				this.isUp = true
			},
			back() {
				uni.navigateBack();
			},
			home() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			modelCancel() {
				this.isPhoneBox = false;
			},
			// 弹窗关闭
			maskClose() {
				// this.isUp = false  //点击模态框会关闭登录弹框，防止用户误触而关闭
			},
			bindPhoneClose(data) {
				if (data.isStatus) {
					this.isPhoneBox = false
					this.$util.Tips({
						title: '登录成功',
						icon: 'success'
					}, {
						tab: 3
					})
					uni.$emit('upDateHome')
				} else {
					this.isPhoneBox = false
				}

			},
			// #ifdef MP
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					uni.hideLoading();
					that.userInfo = res.data
					that.$store.commit("UPDATE_USERINFO", res.data);
					that.$util.Tips({
						title: '登录成功',
						icon: 'success'
					}, {
						tab: 3
					})
				});
			},
			//绑定手机号
			onUserPhone(type) {
				this.loginConfig = type;
				//如果是其他手机号绑定，调整页面。否则授权本机手机号登录
				if (this.loginConfig === 'isPhone') {
					uni.navigateTo({
						url: `/pages/users/app_login/index?code=${this.wxCode}&authKey=${this.authKey}`
					})
				} else {
					this.isPhoneBox = true
				}
			},
			//wx小程序立即登录
			async getUserProfile() {
				let self = this;
				if(!this.privacyVal) return this.isShowPrivacy = true
				uni.showLoading({
					title: '正在登录中'
				});
				const hostSDKVersion = uni.getSystemInfoSync().hostSDKVersion; //小程序基础库版本号
				if (Routine.compareVersion(hostSDKVersion, '2.21.2') >= 0) {
					const userData = await Routine.getUserProfile()
					console.log(userData)
					const code = await Routine.getCode()
					try {			
						const userInfo = {};
						userInfo.code = code;
						userInfo.spread_spid = app.globalData.spread; //获取推广人ID
						userInfo.avatar = '';
						userInfo.nickName = '微信用户';
						userInfo.type = 'routine'
						self.getWxUser(code, userInfo);
					} catch(e) {
						uni.hideLoading();
					}
				} else {
					Routine.getUserProfile().then(res => {
						Routine.getCode()
							.then(code => {								
								const userInfo = res.userInfo;
								userInfo.code = code;
								userInfo.spread_spid = app.globalData.spread; //获取推广人ID
								userInfo.avatar = userInfo.userInfo.avatarUrl;
								userInfo.city = userInfo.userInfo.city;
								userInfo.country = userInfo.userInfo.country;
								userInfo.nickName = userInfo.userInfo.nickName;
								userInfo.province = userInfo.userInfo.province;
								userInfo.sex = userInfo.userInfo.gender;
								userInfo.type = 'routine'
								self.getWxUser(code, userInfo);
							})
							.catch(res => {
								uni.hideLoading();
							});
					})
					.catch(res => {
						uni.hideLoading();
					});
				}
			},
			// 登录调用方法
			getWxUser(code, userInfo) {
				this.wxCode = code;
				const self = this;
				Routine.authUserInfo(userInfo.code, userInfo)
					.then(res => {
						self.authKey = res.data.key;
						if (res.data.type === 'register') {
							uni.hideLoading();
							self.wxLogin = false;
							this.onUserPhone()
						}
						if (res.data.type === 'login') {
							uni.hideLoading();
							self.$store.commit('LOGIN', {
								token: res.data.token
							});
							self.$store.commit("SETUID", res.data.uid);
							self.getUserInfo();
							self.$store.dispatch("GETADDRESSLIST")
							if (app.globalData.spread) {
								spread(app.globalData.spread).then(res => {}) //登录成功后读取spread绑定分销关系
							}
							self.$util.Tips({
								title: res,
								icon: 'success'
							}, {
								tab: 3
							})
							uni.$emit('upDateHome')
						}
					})
					.catch(res => {
						uni.hideLoading();
						uni.showToast({
							title: res,
							icon: 'none',
							duration: 2000
						});
					});
			},
			// #endif
			// #ifdef H5
			// 获取url后面的参数
			getQueryString(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
				var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
				var r = window.location.search.substr(1).match(reg);
				var q = window.location.pathname.substr(1).match(reg_rewrite);
				if (r != null) {
					return unescape(r[2]);
				} else if (q != null) {
					return unescape(q[2]);
				} else {
					return null;
				}
			},
			// 公众号登录
			wechatLogin() {
				if (!this.code && this.options.scope !== 'snsapi_base') {
					this.$wechat.oAuth('snsapi_userinfo', '/pages/users/wechat_login/index');
				} else {
					// if (this.authKey) {
					// 	this.isUp = true;
					// }
					this.isUp = true;
				}
			},
			// 输入手机号后的回调
			wechatPhone() {
				this.$Cache.clear('snsapiKey');
				if (this.options.back_url) {
					let url = uni.getStorageSync('snRouter');
					url = url.indexOf('/pages/index/index') != -1 ? '/' : url;
					if (url.indexOf('/pages/users/wechat_login/index') !== -1) {
						url = '/';
					}
					if (!url) {
						url = '/pages/index/index';
					}
					this.isUp = false
					uni.showToast({
						title: '登录成功',
						icon: 'none'
					})
					setTimeout(res => {
						location.href = url
					}, 800)
				} else {
					uni.navigateBack()
				}
			}
			// #endif
		}
	}
</script>
<style lang="scss">
	page {
		background: #fff;
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	.icon-weixin2{
		margin-right: 10rpx;
	}
	.company {
		font-size: 32rpx;
		color: #333;
		text-align: center;
		font-weight: 500;
		margin: 36rpx 0 96rpx 0;
	}

	.page {
		background: #fff;
		height: 100%;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.wechat_login {
		padding-top: 94rpx;

		.img .image {
			width: 152rpx;
			height: 152rpx;
		}

		.btn-wrapper {
			margin-top: 86rpx;
			padding: 0 66rpx;
			.item1 {
				background-color: #FF920F;
			}
			button {
				width: 100%;
				height: 82rpx;
				line-height: 80rpx;
				margin-bottom: 32rpx;
				border-radius: 16rpx;
				font-size: 32rpx;
				
				
				&.btn1 {
					color: #fff;				
				}

				&.btn2 {
					color: #FF920F;
					border: 1px solid #FF920F;
				}
			}
		}
	}

	.title-bar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
	}

	.icon {
		position: absolute;
		left: 0rpx;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 86rpx;
		height: 86rpx;
		image {
			width: 50rpx;
			height: 50rpx;
		}
	}

</style>