<template>
	<view :data-theme="theme">
		<!-- #ifndef APP-PLUS-->
		<view v-if="productType==='video'" class='cart_nav'>
			<nav-bar :navTitle='navTitle' @getNavH='getNavH'></nav-bar>
		</view>
		<!-- #endif -->
		<view class='order-submission' :style="'margin-top:'+(marTop)+'rpx;'">
			<view class="allAddress" :style="store_self_mention ? '':'padding-top:0;'">
				<view class="nav acea-row">
					<view class="item font_color" :class="shippingType == 0 ? 'on' : 'on2'" 
						v-if='store_self_mention'></view>
					<!-- <view class="item font_color" :class="shippingType == 1 ? 'on' : 'on2'" @tap="addressType(1)"
						v-if='store_self_mention'></view> -->
				</view>
				<view class='address acea-row row-between-wrapper' v-if='shippingType == 0'
					:style="store_self_mention ? '':'border-top-left-radius: 14rpx;border-top-right-radius: 14rpx;'">
					<view class='addressCon' v-if="addressInfo.realName">
						<view class='name'>{{addressInfo.realName}}
							<text class='phone'>{{addressInfo.phone}}</text>
						</view>
						<view class="acea-row">
							<text class='default font_color' v-if="addressInfo.isDefault">[默认]</text>
							<text
								class="line2">{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}{{addressInfo.detail}}</text>
						</view>
					</view>
					<view class='addressCon' v-else>
						<view class='setaddress'>设置收货地址</view>
					</view>
					<!-- <view class='iconfont icon-jiantou'></view> -->
				</view>
				<view class='address acea-row row-between-wrapper' v-else @tap="showStoreList">
					<block v-if="storeList.length>0">
						<view class='addressCon'>
							<view class='name'>{{system_store.name}}
								<text class='phone'>{{system_store.phone}}</text>
							</view>
							<view class="line1"> {{system_store.address}}{{", " + system_store.detailedAddress}}
							</view>
						</view>
						<view class='iconfont icon-jiantou'></view>
						<u-alert :title="title" type = "error" ></u-alert>
					</block>
					<block v-else>
						<view>暂无门店信息</view>
					</block>
				</view>
				<view class='line'>
					<image :src="urlDomain+'crmebimage/perset/staticImg/line.jpg'"></image>
				</view>
			</view>
			<view class="pad30">
				<orderGoods :cartInfo="cartInfo" :orderProNum="orderProNum"></orderGoods>
				<view class='wrapper borRadius14'>
					<view class='item acea-row row-between-wrapper' @tap='couponTap'
						v-if="!orderInfoVo.bargainId && !orderInfoVo.combinationId && !orderInfoVo.seckillId">
						<view>优惠券</view>
						<view class='discount'>
							{{couponTitle}}
							<text class='iconfont icon-jiantou'></text>
						</view>
					</view>
					<view v-if="giftData.storeFullInfoResList.length > 0" class="item acea-row  row-between-wrapper" @click="giftVisiable = true">
						<view>{{giftData.activityType === 1 ? '赠品' : '满购'}}</view>
						<view class='discount'>
							{{giftTitle}}
							<text class='iconfont icon-jiantou'></text>
						</view>
					</view>

					<!-- <view class='item acea-row row-between-wrapper'
						v-if="!orderInfoVo.bargainId && !orderInfoVo.combinationId && !orderInfoVo.seckillId && productType==='normal'">
						<view>积分抵扣</view>
						<view class='discount acea-row row-middle'>
							<view> {{useIntegral ? "剩余积分":"当前积分"}}
								<text
									class='num font_color'>{{useIntegral ? orderInfoVo.surplusIntegral : orderInfoVo.userIntegral || 0}}</text>
							</view>
							<checkbox-group @change="ChangeIntegral">
								<checkbox :checked='useIntegral ? true : false'
									:disabled="orderInfoVo.userIntegral==0 && !useIntegral" />
							</checkbox-group>
						</view>
					</view> -->
					<!-- <view class='item acea-row row-between-wrapper'
						v-if="priceGroup.vipPrice > 0 && userInfo.vip && !pinkId && !BargainId && !combinationId && !seckillId">
						<view>会员优惠</view>
						<view class='discount'>-￥{{priceGroup.vipPrice}}</view>
					</view> -->
					<view class='item acea-row row-between-wrapper' v-if='shippingType==0'>
						<view>快递费用</view>
						<view class='discount' v-if='parseFloat(orderInfoVo.freightFee) > 0'>
							+￥{{orderInfoVo.freightFee}}
						</view>
						<view class='discount' v-else>免运费</view>
					</view>
					<view v-else>
						<view class="item acea-row row-between-wrapper">
							<view>联系人</view>
							<view class="discount textR">
								<input type="text" placeholder="请填写您的联系姓名" placeholder-style="color:#ccc;"
									placeholder-class="placeholder" @blur='realName' maxlength="20"></input>
							</view>
						</view>
						<view class="item acea-row row-between-wrapper">
							<view>联系电话</view>
							<view class="discount textR">
								<input type="number" placeholder="请填写您的联系电话" placeholder-style="color:#ccc;"
									placeholder-class="placeholder" @blur='phone' maxlength="11"></input>
							</view>
						</view>
					</view>
					<!-- <view class='item acea-row row-between-wrapper' wx:else>
					  <view>自提门店</view>
					  <view class='discount'>{{system_store.name}}</view>
					</view> -->
					<view class='item' v-if="textareaStatus">
						<view class="flex justify-between">
							<view>备注信息</view>
							<view>
								<text style="color:#666;">{{markNum ? markNum : 150}}</text>/<text>150</text>
							</view>
						</view>
						<textarea v-if="coupon.coupon===false" placeholder-class='placeholder' @input='bindHideKeyboard'
							value="" name="mark" placeholder='请添加备注（150字以内）'></textarea>
					</view>
				</view>
				<view class='wrapper borRadius14'>
					<view class='item'>
						<view>支付方式</view>
						<view class='list'>
							<view class='payItem acea-row row-middle' :class='active==index ?"on":""'
								@tap='payItem(index)' v-for="(item,index) in cartArr" :key='index'
								v-if="item.payStatus==1">
								<view class='name acea-row row-center-wrapper'>
									<view class='iconfont animated'
										:class='(item.icon) + " " + (animated==true&&active==index ?"bounceIn":"")'>
									</view>
									{{item.name}}
								</view>
								<view class='tip'>{{item.title}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class='moneyList borRadius14'>
					<view class='item acea-row row-between-wrapper'>
						<view>商品总价：</view>
						<view class='money'>￥{{orderInfoVo.proTotalFee || 0}}</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="orderInfoVo.couponFee > 0">
						<view>优惠券抵扣：</view>
						<view class='money'>-￥{{orderInfoVo.couponFee}}</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="orderInfoVo.deductionPrice > 0">
						<view>积分抵扣：</view>
						<view class='money'>-￥{{orderInfoVo.deductionPrice}}</view>
					</view>
					<view class='item acea-row row-between-wrapper' v-if="orderInfoVo.freightFee > 0">
						<view>运费：</view>
						<view class='money'>+￥{{orderInfoVo.freightFee}}</view>
					</view>
				</view>
				<view style='height:220rpx;'></view>
			</view>
			<view class="alert-tips" :style="{bottom:alertTipsBottom + 'px'}">
				<u-alert :title="title" type="error" ></u-alert>
			</view>
			<view class='footer acea-row  row-between-wrapper'>
				<view>
					<view>合计:<text class='price_color'>￥{{orderInfoVo.payFee || 0}}</text></view>
					<view class="mixture-price" v-show="payType  === 'union_weixin' && Number(orderInfoVo.userBalance) < Number(orderInfoVo.payFee)">
						{{`余额:￥${orderInfoVo.userBalance}+微信支付:￥${orderInfoVo.residuePrice}`}}
					</view>			
				</view>
				<view class='settlement' style='z-index:100' @tap="$u.debounce(SubOrder, 500)">立即结算</view>				
			</view>
		</view>	
		<view class="alipaysubmit" v-html="formContent"></view>
		<couponListWindow :coupon='coupon' @ChangCouponsClone="ChangCouponsClone" :openType='openType'
			@ChangCoupons="ChangCoupons" :orderShow="orderShow"></couponListWindow>
		<giftListWindow 
			:show.sync="giftVisiable" 
			:giftData="giftData"
			@submit="giftSubmit"
			:disabled="isSelectedGift"
		/>
	</view>
</template>
<script>
	import {
		getCouponsOrderPrice,
		orderCreate,
		postOrderComputed,
		orderPay,
		wechatQueryPayResult,
		loadPreOrderApi,
		orderPreHint,
		orderFullList
	} from '@/api/order.js';
	import {
		getAddressDetail,
		getAddressDefault
	} from '@/api/user.js';
	import {
		openPaySubscribe,
		openOrderSubscribe
	} from '@/utils/SubscribeMessage.js';
	import {
		storeListApi
	} from '@/api/store.js';
	import {
		CACHE_LONGITUDE,
		CACHE_LATITUDE
	} from '@/config/cache.js';
	import couponListWindow from '@/components/couponListWindow';
	import giftListWindow from '@/components/giftListWindow'
	import orderGoods from '@/components/orderGoods';
	import navBar from '@/components/navBar';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	import {
		Debounce
	} from '@/utils/validate.js'
	let app = getApp();
	let timeIndex
	let usableCouponNum
	export default {
		components: {
			navBar,
			couponListWindow,
			giftListWindow,
			orderGoods,
		},
		onReady() {
			this.$nextTick(function() {
				// #ifdef MP
				const menuButton = uni.getMenuButtonBoundingClientRect();
				const query = uni.createSelectorQuery().in(this);
				query
					.select('#home')
					.boundingClientRect(data => {
						this.homeTop = menuButton.top * 2 + menuButton.height - data?.height || 0;
					})
					.exec();
				// #endif
			});
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				marTop: 0,
				navTitle: '提交订单',
				homeTop: 20,
				orderShow: 'orderShow', //下单页面使用优惠券组件不展示tab切换页
				textareaStatus: true,
				//支付方式
				cartArr: [{
						"name": "微信支付",
						"icon": "icon-weixin2",
						value: 'weixin',
						title: '微信快捷支付',
						payStatus: 1,
					},
					{
						"name": "余额支付",
						"icon": "icon-yuezhifu",
						value: 'yue',
						title: '可用余额:',
						payStatus: 1,
					},				
					{
						"name": "余额+微信支付",
						"icon": "icon-yuezhifu1",
						value: 'union_weixin',
						title: '混合支付',
						payStatus: 0,
					},
					// #ifndef MP 
					{
						"name": "余额+支付宝",
						"icon": "icon-zhihu",
						value: 'union_alipay',
						title: '混合支付',
						payStatus: 1,
					},
					// #endif
					// #ifndef MP 
					{
						"name": "支付宝支付",
						"icon": "icon-zhifubao",
						value: 'alipay',
						title: '支付宝快捷支付',
						payStatus: 1,
					}
					// #endif
				],
				payType: 'weixin', //支付方式
				openType: 1, //优惠券打开方式 1=使用
				active: 0, //支付方式切换
				coupon: {
					coupon: false,
					list: [],
					statusTile: '立即使用'
				}, //优惠券组件
				addressInfo: {}, //地址信息
				addressId: 0, //地址id
				couponId: 0, //优惠券id
				cartId: '', //购物车id
				userInfo: {}, //用户信息
				mark: '', //备注信息
				couponTitle: '请选择', //优惠券
				giftTitle: '请选择',
				coupon_price: 0, //优惠券抵扣金额
				useIntegral: false, //是否使用积分
				integral_price: 0, //积分抵扣金额
				integral: 0,
				ChangePrice: 0, //使用积分抵扣变动后的金额
				formIds: [], //收集formid
				status: 0,
				is_address: false,
				toPay: false, //修复进入支付时页面隐藏从新刷新页面
				shippingType: 0,
				system_store: {},
				storePostage: 0,
				contacts: '',
				contactsTel: '',
				mydata: {},
				storeList: [],
				store_self_mention: false,
				cartInfo: [],
				priceGroup: {},
				animated: false,
				totalPrice: 0,
				integralRatio: "0",
				orderKey: "",
				// usableCoupon: {},
				offlinePostage: "",
				payChannel: '',
				news: true,
				again: false,
				addAgain: false,
				bargain: false, //是否是砍价
				combination: false, //是否是拼团
				secKill: false, //是否是秒杀
				orderInfoVo: {
					residuePrice: 0,
					yuePayStatus: 0,
					payWeixinOpen: 0
				},
				addressList: [], //地址列表数据
				orderProNum: 0,
				preOrderNo: '', //预下单订单号
				theme: app.globalData.theme,
				formContent: '',
				addressChangeId: 0,
				title: '',
				alertTipsBottom: 0,  //截单提示距离底部的位置
				orderNo: '', //下单订单号
				isBenefit: false,
				giftVisiable: false,
				giftData: {
					storeFullInfoResList: []
				},
				selectedGiftList: [],
				isSelectedGift: false
			};
		},
		computed: {
			...mapGetters(['isLogin', 'systemPlatform', 'productType','openId']),
			markNum() {
				let markNum = 0;
				if (this.mark) {
					markNum = 150 - this.mark.length
					return markNum
				}
			},
		},
		watch: {
			isLogin: {
				handler: function(newV, oldV) {
					if (newV) {
						this.getloadPreOrder();
					}
				},
				deep: true
			}
		},
		onLoad(options) {
			// #ifdef H5
			this.payChannel = this.$wechat.isWeixin() ? 'public' : 'weixinh5';
			// #endif
			// #ifdef MP
			this.payChannel = 'routine';
			// #endif
			// #ifdef APP-PLUS
			this.payChannel = this.systemPlatform === 'ios' ? 'weixinAppIos' : 'weixinAppAndroid';
			// #endif
			// if (!options.cartId) return this.$util.Tips({
			// 	title: '请选择要购买的商品'
			// }, {
			// 	tab: 3,
			// 	url: 1
			// });
	
			
			this.preOrderNo = options.preOrderNo || 0;
			this.addressChangeId = options.addressId || 0;
			this.is_address = options.is_address ? true : false;
			this.getCouponList();
			if (this.isLogin) {
				this.getloadPreOrder();
			} else {
				toLogin();
			}
			//获取赠品
			this.getOrderFullList(options.preOrderNo)
			
			let info = uni.createSelectorQuery().in(this).select(".footer");
			info.boundingClientRect((data) => {
				this.alertTipsBottom = data.height;
			}).exec()
			
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		async onShow() {
			let _this = this
			const { message } = await orderPreHint()
			this.title = message
			// wx.getLaunchOptionsSync 
			this.textareaStatus = true;

			uni.$on("handClick", res => {
				if (res) {
					_this.system_store = res.address
				}
				// 清除监听
				uni.$off('handClick');
			})
			this.$store.commit("PRODUCT_TYPE", 'normal');
		},
		onUnload() {
			// clearInterval(timeIndex)
			timeIndex = null
		},
		methods: {
			getNavH(marTop) {
				this.marTop = marTop;
			},
			//获取满赠满购商品列表
			async getOrderFullList(preOrderNo) {
				try {
					const { data } = await orderFullList(preOrderNo)
					this.giftData = data
					this.giftData.storeFullInfoResList = data.storeFullInfoResList.map(item => ({...item,disabled: false}))
				} catch(e) {
					console.log(e)
				}
			},
			giftSubmit(value) {
				this.selectedGiftList = value
				const { fullNum = 1, activityType = null } = this.giftData
				this.giftTitle = "请选择"
				if(value.length) {
					this.giftTitle = `已选择${activityType === 1 ? "赠品" : "商品"}x${value.length}`
				}
				this.computedPrice()
			},
			// 订单详情
			getloadPreOrder: function() {
				loadPreOrderApi(this.preOrderNo).then(res => {
					let orderInfoVo = res.data.orderInfoVo;
					const { payWeixinOpen,yuePayStatus,orderInfoVo:{payFee,userBalance}} = res.data
					this.orderInfoVo = orderInfoVo;
					this.orderInfoVo.payWeixinOpen = payWeixinOpen
					this.orderInfoVo.yuePayStatus = yuePayStatus
					if (orderInfoVo.addressId && this.addressChangeId === 0) {
						this.addressId = orderInfoVo.addressId;
					} else {
						this.addressId = this.addressChangeId;
						if (orderInfoVo.addressId != this.addressChangeId) this.computedPrice();
					}
					this.cartInfo = orderInfoVo.orderDetailList;
					this.isBenefit = orderInfoVo.orderDetailList.some(item => item.isBenefit)
					this.orderProNum = orderInfoVo.orderProNum;
					this.cartArr[1].title = '可用余额:' + userBalance;
					this.cartArr[0].payStatus = parseInt(payWeixinOpen) === 1 ? 1 : 0;		
					this.cartArr[1].payStatus = +yuePayStatus === 1 && +payFee <= +userBalance ? 1 : 0;
					if(+payWeixinOpen === 1 && +yuePayStatus === 1 && +userBalance !== 0){
						const residuePrice = (Math.round((+payFee - +userBalance) *100) / 100).toFixed(2)
						this.cartArr[2].payStatus =  +payFee > +userBalance ? 1 : 0;
						this.cartArr[2].title = `可用余额:${this.orderInfoVo.userBalance}`
						this.orderInfoVo.residuePrice = residuePrice
					}
					this.getaddressInfo();
					// #ifdef H5
					if (this.$wechat.isWeixin()) this.cartArr.pop();
					// #endif
					this.store_self_mention = res.data.storeSelfMention == '1' && this
						.productType ===
						'normal' ? true : false;
				}).catch(err => {
					console.log(err)
					uni.navigateTo({
						url: '/pages/users/order_list/index'
					});
				})
			},
			/**
			 * 获取门店列表数据
			 */
			getList: function() {
				let longitude = uni.getStorageSync("user_longitude")?uni.getStorageSync("user_longitude"):''; //经度
				let latitude = uni.getStorageSync("user_latitude")?uni.getStorageSync("user_latitude"):''; //纬度
				let data = {
					latitude: latitude, //纬度
					longitude: longitude, //经度
					page: 1,
					limit: 10
				}
				storeListApi(data).then(res => {
					let list = res.data.list || [];
					this.$set(this, 'storeList', list);
					this.$set(this, 'system_store', list[0]);
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				})
			},
			/*
			 * 跳转门店列表
			 */
			showStoreList: function() {
				if (this.storeList.length > 0) {
					uni.navigateTo({
						url: '/pages/goods/goods_details_store/index'
					})
				}
			},
			// 计算订单价格
			computedPrice: function() {
				let shippingType = this.shippingType;
				const fullAttrListCount = this.selectedGiftList.reduce((cur,next) => cur + Number(next.fullPurchasePrice), 0)
				console.log(fullAttrListCount,this.selectedGiftList)
				postOrderComputed({
					addressId: this.addressId,
					useIntegral: this.useIntegral ? true : false,
					couponId: this.couponId,
					shippingType: parseInt(shippingType) + 1,
					preOrderNo: this.preOrderNo
				}).then(res => {				
					let data = res.data;
					const {payWeixinOpen,yuePayStatus,userBalance } = this.orderInfoVo
					this.orderInfoVo.couponFee = data.couponFee;
					//赋值操作，userIntegral 当前积分，surplusIntegral 剩余积分
					this.orderInfoVo.userIntegral = data.surplusIntegral;
					this.orderInfoVo.deductionPrice = data.deductionPrice;
					this.orderInfoVo.freightFee = data.freightFee;
					this.orderInfoVo.payFee = (Math.round((Number(data.payFee) + fullAttrListCount) *100) / 100).toFixed(2)
					this.orderInfoVo.proTotalFee = data.proTotalFee;
					this.orderInfoVo.useIntegral = data.useIntegral;
					this.orderInfoVo.usedIntegral = data.usedIntegral;
					this.orderInfoVo.surplusIntegral = data.surplusIntegral;
					//this.orderInfoVo.userIntegral = data.userIntegral;
					this.cartArr[1].payStatus = +yuePayStatus === 1 && +data.payFee + fullAttrListCount <= +userBalance ? 1 : 0;
					if(+payWeixinOpen === 1 && +yuePayStatus === 1 && +userBalance !== 0){
						const residuePrice = (Math.round((+data.payFee + fullAttrListCount - +userBalance) *100) / 100).toFixed(2)
						this.cartArr[2].payStatus = +data.payFee + fullAttrListCount > +userBalance ? 1 : 0;
						this.cartArr[2].title = `可用余额:${userBalance}`	
						this.orderInfoVo.residuePrice = residuePrice
					}
					this.payType = 'weixin'
					this.active = 0
				}).catch(err => {
					return this.$util.Tips({
						title: err
					});
				});
			},
			//选择地址还是门店自提
			addressType: function(e) {
				let index = e;
				this.shippingType = parseInt(index);
				this.computedPrice();
				//调起获取定位信息
				if (index == 1){
					this.getList();
					this.$util.$L.getLocation();
				} 
			},
			bindPickerChange: function(e) {
				let value = e.detail.value;
				this.shippingType = value;
				this.computedPrice();
			},
			ChangCouponsClone: function() {
				this.$set(this.coupon, 'coupon', false);
			},
			/**
			 * 处理点击优惠券后的事件
			 * 
			 */
			ChangCoupons: function(e) {
				// this.usableCoupon = e
				// this.coupon.coupon = false
				
				let index = e,
					list = this.coupon.list,
					couponTitle = usableCouponNum > 0 ? `您还有${usableCouponNum}张优惠券可以使用` : '暂无可用优惠券',
					couponId = 0;
				const { activityType } = this.giftData
				const checkIsSelectGift = () => {
					if(activityType !== null && this.selectedGiftList.length >= 1) {
						uni.showModal({
							title:"提示",
							content: `优惠券无法与${activityType === 1 ? '赠品' : '满购'}叠加`,	
							showCancel: false
						})
						this.selectedGiftList = []			
					}					
				}
				for (let i = 0, len = list.length; i < len; i++) {
					if (i != index) {
						list[i].use_title = '';
						list[i].isUse = 0;
					}
				}
				if (list[index].isUse) {
					//不使用优惠券
					list[index].use_title = '';
					list[index].isUse = 0;
					this.giftTitle = "请选择"
					this.isSelectedGift = false
				} else {
					//使用优惠券
					list[index].use_title = '不使用';
					list[index].isUse = 1;
					couponTitle = list[index].name;
					couponId = list[index].id;
					checkIsSelectGift()
					this.giftTitle = `优惠券无法与${activityType === 1 ? '赠品' : '满购'}叠加`	
					this.isSelectedGift = true
				}
				this.couponTitle = couponTitle;
				this.couponId = couponId;
				this.$set(this.coupon, 'coupon', false);
				this.$set(this.coupon, 'list', list);
				this.computedPrice();
			},
			/**
			 * 使用积分抵扣
			 */
			ChangeIntegral: function() {
				this.useIntegral = !this.useIntegral;
				this.computedPrice();
			},
			bindHideKeyboard: function(e) {
				this.mark = e.detail.value;
			},
			/**
			 * 获取当前金额可用优惠券
			 * 
			 */
			getCouponList: function() {
				getCouponsOrderPrice(this.preOrderNo).then(res => {
					usableCouponNum = res.data.filter(item => item.isUsable).length
					this.$set(this.coupon, 'list', res.data);
					this.couponTitle = usableCouponNum > 0 ? `您还有${usableCouponNum}张优惠券可以使用` : '暂无可用优惠券';
					this.openType = 1;
				});
			},
			/*
			 * 获取默认收货地址或者获取某条地址信息
			 */
			getaddressInfo: function() {
				if (this.addressId) {
					getAddressDetail(this.addressId).then(res => {
						if (res.data) {
							res.data.isDefault = res.data.isDefault;
							this.addressInfo = res.data || {};
						}
					})
				}
			},
			payItem: function(e) {
				let that = this;
				let active = e;
				that.active = active;
				that.animated = true;
				that.payType = that.cartArr[active].value;
				// #ifdef H5
				if (that.payType == 'alipay' && this.$wechat.isWeixin() == true) {
					that.payChannel = 'public';
				} else if (that.payType == 'alipay' && this.$wechat.isWeixin() == false) {
					that.payChannel = 'weixinh5';
				}
				// #endif
				// #ifdef APP-PLUS
				if (that.payType == 'alipay') {
					that.payChannel = 'appAliPay';
				}
				// #endif
				//that.computedPrice();
				setTimeout(function() {
					that.car();
				}, 500);
			},
			couponTap: function() {
				this.coupon.coupon = true;
				if (!this.coupon.list.length) this.getCouponList();
			},
			car: function() {
				let that = this;
				that.animated = false;
			},
			onAddress: function() {
				
				uni.redirectTo({
					url: '/pages/users/user_address_list/index?preOrderNo=' + this.preOrderNo
				});
			},
			realName: function(e) {
				this.contacts = e.detail.value;
			},
			phone: function(e) {
				this.contactsTel = e.detail.value;
			},
			payment: function(data) {
				let that = this;
				console.log(that.orderNo)
				if(!that.orderNo){
					// #ifdef MP
					uni.checkBeforeAddOrder({
						success(res) {
							const traceId = res.data.traceId;
							data.traceId = traceId;
							that.onCreate(data);
						},
						fail(res) {
							console.log("下单前置检查 失败：", JSON.stringify(res));
						}
					});
					// #endif
					// #ifndef MP
					that.onCreate(data);
					// #endif
				}else{
					this.getOrderPay(that.orderNo, '支付成功');
				}
				
			},
			onCreate(data) {
				orderCreate(data).then(res => {
					this.orderNo = res.data.orderNo;
					this.getOrderPay(res.data.orderNo, '支付成功');
				}).catch(err => {
					uni.hideLoading();
					return this.$util.Tips({
						title: err
					}, '/pages/users/order_list/index');
				});
			},
			getOrderPay: function(orderNo, message) {
				let that = this;
				let goPages = '/pages/order/order_pay_status/index?order_id=' + orderNo;
				orderPay({
					openId:this.openId,
					orderNo: orderNo,
					payChannel: that.payChannel,
					payType: that.payType,
					scene: that.productType === 'normal' ? 0 : 1177 //下单时小程序的场景值
				}).then(res => {
					let jsConfig = res.data.jsConfig;
					switch (res.data.payType) {
						case 'weixin':
							that.weixinPay(jsConfig, orderNo, goPages);
							break;
						case 'union_weixin': 
							that.weixinPay(jsConfig, orderNo, goPages);
							break;
						case 'yue':
							uni.hideLoading();
							return that.$util.Tips({
								title: message
							}, {
								tab: 5,
								url: goPages + '&status=1'
							});
							break;
						case 'weixinh5':
							uni.hideLoading();
							setTimeout(() => {
								location.href = jsConfig.mwebUrl + '&redirect_url=' +
									window.location
									.protocol + '//' + window.location.host + goPages +
									'&status=1';
							}, 100)
							break;
						case 'alipay':
							//#ifdef H5
							if (this.$wechat.isWeixin()) {
								uni.redirectTo({
									url: `/pages/users/alipay_invoke/index?id=${orderNo}&type=order`
								});
							} else {
								//h5支付
								uni.hideLoading();
								that.formContent = res.data.alipayRequest;
								uni.setStorage({
									key: 'orderNo',
									data: orderNo
								});
								that.$nextTick(() => {
									document.forms['punchout_form'].submit();
								})
							}
							//#endif
							// #ifdef APP-PLUS
							let alipayRequest = res.data.alipayRequest;
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: alipayRequest,
								success: (e) => {
									uni.showToast({
										title: "支付成功"
									})
									setTimeout(res => {
										uni.navigateTo({
											url: '/pages/users/alipay_return/alipay_return?out_trade_no=' +
												orderNo +
												'&payChannel=' +
												'appAlipay'
										})
									}, 1000)
								},
								fail: (e) => {
									uni.showModal({
										content: "支付失败",
										showCancel: false,
										success: function(res) {
											if (res.confirm) {
												//点击确认的操作
												uni.navigateTo({
													url: '/pages/users/alipay_return/alipay_return?out_trade_no=' +
														orderNo +
														'&payChannel=' +
														'appAlipay'
												})
											}
										}
									})
								},
								complete: () => {
									uni.hideLoading();
								},
							});
							// #endif
							break;
					}
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				});
			},
			weixinPay(jsConfig, orderNo, goPages) {
				let that = this;
				// #ifdef MP
				if(that.productType === 'video'){
					uni.requestOrderPayment({
						timeStamp: jsConfig.timeStamp,
						nonceStr: jsConfig.nonceStr,
						package: jsConfig.packages,
						signType: jsConfig.signType,
						paySign: jsConfig.paySign,
						ticket: jsConfig.ticket,
						openId: that.openId,
						success: function(ress) {
							uni.hideLoading();
							openOrderSubscribe().then(() => {
								if (that.orderInfoVo.bargainId || that.orderInfoVo
									.combinationId || that
									.pinkId || that.orderInfoVo.seckillId) {
									return that.$util.Tips({
										title: '支付成功',
										icon: 'success'
									}, {
										tab: 4,
										url: goPages
									});
								}
								return that.$util.Tips({
									title: '支付成功',
									icon: 'success'
								}, {
									tab: 5,
									url: goPages
								}, );
							})
						},
						fail: function(e) {
							console.log(e)
							uni.hideLoading();
							return that.$util.Tips({
								title: '取消支付'
							}, {
								tab: 5,
								url: goPages + '&status=2'
							});
						},
						complete: function(e) {
							uni.hideLoading();
							//关闭当前页面跳转至订单状态
							if (e.errMsg == 'requestPayment:cancel') return that.$util.Tips({
								title: '取消支付'
							}, {
								tab: 5,
								url: goPages + '&status=2'
							});
						},
					})
				}else{
					uni.requestPayment({
						timeStamp: jsConfig.timeStamp,
						nonceStr: jsConfig.nonceStr,
						package: jsConfig.packages,
						signType: jsConfig.signType,
						paySign: jsConfig.paySign,
						//ticket: jsConfig.ticket,
						success: function(ress) {
							uni.hideLoading();
							openOrderSubscribe().then(() => {
								if (that.orderInfoVo.bargainId || that.orderInfoVo
									.combinationId || that
									.pinkId || that.orderInfoVo.seckillId) {
									return that.$util.Tips({
										title: '支付成功',
										icon: 'success'
									}, {
										tab: 4,
										url: goPages
									});
								}
								return that.$util.Tips({
									title: '支付成功',
									icon: 'success'
								}, {
									tab: 5,
									url: goPages
								}, );
							})
						},
						fail: function(e) {
							console.log(e)
							uni.hideLoading();
							return that.$util.Tips({
								title: '取消支付'
							}, {
								tab: 5,
								url: goPages + '&status=2'
							});
						},
						complete: function(e) {
							uni.hideLoading();
							//关闭当前页面跳转至订单状态
							if (e.errMsg == 'requestPayment:cancel') return that.$util.Tips({
								title: '取消支付'
							}, {
								tab: 5,
								url: goPages + '&status=2'
							});
						},
					})
				}
                
				// #endif
				// #ifdef H5
				let data = {
					timestamp: jsConfig.timeStamp,
					nonceStr: jsConfig.nonceStr,
					package: jsConfig.packages,
					signType: jsConfig.signType,
					paySign: jsConfig.paySign
				};
				that.$wechat.pay(data).then(res => {
					if (res.errMsg == 'chooseWXPay:cancel') {
						uni.hideLoading();
						return that.$util.Tips({
							title: '取消支付'
						}, {
							tab: 5,
							url: goPages + '&status=2'
						});
					} else {
						wechatQueryPayResult(orderNo).then(res => {
							uni.hideLoading();
							return that.$util.Tips({
								title: '支付成功',
								icon: 'success'
							}, {
								tab: 5,
								url: goPages
							});
						}).cache(err => {
							uni.hideLoading();
							return that.$util.Tips({
								title: err
							});
						})
					}
				}).cache(res => {
					uni.hideLoading();
					return that.$util.Tips({
						title: '取消支付'
					}, {
						tab: 5,
						url: goPages + '&status=2'
					});
				});
				// #endif
				// #ifdef APP-PLUS
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: {
						"appid": jsConfig.appId, // 微信开放平台 - 应用 - AppId，注意和微信小程序、公众号 AppId 可能不一致
						"noncestr": jsConfig.nonceStr, // 随机字符串
						"package": "Sign=WXPay", // 固定值
						"partnerid": jsConfig.partnerid, // 微信支付商户号
						"prepayid": jsConfig.packages, // 统一下单订单号
						"timestamp": Number(jsConfig.timeStamp), // 时间戳（单位：秒）
						"sign": this.systemPlatform === 'ios' ? 'MD5' : jsConfig
							.paySign // 签名，这里用的 MD5 签名
					}, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
					success: function(res) {
						wechatQueryPayResult(orderNo).then(res => {
							uni.hideLoading();
							let url = '/pages/order/order_pay_status/index?order_id=' + orderNo +
								'&msg=支付成功';
							uni.showToast({
								title: "支付成功"
							})
							setTimeout(res => {
								uni.redirectTo({
									url: url
								})
							}, 2000)
						}).cache(err => {
							uni.hideLoading();
							return that.$util.Tips({
								title: err
							});
						})
					},
					fail: function(err) {
						uni.hideLoading();
						let url = '/pages/order/order_pay_status/index?order_id=' + orderNo +
							'&msg=支付失败';
						uni.showModal({
							content: "支付失败",
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									uni.redirectTo({
										url: url
									})
								}
							}
						})
					},
					complete: (err) => {
						uni.hideLoading();
					}
				});
				// #endif
			},
			async SubOrder(e) {
				let that = this,
					data = {};

				if (!that.payType) return that.$util.Tips({
					title: '请选择支付方式'
				});
				if (!that.addressId && !that.shippingType) return that.$util.Tips({
					title: '请选择收货地址'
				});
				if (that.shippingType == 1) {
					if (that.contacts == "" || that.contactsTel == "") {
						return that.$util.Tips({
							title: '请填写联系人或联系人电话'
						});
					}
					if (!/^1(3|4|5|7|8|9|6)\d{9}$/.test(that.contactsTel)) {
						return that.$util.Tips({
							title: '请填写正确的手机号'
						});
					}
					if (!/^[\u4e00-\u9fa5\w]{2,16}$/.test(that.contacts)) {
						return that.$util.Tips({
							title: '请填写您的真实姓名'
						});
					}
					if (that.storeList.length == 0) return that.$util.Tips({
						title: '暂无门店,请选择其他方式'
					});
				}
				data = {
					realName: that.contacts,
					phone: that.contactsTel,
					addressId: that.addressId,
					couponId: that.couponId,
					payType: that.payType,
					useIntegral: that.useIntegral,
					preOrderNo: that.preOrderNo,
					mark: that.mark,
					storeId: that.system_store.id || 0,
					shippingType: that.$util.$h.Add(that.shippingType, 1),
					payChannel: that.payChannel,
					fullAttrList: that.selectedGiftList.map(item => item.attrValueId)
				};
				try {
					if(this.isBenefit) {
						await this.$modal.confirm({content: '特惠商品一经售出不退不换，是否确定下单购买?'})
					}		
					if (data.payType == 'yue' && parseFloat(that.userInfo.nowMoney) < parseFloat(that.totalPrice))
						return that.$util.Tips({
							title: '余额不足！'
						});
					uni.showLoading({
						title: '订单支付中'
					});
					// #ifdef MP
					openPaySubscribe().then(() => {
						that.payment(data);
					});
					// #endif
					// #ifndef MP
					that.payment(data);
					// #endif		
				} catch(e) {
					console.log(e)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.font_color {
		@include main_color(theme);
	}

	.price_color {
		@include price_color(theme);
	}
	.mixture-price {
		color: #aaa;
	}
	.line2 {
		width: 504rpx;
	}

	.textR {
		text-align: right;
	}

	.order-submission .line {
		width: 100%;
		height: 3rpx;
	}

	.order-submission .line image {
		width: 100%;
		height: 100%;
		display: block;
	}

	.order-submission .address {
		padding: 28rpx;
		background-color: #fff;
		box-sizing: border-box;
	}

	.order-submission .address .addressCon {
		width: 596rpx;
		font-size: 26rpx;
		color: #666;
	}

	.order-submission .address .addressCon .name {
		font-size: 30rpx;
		color: #282828;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.order-submission .address .addressCon .name .phone {
		margin-left: 50rpx;
	}

	.order-submission .address .addressCon .default {
		margin-right: 12rpx;
	}

	.order-submission .address .addressCon .setaddress {
		color: #333;
		font-size: 28rpx;
	}

	.order-submission .address .iconfont {
		font-size: 35rpx;
		color: #707070;
	}

	.order-submission .allAddress {
		width: 100%;
		@include index-gradient(theme);
		padding: 110rpx 30rpx 0 30rpx;
	}

	.order-submission .allAddress .nav {
		width: 690rpx;
		margin: 0 auto;
	}

	.order-submission .allAddress .nav .item {
		width: 334rpx;
	}

	.order-submission .allAddress .nav .item.on {
		position: relative;
		width: 230rpx;
	}

	.order-submission .allAddress .nav .item.on::before {
		position: absolute;
		bottom: 0;
		content: "同城配送";
		font-size: 28rpx;
		display: block;
		height: 0;
		width: 336rpx;
		border-width: 0 20rpx 80rpx 0;
		border-style: none solid solid;
		border-color: transparent transparent #fff;
		z-index: 2;
		border-radius: 14rpx 36rpx 0 0;
		text-align: center;
		line-height: 80rpx;
	}

	.order-submission .allAddress .nav .item:nth-of-type(2).on::before {
		content: "到店自提";
		border-width: 0 0 80rpx 20rpx;
		border-radius: 36rpx 14rpx 0 0;
	}

	.order-submission .allAddress .nav .item.on2 {
		position: relative;
	}

	.order-submission .allAddress .nav .item.on2::before {
		position: absolute;
		bottom: 0;
		content: "到店自提";
		font-size: 28rpx;
		display: block;
		height: 0;
		width: 401rpx;
		border-width: 0 0 60rpx 60rpx;
		border-style: none solid solid;
		border-color: transparent transparent rgba(255, 255, 255, 0.6);
		border-radius: 36rpx 14rpx 0 0;
		text-align: center;
		line-height: 60rpx;
	}

	.order-submission .allAddress .nav .item:nth-of-type(1).on2::before {
		content: "同城配送";
		border-width: 0 60rpx 60rpx 0;
		border-radius: 14rpx 36rpx 0 0;
	}

	.order-submission .allAddress .address {
		width: 690rpx;
		max-height: 180rpx;
		margin: -2rpx auto 0 auto;
	}

	.order-submission .allAddress .line {
		width: 100%;
		margin: 0 auto;
	}

	.order-submission .wrapper .item .discount .placeholder {
		color: #ccc;
	}

	.order-submission .wrapper {
		background-color: #fff;
		margin-top: 15rpx;
	}

	.order-submission .wrapper .item {
		padding: 27rpx 24rpx;
		font-size: 30rpx;
		color: #333333;
		border-bottom: 1px solid #F5F5F5;
	}

	.order-submission .wrapper .item .discount {
		font-size: 30rpx;
		color: #333;
	}

	.order-submission .wrapper .item .discount .iconfont {
		color: #515151;
		font-size: 30rpx;
		margin-left: 15rpx;
	}

	.order-submission .wrapper .item .discount .num {
		font-size: 32rpx;
		margin-right: 20rpx;
	}

	.order-submission .wrapper .item .shipping {
		font-size: 30rpx;
		color: #999;
		position: relative;
		padding-right: 58rpx;
	}

	.order-submission .wrapper .item .shipping .iconfont {
		font-size: 35rpx;
		color: #707070;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		margin-left: 30rpx;
	}

	.order-submission .wrapper .item textarea {
		background-color: #f9f9f9;
		width: auto !important;
		height: 140rpx;
		border-radius: 14rpx;
		margin-top: 30rpx;
		padding: 15rpx;
		box-sizing: border-box;
		font-weight: 400;
	}

	.order-submission .wrapper .item .placeholder {
		color: #ccc;
	}

	.order-submission .wrapper .item .list {
		margin-top: 35rpx;
	}

	.order-submission .wrapper .item .list .payItem {
		border: 1px solid #eee;
		border-radius: 14rpx;
		height: 86rpx;
		width: 100%;
		box-sizing: border-box;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #282828;
	}

	.order-submission .wrapper .item .list .payItem.on {
		// border-color: #fc5445;
		@include coupons_border_color(theme);
		color: $theme-color;
	}

	.order-submission .wrapper .item .list .payItem .name {
		width: 50%;
		text-align: center;
		border-right: 1px solid #eee;
	}

	.order-submission .wrapper .item .list .payItem .name .iconfont {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 44rpx;
		background-color: #fe960f;
		color: #fff;
		font-size: 30rpx;
		margin-right: 15rpx;
	}

	.order-submission .wrapper .item .list .payItem .name .iconfont.icon-weixin2 {
		background-color: #41b035;
	}

	.order-submission .wrapper .item .list .payItem .name .iconfont.icon-zhifubao {
		background-color: #00AAEA;
	}

	.order-submission .wrapper .item .list .payItem .tip {
		width: 49%;
		text-align: center;
		font-size: 26rpx;
		color: #aaa;
	}

	.order-submission .moneyList {
		margin-top: 15rpx;
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: calc(constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		margin-bottom: calc(env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
	}

	.order-submission .moneyList .item {
		font-size: 28rpx;
		color: #282828;
	}

	.order-submission .moneyList .item~.item {
		margin-top: 20rpx;
	}

	.order-submission .moneyList .item .money {
		color: #666666;
	}

	.order-submission .footer {
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 0;
		height: calc(100rpx+ constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		height: calc(100rpx + env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		z-index: 99;
	}

	.order-submission .footer .settlement {
		font-size: 30rpx;
		color: #fff;
		width: 240rpx;
		height: 70rpx;
		@include main_bg_color(theme);
		border-radius: 50rpx;
		text-align: center;
		line-height: 70rpx;
	}
 
	.footer .transparent {
		opacity: 0
	}
	.alert-tips {
		position: fixed;
		z-index: 10;
		width: 100%;
	}
	/deep/ checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		@include main_bg_color(theme);
		border: none !important;
		color: #fff !important
	}

	/deep/ checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		@include main_bg_color(theme);
		border: none !important;
		color: #fff !important;
		margin-right: 0 !important;
	}
</style>
