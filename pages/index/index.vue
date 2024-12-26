<template>
	<view :data-theme="theme">
		<skeleton :show="showSkeleton" :isNodes="isNodes" ref="skeleton" loading="chiaroscuro" selector="skeleton"
			bgcolor="#FFF"></skeleton>
		<!-- 有网内容 -->
		<view v-if="!errorNetwork">
			<view class="page-index skeleton" :class="{'bgf':navIndex >0}"
				:style="{visibility: showSkeleton ? 'hidden' : 'visible'}">	
				<!-- #ifdef H5 -->
				<view class="header">
					<view class="serch-wrapper flex">
						<view class="logo skeleton-rect">
							<image :src="logoUrl" mode=""></image>
						</view>
						<navigator url="/pages/goods/goods_search/index" class="input" hover-class="none"><text
								class="iconfont icon-xiazai5"></text>
							搜索商品</navigator>
					</view>
				</view>
				<!-- #endif --> 
				<!-- #ifdef MP || APP-PLUS -->
				<view class="mp-header">
					<view class="sys-head skeleton-rect" :style="{ height: statusBarHeight }"></view>
					<!-- <image class="header-bg" src="@/static/images/home/header-bg.png"></image> -->
					<view class="relative fjs-p-t-24">
						<view class="switch-shop flex " v-if="isLogin && shopList.length > 0" @click="isSwitchShop = true">
							<view 
								class="u-line-1 fjs-m-r-4"
								:style="{maxWidth: currentShopName.length > 6 ? '200rpx' : 'auto'}"
							>
								{{currentShopName || '请选择门店'}}
							</view>
							<u-icon name="arrow-down-fill" color="#fff" size="12"></u-icon>
						</view>
						<image class="header-logo" src="@/static/images/home/logo.png"></image>
					</view>						
				</view>
				<view class="main-header" :style="{ paddingTop: (marTop) +'px' }">
					<view class="search">
						<view class="flex">
							<navigator url="/pages/users/user_shop/index" class="add-shop-btn flex" v-if="shopList.length === 0">
								<image mode="aspectFill" src="@/static/images/home/add-shop-icon.png"></image>
								<text class="font-bold fjs-font-28 fjs-m-l-8">新增门店</text>
							</navigator>
							<view class="serch-box skeleton-rect" style="flex:1">
								<view class="serch-wrapper flex">
									<navigator url="/pages/goods/goods_search/index" class="input" hover-class="none">
										<text class="iconfont icon-xiazai5"></text>输入商品名称搜索
									</navigator>
								</view>
							</view>
						</view>
						<view class="hot-tag">
							<view class="tag-item" v-for="item in hotSearchList" :key="item.id" @click="toSearch(item.title)">{{item.title}}</view>
						</view>		
					</view>
					<!-- #endif -->	
					<!-- banner -->
					<view class="swiper skeleton-rect" @click.native="bindEdit('indexBanner')">
						<swiper indicator-dots="true" :autoplay="true" :circular="circular" :interval="interval"
							:duration="duration" indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
							<block v-for="(item,index) in imgUrls" :key="index">
								<swiper-item>
									<view @click="menusTap(item.url)">
										<image :src="item.pic" class="slide-image" lazy-load></image>
									</view>
								</swiper-item>
							</block>
						</swiper>
					</view>
				</view>				
				
				<!-- 首页展示 -->
				<view class="page_content skeleton"  v-if="navIndex == 0">
					<!-- <view class="mp-bg"></view> -->
					<view id="pageIndex">			
						<!-- 新闻简报 -->
						<view class='notice acea-row row-middle row-between skeleton-rect'
							@click.native="bindEdit('indexNews')">
							<view class="pic" @click="toNewsList()">
								<image class="pic-icon" src="@/static/images/home/notice-icon.png">
								<text class="font-bold">公告</text>
							</view>
							<text class='line'>|</text>
							<view class='swipers'>
								<swiper :indicator-dots="indicatorDots" :autoplay="autoplay" interval="2500" duration="500"
									vertical="true" circular="true">
									<block v-for="(item,index) in roll" :key='index'>
										<swiper-item @touchmove.stop="stopTouchMove">
											<view class='item' @click="menusTap(item.url)">
												<view class='line1'>{{item.info}}</view>
											</view>
										</swiper-item>
									</block>
								</swiper>
							</view>
							<view class="iconfont icon-xiangyou" @click="toNewsList()"></view>
						</view>
						<!-- menu -->
						<view class='nav acea-row' @click.native="bindEdit('indexMenu')">
							<block v-for="(item,index) in menus" :key="index">
								<view class='item' @click="menusTap(item.url)">
									<view class='pictrue'>
										<image :src='item.pic' class="skeleton-radius"></image>
									</view>
									<view class="menu-txt skeleton-rect">{{item.name}}</view>
								</view>
							</block>
						</view>
					</view>
					<!-- 优惠券 -->
					<!-- <coupons class="skeleton skeleton-rect"></coupons> -->
					<!-- 秒杀-->
					<!-- <seckill class="skeleton skeleton-rect"></seckill> -->
					<!-- 拼团-->
					<!-- <combination class="skeleton skeleton-rect"></combination> -->
					<!-- 砍价-->
					<!-- <bargain class="skeleton-rect"></bargain> -->
					<!-- 排行榜 -->
					<!-- <goods-rank class="skeleton skeleton-rect"></goods-rank> -->
					<!-- 商品列表模板选择性显示 -->
					<promotion :tabData="explosiveMoney" :showType="cardShow" v-if="cardShow !== 1"></promotion>
					<!-- 底部分类 -->
					<view class="sticky-box" :style="'top:'+(marTop)+'px;'" :class="scrollTop > 300 ? 'stick-scroll' : ''" v-if="cardShow == 1">
						<scroll-view class="scroll-view_H" style="width: 100%;" scroll-x="true" scroll-with-animation
							:scroll-left="tabsScrollLeft" @scroll="scroll">
							<view class="tab nav-bd" id="tab_list">
								<view id="tab_item" :class="{ 'active': listActive == index}" class="item skeleton-rect"
									v-for="(item, index) in explosiveMoney" :key="index" @click="ProductNavTab(item,index)">
									<view class="txt">{{item.name}}</view>
									<view class="label">{{item.info}}</view>
								</view>
							</view>
						</scroll-view>
					</view>
			
					<!-- 首发新品 -->
					<view class="index-product-wrapper" :class="iSshowH?'on':''" v-if="cardShow == 1">
						<view class="list-box animated" :class='tempArr.length > 0?"fadeIn on":""'>
							<view class="item" v-for="(item,index) in tempArr" :key="index" @click="goDetail(item)">
								<view class="pictrue " :class="item.activeTag ? 'active-tag' : ''">
								<!-- 	<span class="pictrue_log pictrue_log_class"
										v-if="item.activityH5 && item.activityH5.type === '1'">超低价</span>
									<span class="pictrue_log pictrue_log_class"
										v-if="item.activityH5 && item.activityH5.type === '2'">砍价</span>
									<span class="pictrue_log pictrue_log_class"
										v-if="item.activityH5 && item.activityH5.type === '3'">新品</span> -->
									<image :src="item.image" mode=""></image>
									<view class="active-tag-img" v-if="item.activeTag">
										<image src="@/static/images/home/hot-bg.png"></image>
										<text>{{item.activeTag}}</text>
									</view>
								</view>
								<view class="text-info">
									<viwe class="title-box flex">
										<!-- <view class="tag-item" v-if="item.activityH5 && item.activityH5.type === '1'">超低价</view> 
										<view class="tag-item" v-if="item.activityH5 && item.activityH5.type === '3'">新品</view> -->
										<view class="tag-item" v-if="item.isBenefit">特惠</view>
										<view class="title line1">{{item.storeName}} </view>
									</viwe>
									<view class="unit line1" v-if="item.storeInfo">{{item.storeInfo}}</view>
									<view class="price-box flex">					
										<view class="price" >
											<text >￥</text>
											<view class="suit-price" v-if="item.suitPrice">
												{{item.suitPrice}}
											</view>					
											<view v-else>{{item.priceAfterCoupon ? item.priceAfterCoupon : item.price || '****'}}</view>						
											<view>{{ item.unitName ? `/${item.unitName}` : ''}}</view>		
										</view>	
										<view class="practical-text" v-if="item.priceAfterCoupon">劵后价</view>
										<view class="old-price" v-if="item.otPrice">
											<text class="line-through">¥{{item.otPrice}}</text>
										</view>
									</view>		
									<view class="unit-price" v-if="item.suitPrice">
										{{ `(仅￥${item.suitUnitPrice}/${item.suitUnitName})` }}
									</view>		
								</view>
							</view>
						</view>
						<view class='loadingicon acea-row row-center-wrapper' v-if="goodScroll">
							<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>
						</view>
						<view class="mores-txt flex" v-if="!goodScroll">
							<text>我是有底线的</text>
						</view>
					</view>
				</view>
				<!-- #ifdef MP -->
				<aTip :isCustom="true" :text="wxText" :borderR="5"></aTip>
				<!-- #endif -->
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="privacy-wrapper" v-if="privacyStatus">
				<view class="privacy-box">
					<view class="title">服务协议与隐私政策</view>
					<view class="content">
						尊敬的用户，欢迎您注册成为本应用用户。请您仔细阅读<i
							@click="xieyiApp">《服务协议与隐私政策》</i>了解我们对您使用我们APP制定的规则，您个人信息的处理以及申请权限的目的和使用范围。
						经您确认后，本用户协议和隐私权政策即在您和本应用之间产生法律效力。请您务必在注册之前认真阅读全部服务协议内容，如有任何疑问，可向本应用客服咨询。
						如你同意，请点击“我同意”开始接受我们的服务。
					</view>
					<view class="btn-box">
						<view class="btn-item" @click="confirmApp">我同意</view>
						<view class="btn" @click="closeModel">随便逛逛</view>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>
		<!-- 断网内容 -->
		<view v-else>
			<view class="error-network">
				<image class="img" src="/static/images/error-network.png"></image>
				<view class="title">网络连接断开</view>
				<view class="con">
					<view class="label">请检查情况：</view>
					<view class="item">· 在设置中是否已开启网络权限</view>
					<view class="item">· 当前是否处于弱网环境</view>
					<view class="item">· 版本是否过低，升级试试吧</view>
				</view>
				<view class="btn" @click="reconnect">重新连接</view>
			</view>
		</view>
		<guideLogin></guideLogin>
		<pageFooter ref="pageFooterRef"></pageFooter>
		<u-modal :show="isPhoneList"  title="专属顾问" confirmText="取消" confirmColor="#FF920F"  @confirm="isPhoneList = false">
			<view class="phone-content">
				<view class="phone-list" v-for="item in phoneList" :key="item.supportPhone" @click="makePhoneCall(item.supportPhone)">
					<text>{{item.shopName || ''}} {{item.supportName}}</text>	
					<u-icon name="phone-fill" color="#333" size="20"></u-icon>
				</view>
			</view>
		</u-modal>
		<u-picker 
			:show="isSwitchShop" 
			:columns="[shopList]" 
			@confirm="handelSwitchShop" 
			keyName="shopName"
			@cancel="isSwitchShop = false"
			confirmColor="#FF920F"
			immediateChange
		>
		</u-picker>
	</view>
</template>

<script>
	import Auth from '@/libs/wechat';
	import Cache from '../../utils/cache';

	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	const app = getApp();
	import {
		getIndexData,
		setCouponReceive,
		getTheme,
		getAppVersion,
	} from '@/api/api.js';
	import {
		spread,
		getAddressList,
		supportStaff,
		setAddressDefault
	} from "@/api/user";
	// #ifdef MP-WEIXIN || APP-PLUS
	import {
		getTemlIds
	} from '@/api/api.js';
	// #endif
	// #ifdef H5  
	import {
		follow
	} from '@/api/public.js';
	// #endif
	import {
		getShare
	} from '@/api/public.js';
	import a_seckill from './components/a_seckill';
	import b_combination from './components/b_combination';
	import c_bargain from './components/c_bargain';
	import d_coupons from './components/d_coupons';
	import promotion from './components/promotion';
	//import goodsRank from './components/goodsRank';
	import ClipboardJS from "@/plugin/clipboard/clipboard.js";
	import aTip from '@/components/add-tips/index.vue';
	import pageFooter from '@/components/pageFooter/index.vue'
	import guideLogin from '@/components/guideLogin'
	import {
		goShopDetail
	} from '@/libs/order.js'
	import {
		goPage
	} from '@/libs/iframe.js'
	import {
		mapGetters
	} from "vuex";
	import {
		getCategoryList,
		getProductHot,
		getGroomList,
		getSearchKeyword
	} from '@/api/store.js';
	import {
		silenceBindingSpread,
		getCityList
	} from '@/utils';
	import animationType from '@/utils/animationType.js'
	// #ifndef MP
	import {
		getWechatConfig
	} from "@/api/public";
	// #endif
	import Loading from '@/components/Loading/index.vue';
	const arrTemp = ["beforePay", "afterPay", "createBargain", "pink"];
	export default {
		components: {
			'seckill': a_seckill,
			'combination': b_combination,
			'bargain': c_bargain,
			'coupons': d_coupons,
			//goodsRank,
			promotion,
			Loading,
			aTip,
			pageFooter,
			guideLogin
		},
		data() {
			return {
				errorNetwork: false, //是否有网络
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				loaded: false,
				loading: false,
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				statusBarHeight: statusBarHeight,
				navIndex: 0,
				navTop: [],
				followUrl: "",
				followHid: true,
				followCode: false,
				logoUrl: "",
				imgUrls: [{
					url: '',
					pic: '',
					id: '',
					name: ''
				}],
				menus: [{
					url: '',
					pic: '',
					id: '',
					name: ''
				}, {
					url: '',
					pic: '',
					id: '',
					name: ''
				}, {
					url: '',
					pic: '',
					id: '',
					name: ''
				}, {
					url: '',
					pic: '',
					id: '',
					name: ''
				}, {
					url: '',
					pic: '',
					id: '',
					name: ''
				}, {
					url: '',
					pic: '',
					id: '',
					name: ''
				}, {
					url: '',
					pic: '',
					id: '',
					name: ''
				}, {
					url: '',
					pic: '',
					id: '',
					name: ''
				}, {
					url: '',
					pic: '',
					id: '',
					name: ''
				}, {
					url: '',
					pic: '',
					id: '',
					name: ''
				}, ],
				indicatorDots: false,
				circular: true,
				autoplay: true,
				interval: 2500,
				duration: 500,
				window: false,
				navH: "",
				ProductNavindex: 0,
				marTop: 0,
				sortProduct: [],
				hostProduct: [],
				hotPage: 1,
				hotLimit: 10,
				hotScroll: false,
				explosiveMoney: [{
					title: ''
				}, {
					title: ''
				}, {
					title: ''
				}, {
					title: ''
				}], //首页超值爆款
				searchH: 0,
				goodType: 0, //精品推荐Type
				goodScroll: true, //精品推荐开关
				params: { //精品推荐分页
					page: 1,
					limit: 10,
				},
				tempArr: [], //精品推荐临时数组
				roll: [], // 新闻简报
				site_name: '', //首页title
				iSshowH: false,
				configApi: {}, //分享类容配置
				privacyStatus: false, // 隐私政策是否同意过
				tabsScrollLeft: 0, // tabs当前偏移量
				scrollLeft: 0,
				listActive: 0, // 当前选中项
				// duration: 2 // 下划线动画时长
				imgHost: '',
				picBg: 'crmebimage/perset/new_header/new_header1.png',
				appUpdate: {},
				wxText: "点击添加到我的小程序，微信首页下拉即可访问商城。",
				cardShow: 1, //首页商品列表模板配置，1 精品推荐 2 热门榜单 3首发新品 4促销单品
				locationStatus: false,
				hotSearchList: [],
				scrollTop: 0,
				title: '手机号码列表',
				isPhoneList: false,
				phoneList: [],
				isGetGroomList: false,
				mediaQueryOb: null,
				matches: false,
				isSwitchShop: false,
				menuButtonHeight: null,
				pageFooterRef: null
			}
		},
		watch: {
			ProductNavindex(newVal) { // 监听当前选中项
				this.setTabList()
			},
			listActive(newVal) { // 监听当前选中项
				this.setTabList()
			},
			isLogin(newVal) {			
				if(newVal) {
					this.$store.dispatch("GETADDRESSLIST")
				}
			}
		},
		computed: {
			...mapGetters(['isLogin','uid','shopList','currentShopName','theme','bottomNavigationIsCustom'])
		},
		onLaunch: function() {
			//this.isNodes++;
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		onLoad(options) {
			// #ifdef APP-PLUS
			//app刚进入检测有无网络
			this.snycNetWork();
			this.appVersionConfig(); //APP版本检测
			// #endif
			this.getRoutineHotSearch()
			if (app.globalData.isIframe) {
				setTimeout(() => {
					let active;
					document.getElementById('pageIndex').children.forEach(dom => {
						dom.addEventListener('click', (e) => {
							e.stopPropagation();
							e.preventDefault();
							if (dom === active) return;
							dom.classList.add('borderShow');
							active && active.classList.remove('borderShow');
							active = dom;
						})
					})
				});
			}
			setTimeout(() => {
				this.isNodes++;
			}, 100);
			var that = this;

			// 获取系统信息
			uni.getSystemInfo({
				success(res) {
					that.$store.commit("SYSTEM_PLATFORM", res.platform);
				}
			});

			
			this.setTabList()
			let self = this
			//根据换色配置动态获取‘新闻简报’图片
			this.getThemeApi()
			// #ifdef MP
			// 获取小程序头部高度
			this.navH = app.globalData.navHeight;
			const menuButton = uni.getMenuButtonBoundingClientRect()

			this.menuButtonHeight = menuButton.height
			let info = uni.createSelectorQuery().select(".mp-header");
			info.boundingClientRect(function(data) {
				self.marTop = data.height;
				//self.poTop = Number(data.height) + 84
			}).exec()
			// 监听屏幕宽度在320到375之间的变化
			
			/* this.testMediaQueryObserver() */
			if (options.scene) { // 仅仅小程序扫码进入
				let qrCodeValue = this.$util.getUrlParams(decodeURIComponent(options.scene));
				let mapeMpQrCodeValue = this.$util.formatMpQrCodeData(qrCodeValue);
				app.globalData.spread = mapeMpQrCodeValue.spread;
			}
			if (options.spread) app.globalData.spread = options.spread; //非小程序扫码进入情况下，直接获取url中的分销员id保存在globalDta中
			// #endif
			// #ifndef MP || APP-PLUS
			this.navH = 0;
			// #endif
			this.getIndexConfig();
			// #ifdef MP || APP-PLUS
			this.getTemlIds()
			// #endif
			if (this.isLogin) {
				parseInt(app.globalData.spread) > 0 && silenceBindingSpread()
				this.$store.dispatch("GETADDRESSLIST")
			}			
			
		},
		onShow() {	
			let self = this;
			if (!self.$Cache.getItem('cityList')) getCityList()
			// #ifdef APP-PLUS
			let barHeight = uni.getSystemInfoSync().statusBarHeight;
			self.marTop = barHeight + menuButton.height; //刘海屏
			setTimeout(() => {
				if (self.appUpdate.openUpgrade == 'true') {
					self.appVersionConfig();
				}
			}, 1000)
			// #endif
			supportStaff().then(data => {
				this.phoneList = data.data
			})
			uni.$off("upDateHome")
			uni.$on("upDateHome",() => {
				this.params.page = 1
				this.tempArr = []			
				this.goodScroll = true
				this.getIndexConfig()
				this.getThemeApi()
				this.isSwitchShop = false
				this.$refs.pageFooterRef.getInit()
			})
			if(this.bottomNavigationIsCustom) {
				uni.hideTabBar()
			}
		},
		methods: {
			/* testMediaQueryObserver(){
				this.mediaQueryOb = uni.createMediaQueryObserver(this)
				
				this.mediaQueryOb.observe({
					minWidth: 320,  //页面最小宽度 320px
					maxWidth: 385  //页面宽度最大 385px
				}, matches => {
					this.matches = matches.matches;
				})
			}, */
			async getThemeApi(){
				const {data:{value}} = await getTheme()
				try{
					app.globalData.theme = `theme${Number(value)}`
					this.picBg = `crmebimage/perset/new_header/new_header${Number(value)}.png`;
					this.$store.commit('SET_THEME',`theme${Number(value)}`)
				} catch(e) {
					console.log(e)
				}		
			},
			getRoutineHotSearch() {			
				getSearchKeyword().then(res => {
					this.hotSearchList = res.data;	
				});
			},
			toSearch(keyword){
				uni.navigateTo({
					url: '/pages/goods/goods_search/index?keyword=' + keyword,
				})
			},
			makePhoneCall(phone) {
				uni.makePhoneCall({
					phoneNumber: phone
				})
			},
			menusTap(url) {
				goPage().then(res => {
					if (url == '/pages/goods_cate/goods_cate') {
						return uni.switchTab({
							url: url
						})
					} 
					if(url === '/pages/recommend/ranking') {
						if(!this.isLogin) return this.$u.toast('完善门店信息后可查看军师情报数据')
						if(this.isLogin && !this.shopList.some(item => item.status === 1)) return this.$u.toast('完善门店信息后可查看军师情报数据')			
					}
					if(url === '敬请期待') {
						return this.$u.toast('敬请期待!')
					}
					if(this.$util.isNumberNotNaN(url)) {
						return this.isPhoneList = true
					}			
					uni.navigateTo({
						animationType: animationType.type,
						animationDuration: animationType.duration,
						url: url
					})			
				})
			},
			toNewsList() {
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: '/pages/news/news_list/index'
				})
			},
			bindEdit(name) {
				if (app.globalData.isIframe) {
					window.parent.postMessage({
							name: name
						},
						'*'
					);
					return;
				}
			},
			reloadData() {
				this.showSkeleton = false
			},
			// scroll-view滑动事件
			scroll(e) {
				this.scrollLeft = e.detail.scrollLeft;
			},
			setTabList() {
				this.$nextTick(() => {
					this.scrollIntoView()
				})
			},
			// 计算tabs位置
			scrollIntoView() { // item滚动
				let lineLeft = 0;
				this.getElementData('#tab_list', (data) => {
					let list = data[0]
					this.getElementData(`#tab_item`, (data) => {
						let el = data[this.listActive]
						lineLeft = el.width / 2 + (-list.left) + el.left - list.width / 2 - this.scrollLeft
						this.tabsScrollLeft = this.scrollLeft + lineLeft
					})
				})
			},
			getElementData(el, callback) {
				uni.createSelectorQuery().in(this).selectAll(el).boundingClientRect().exec((data) => {
					callback(data[0]);
				});
			},
			xieyiApp() {
				uni.navigateTo({
					url: '/pages/users/web_page/index?webUel=https://admin.java.crmeb.net/useragreement/xieyi.html&title=协议内容'
				})
			},
			// #ifdef APP-PLUS
			xieyiApp() {
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url: '/pages/users/web_page/index?webUel=https://admin.java.crmeb.net/useragreement/xieyi.html&title=协议内容'
				})
			},
			// 同意隐私协议
			confirmApp() {
				uni.setStorageSync('privacyStatus', true)
				this.privacyStatus = false
			},
			// 关闭Model
			closeModel() {
				this.privacyStatus = false
			},
			// #endif
			// #ifdef MP || APP-PLUS
			getTemlIds() {
				for (var i in arrTemp) {
					this.getTem(arrTemp[i]);
				}
			},
			getTem(data) {
				getTemlIds({
					type: data
				}).then(res => {
					if (res.data) {
						let arr = res.data.map((item) => {
							return item.tempId
						})
						wx.setStorageSync('tempID' + data, arr);
					}
				});
			},
			// #endif
			// 关闭优惠券弹窗
			onColse() {
				this.$set(this, "window", false);
			},
			/**
			 * 获取我的推荐
			 */
			get_host_product: function() {
				let that = this;
				that.loading = true;

				if (that.hotScroll) return
				getProductHot(
					that.hotPage,
					that.hotLimit,
				).then(res => {
					that.hotPage++
					that.hotScroll = res.data.list.length < that.hotLimit
					that.hostProduct = that.hostProduct.concat(res.data.list)
				});
			},

			// 首页数据
			getIndexConfig: function() {
				let that = this;
				//this.isNodes++;
				getIndexData().then(res => {
					that.$set(that, "logoUrl", res.data.logoUrl);
					let imgHost = res.data.logoUrl.split('crmebimage')[0];
					that.imgHost = imgHost;
					that.$Cache.set('imgHost', imgHost);
					that.$set(that, "imgUrls", res.data.banner);
					that.$set(that, "menus", res.data.menus);
					that.$set(that, "roll", res.data.roll ? res.data.roll : []);
					that.$set(that, 'cardShow', res.data.homePageSaleListStyle == '' ? 1 : Number(res.data
						.homePageSaleListStyle)); //首页商品列表模板获取配置
					// 保存商品分类页配置
					that.$Cache.setItem({
						name: 'categoryConfig',
						value: {
							categoryConfig: res.data.categoryPageConfig,
							isShowCategory: res.data.isShowCategory
						}
					});
					// #ifdef H5 || APP-PLUS
					that.$store.commit("SET_CHATURL", res.data.yzfUrl);
					Cache.set('chatUrl', res.data.yzfUrl);
					// #endif
					Cache.setItem({
						name: 'chatConfig',
						value: {
							consumer_hotline: res.data.consumerHotline,
							telephone_service_switch: res.data.telephoneServiceSwitch
						}
					});
					that.$set(that, "explosiveMoney", res.data.explosiveMoney);
					that.goodType = res.data.explosiveMoney[0].type
					this.getGroomList();
					this.shareApi();
					this.reloadData();
					// #ifdef MP
					if (!Cache.has('user_latitude')) {
						this.locationStatus = true;
					}
					// #endif
					this.isGetGroomList = true
				});
			},
			appVersionConfig() {
				var that = this;
				//app升级
				// 获取本地应用资源版本号  
				getAppVersion().then(res => {
					that.$set(that.appUpdate, 'androidAddress', res.data.androidAddress);
					that.$set(that.appUpdate, 'appVersion', res.data.appVersion);
					that.$set(that.appUpdate, 'iosAddress', res.data.iosAddress);
					that.$set(that.appUpdate, 'openUpgrade', res.data.openUpgrade);
					plus.runtime.getProperty(plus.runtime.appid, function(inf) {
						let nowVersion = (inf.version).split('.').join('');
						let appVersion = (res.data.appVersion).split('.').join('');
						uni.getSystemInfo({
							success: (res) => {
								if (appVersion > nowVersion) {
									uni.showModal({
										title: '更新提示',
										content: '发现新版本，是否前去下载?',
										showCancel: that.appUpdate.openUpgrade ==
											'false' ? true : false,
										cancelColor: '#eeeeee',
										confirmColor: '#FF0000',
										success(response) {
											if (response.confirm) {
												switch (res.platform) {
													case "android":
														plus.runtime.openURL(that
															.appUpdate
															.androidAddress);
														break;
													case "ios":
														plus.runtime.openURL(encodeURI(
															that.appUpdate
															.iosAddress));
														break;
												}

											}
										}
									});
								}
							}
						})
					});
				})
			},
			shareApi: function() {
				getShare().then(res => {
					this.$set(this, 'configApi', res.data);
					this.$set(this, "site_name", res.data.title);
					uni.setNavigationBarTitle({
						title: this.site_name
					})
					// #ifdef H5
					this.setOpenShare(res.data);
					// #endif
				})
			},
			// 微信分享；
			setOpenShare: function(data) {
				let that = this;
				if (that.$wechat.isWeixin()) {
					let configAppMessage = {
						desc: data.synopsis,
						title: data.title,
						link: location.href,
						imgUrl: data.img
					};
					that.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"],
						configAppMessage);
				}
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			// 首发新品切换
			ProductNavTab(item, index) {
				if (this.listActive !== index) {
					this.listActive = index
					this.goodType = item.type
					this.listActive = index
					this.ProductNavindex = index
					this.tempArr = []
					this.params.page = 1
					this.goodScroll = true
					let onloadH = true
					this.getGroomList(onloadH)
				}
			},
			// 首发新品详情
			goDetail(item) {
				if (item.activityH5 && item.activityH5.type === "2" && !this.isLogin) {
					toLogin();
				} else {
					goShopDetail(item, this.uid).then(res => {
						uni.navigateTo({
							animationType: animationType.type,
							animationDuration: animationType.duration,
							url: `/pages/goods/goods_details/index?id=${item.id}`
						})
					})
				}
			},
			// 精品推荐
			getGroomList(onloadH) {
				this.loading = true
				let type = this.goodType;
				if (!this.goodScroll) return
				if (onloadH) {
					this.iSshowH = true
				}
				getGroomList(type, this.params).then(({
					data
				}) => {
					this.iSshowH = false
					this.loading = false
					this.goodScroll = data.list.length >= this.params.limit
					this.tempArr = this.params.page === 1 ? data.list : this.tempArr.concat(data.list)
					this.params.page++		
				})
			},
			//切换门店
			async handelSwitchShop({value}) {	
				try{
					await setAddressDefault(value[0].id)
					this.$store.commit('SET_SHOP_NAME', value[0].shopName)
					uni.$emit('updateCate')
					uni.showToast({
						icon:'success',
						title: '切换成功'
					})
					this.params.page = 1
					this.tempArr = []			
					this.goodScroll = true
					this.getIndexConfig()
					this.getThemeApi()
					this.isSwitchShop = false
					this.$refs.pageFooterRef.getInit()
				} catch(e){
					//TODO handle the exception
				}		
			},
			stopTouchMove() {
				return true //禁止新闻swiper手动滑动
			},
			modelCancel() {
				this.locationStatus = false;
			},
			confirmModel() {
				uni.getLocation({
					type: 'gcj02',
					altitude: true,
					geocode: true,
					success: function(res) {
						try {
							uni.setStorageSync('user_latitude', res.latitude);
							uni.setStorageSync('user_longitude', res.longitude);
						} catch {}
					}
				});
				this.locationStatus = false;
			},
			//app刚进入检测有无网络
			snycNetWork() {
				uni.getNetworkType({
					success: res => {
						//res.networkType === 'none'无网络
						this.errorNetwork = res.networkType == 'none';
						//如果没有网络，清除骨架屏
						if(this.errorNetwork) this.reloadData();
					}
				});
			},
			// 断网后重新链接
			reconnect() {
				uni.getNetworkType({
					success: res => {
						this.errorNetwork = res.networkType == 'none';
						if (!this.errorNetwork) {
							setTimeout(() => {
								uni.reLaunch({
									url: "/pages/index/index"
								});
							}, 1000)
						}
					}
				});
			}
		},
		mounted() {
			let self = this;
			// #ifdef H5 || APP-PLUS
			// 获取H5 搜索框高度
			let appSearchH = uni.createSelectorQuery().select(".serch-wrapper");
			appSearchH.boundingClientRect(function(data) {
				self.searchH = data.height
			}).exec()
			// #endif
		},
		/**
		 * 用户点击右上角分享
		 */
		// #ifdef MP
		onShareAppMessage: function() {
			return {
				title: this.configApi.title,
				imageUrl: this.configApi.img,
				desc: this.configApi.synopsis,
				path: '/pages/index/index'
			};
		},
		// #endif
		// 滚动到底部
		onReachBottom() {
			if (this.navIndex == 0) {
				// 首页加载更多
				if (this.params.page != 1) {
					this.getGroomList();
				}
			} else {
				// 分类栏目加载更多
				if (this.sortProduct.length > 0) {
					//this.get_product_list();
				} else {
					this.get_host_product();
				}
			}
		},
	}
</script>
<style>
	page {
		height: auto;
		display: flex;
		flex-direction: column;
		height: 100%;
		/* #ifdef H5 */
		background-color: #fff;
		/* #endif */

	}
</style>
<style lang="scss" scoped>
	.notice {
		width: 100%;
		height: 70rpx;
		border-radius: 10rpx;
		margin: 20rpx 0 0;
		line-height: 70rpx;
		padding: 0 34rpx;
		background-color: #fff;
		
		.line {
			color: #FF920F;
		}

		.pic {
			background-size: 100%;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			color: #333;
			
			// @include index_new_img(theme);
			.pic-icon {
				width: 24rpx;
				height: 24rpx;
				margin-right: 10rpx;
			}
		}
		
		.swipers {
			height: 100%;
			width: 444rpx;
			overflow: hidden;

			swiper {
				height: 100%;
				width: 100%;
				overflow: hidden;
				font-size: 24rpx;
				color: #333333;
			}
		}

		.iconfont {
			color: #999999;
			font-size: 20rpx;
		}
	}
	/deep/ .u-modal__content {
		padding-bottom: 10rpx !important;
	}
	.phone-content {
		width: 100%;
		.phone-list {
			text-align: center;
			border-top: 2rpx solid #eee;
			padding: 20rpx 0;
			line-height: 41rpx;
			display: flex;
			align-content: center;
			text {
				margin-right: 20rpx;
			}
		}
	}

	.sticky-box {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		position: -webkit-sticky;
		/* #endif */
		position: sticky;
		/* #ifdef H5*/
		top: var(--window-top);
		/* #endif */

		z-index: 99;
		flex-direction: row;
		margin: 0px;
		//background: #f5f5f5;
		padding-bottom: 30rpx;
		/* #ifdef MP || APP-PLUS*/
		//top: 110rpx;
		/* #endif */
		&.stick-scroll {
			background-color: #fff;
			padding: 30rpx;
			margin: 0 -30rpx;
			box-shadow:  0 8rpx 13rpx rgba(51,51,51,0.2)
		}
		
	}

	.tab {
		position: relative;
		display: flex;
		font-size: 28rpx;
		white-space: nowrap;

		&__item {
			flex: 1;
			padding: 0 20rpx;
			text-align: center;
			height: 60rpx;
			line-height: 60rpx;
			color: #666;

			&.active {
				color: #09C2C9;
			}
		}
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.privacy-wrapper {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: #7F7F7F;

		.privacy-box {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 560rpx;
			padding: 50rpx 45rpx 0;
			background: #fff;
			border-radius: 20rpx;

			.title {
				text-align: center;
				font-size: 32rpx;
				text-align: center;
				color: #333;
				font-weight: 700;
			}

			.content {
				margin-top: 20rpx;
				line-height: 1.5;
				font-size: 26rpx;
				color: #666;
				text-indent: 54rpx;

				i {
					font-style: normal;
					color: $theme-color;
				}
			}

			.btn-box {
				margin-top: 40rpx;
				text-align: center;
				font-size: 30rpx;

				.btn-item {
					height: 82rpx;
					line-height: 82rpx;
					background: linear-gradient(90deg, #F67A38 0%, #F11B09 100%);
					color: #fff;
					border-radius: 41rpx;
				}

				.btn {
					padding: 30rpx 0;
				}
			}
		}
	}

	.page-index {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		//background: linear-gradient(180deg, #fff 0%, #f5f5f5 100%);
		
		.mp-header {
			position: fixed;
			top:0;
			left: 0;
			width: 100%;
			padding: 0 30rpx 26rpx;
			z-index: 999;
			//background-color: #FE5C2D;
			@include main_bg_color(theme);
			//background: -webkit-linear-gradient(270deg, #FE5C2D 0%);
			
			// .header-bg {
			// 	position: absolute;
			// 	top: 0rpx;
			// 	left: 0;
			// 	display: block;
			// 	width: 100%;
			// 	z-index: 0;
			// }

			.switch-shop {
				color: #fff;
				align-items: baseline;
				font-size: 28rpx;
				position: absolute;
				left: 30rpx;		
				// .current-shop-name {
				// 	width: 146rpx;
				// }
			}
			.header-logo {
				width: 114rpx;
				height: 38rpx;
				display: block;
				margin: 0 auto;
			}
			
		
		}
		
		.main-header {
			//background: -webkit-linear-gradient(270deg, #C60203 40%, #F5F5F5 100%);
			@include index-gradient(theme);
			padding-left: 30rpx;
			padding-right: 30rpx;
			.add-shop-btn {
				background-color: #fff;
				border-radius: 32rpx;
				align-items: center;
				font-size: 28rpx;
				padding: 8rpx 28rpx;
				color: #FE5C2D;
				margin-right: 18rpx;
				image {
					width: 24rpx;
					height: 24rpx;
					display: block;
				}
			}
			.serch-wrapper {
				align-items: center;
				
				.input {
					display: flex;
					align-items: center;
					/* #ifdef MP */
					width: 100%;
					/* #endif */
					/* #ifdef APP-PLUS */
					flex: 1;
					/* #endif */
					height: 56rpx;
					padding: 0 0 0 40rpx;
					background: rgba(247, 247, 247, 1);
					border: 1px solid rgba(241, 241, 241, 1);
					border-radius: 29rpx;
					color: #BBBBBB;
					font-size: 28rpx;
			
					.iconfont {
						margin-right: 20rpx;
					}
				}
			}
			
			.hot-tag {
				margin-top: 12rpx;
				margin-bottom: 20rpx;
				.tag-item {
					margin-right: 20rpx;
					background: rgba(255,255,255,0.2);
					border-radius: 58rpx;
					display: inline-block;
					padding: 4rpx 18rpx;
					color: #fff;
				}
			}
			.hot-tag,.serch-box,.skeleton-rect{
				position: relative;
				z-index: 1; 
			}	
			.swiper {
				position: relative;
				width: 100%;
				height: 320rpx;
				margin: 0 auto;
				border-radius: 10rpx;
				overflow: hidden;
				z-index: 10;
				margin-top: 20rpx;
			
				swiper,
				.swiper-item,
				image {
					width: 100%;
					height: 320rpx;
					border-radius: 10rpx;
				}
			}
		}
			
		
		.page_content {
			background-color: #f5f5f5;
			/* #ifdef H5 */
			// margin-top: 20rpx !important;
			/* #endif */
			padding: 0 30rpx;

		

			.nav {
				padding-bottom: 40rpx;
				opacity: 1;
				border-radius: 14rpx;
				width: 100%;
				align-items: center;
				font-size: 24rpx;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 25%;
					margin-top: 30rpx;

					image {
						width: 100rpx;
						height: 100rpx;
					}
				}
			}

			.nav-bd {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.txt {
						font-size: 36rpx;
						color: #333;
						font-weight: 600;
						letter-spacing: 1px;
					}

					.label {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 124rpx;
						height: 32rpx;
						margin-top: 9rpx;
						padding: 0 6rpx;
						font-size: 24rpx;
						color: #999;
					}

					&.active {
						//color: $theme-color;
						//color: #C60203;
						//color: #FF920F;
									
						.txt {
							@include main-color(theme);
							//color: #C60203;
							//color: #FF920F;
						}

						.label {
							//background: linear-gradient(90deg, $bg-star 0%, $bg-end 100%);
							//@include linear-gradient(theme);
							@include main_bg_color(theme);
							//background: #C60203;
							border-radius: 16rpx;
							color: #fff;
						}
					}
				}
			}

			.index-product-wrapper {
				margin-bottom: 110rpx;

				&.on {
					min-height: 1500rpx;
				}

				.list-box {
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;

					.item {
						width: 335rpx;
						margin-bottom: 20rpx;
						background-color: #fff;
						border-radius: 10rpx;
						// overflow: hidden;

						image {
							width: 100%;
							height: 330rpx;
							display: block;
							border-radius: 16rpx 16rpx 0 0;
						}
						.active-tag {
							position: relative;
							&::before {
								position: absolute;
								width: calc(100% - 9rpx);
								height: calc(100% - 9rpx);
								@include border_color(them);
								border: 6rpx solid;
								border-radius: 18rpx 18rpx 0 0;
								content: "";
								display: block;
								z-index: 2;
							}		
							.active-tag-img {
								width: 192rpx;
								position: absolute;
								top: -6rpx;
								left: 50%;
								transform: translateX(-50%);
								color: #fff;
								font-size: 20rpx;
								font-weight: 500;
								z-index: 3;
								image {
									width: 100%;
									height: 46rpx;
								}
								text {
									position: absolute;
									top: 50%;
									left: 50%;
									transform: translate(-34%, -50%);
								}
							}
						}
						.text-info {
							padding: 10rpx 20rpx 15rpx;
							
							.title-box {
								flex: 1;
								.tag-item{
									border-radius: 8rpx;
									padding: 8rpx;
									font-size: 20rpx;
									color: #fff;							
									margin-right: 10rpx;
															
									&:nth-child(1) {
										background-color: #CE3835;
									}
									&:nth-child(2) {
										background-color: #FF920F;
									}
								}		
								.title {
									color: #333;
									flex: 1;
									font-weight: 500;
									font-style: normal;
									font-size: 28rpx;
								}
							}	
							
							.unit {
								margin-top: 8rpx;
								color: #666;
							}

							.old-price {
								font-size: 26rpx;
								color: #AAAAAA;
							
								text {
									margin-right: 2px;
									font-size: 20rpx;
								}
							}
							
							.price-box{
								margin-top: 20rpx;
								align-items: center;
								.price {
									display: flex;
									align-items: flex-end;
									@include price-color(theme);
									font-size: 28rpx;
									font-weight: 800;
									margin-top: 0;
									margin-right: 8rpx;

									text {
										padding-bottom: 4rpx;
										font-size: 24rpx;
										font-weight: 800;
									}

									.txt {
										display: flex;
										align-items: center;
										justify-content: center;
										width: 28rpx;
										height: 28rpx;
										margin-left: 15rpx;
										margin-bottom: 10rpx;
										border: 1px solid $theme-color;
										border-radius: 4rpx;
										font-size: 22rpx;
										font-weight: normal;
									}
								}
							}
							.practical-text {
								font-size: 22rpx;
								margin-right: 10rpx;
								@include price-color(theme);
							}
							.unit-price {
								font-size: 24rpx;
								@include price-color(theme);
							}
						}
					}

					&.on {
						display: flex;
					}
				}
			}
		}
	}

	.pictrue {
		position: relative;
	}


	.fixed {
		z-index: 100;
		position: fixed;
		left: 0;
		top: 0;
		background: linear-gradient(90deg, red 50%, #ff5400 100%);

	}

	.mores-txt {
		width: 100%;
		align-items: center;
		justify-content: center;
		height: 70rpx;
		color: #999;
		font-size: 24rpx;

		.iconfont {
			margin-top: 2rpx;
			font-size: 20rpx;
		}
	}

	.menu-txt {
		font-size: 24rpx;
		color: #454545;
		margin-top: 16prx;
	}

	.mp-bg {
		position: absolute;
		left: 0;
		/* #ifdef H5 */
		top: 98rpx;
		/* #endif */
		width: 100%;
		height: 344rpx;
		@include index-gradient(theme);
	}
	.error-network {
		position: fixed;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-top: 40rpx;
		background: #fff;
		padding-top: 30%;
	
		.img {
			width: 414rpx;
			height: 336rpx;
		}
	
		.title {
			position: relative;
			top: -40rpx;
			font-size: 32rpx;
			color: #666;
		}
	
		.con {
			font-size: 24rpx;
			color: #999;
	
			.label {
				margin-bottom: 20rpx;
			}
	
			.item {
				margin-bottom: 20rpx;
			}
		}
	
		.btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 508rpx;
			height: 86rpx;
			margin-top: 100rpx;
			border: 1px solid #d74432;
			color: #e93323;
			font-size: 30rpx;
			border-radius: 120rpx;
		}
	}
	 
</style>