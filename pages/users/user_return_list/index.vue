<template>
	<view>
		<view class="search-box fjs-p-y-20 fjs-p-x-30">
			<u-search 
				placeholder="请输入订单号搜索" 
				v-model="keyword" 
				actionText="搜索"
				:clearabled="true"
				bgColor="#fff"
				@clear="search"
				@custom="search"
				@search="search"
			>
			</u-search>
		</view>
		<view class='return-list pad30' v-if="orderList.length">
			<view class='goodWrapper borRadius14' v-for="(item,index) in orderList" :key="index" @click='goOrderDetails(item.refundNo)'>
				<view class='iconfont icon-shenqingzhong powder' v-if="item.refundStatus==1 || item.refundStatus==3"></view>
				<view class='iconfont icon-yiwancheng' v-if="item.refundStatus==2"></view>
				<view class='iconfont icon-yijujue' v-if="item.refundStatus==4"></view>
				<view class='orderNum'>售后单号：{{item.refundNo}}</view>
				<view class='item acea-row row-between-wrapper' v-for="(items,index) in item.orderInfoList" :key="index">
					<view class='pictrue'>
						<image :src='items.image'></image>
					</view>
					<view class='text'>
						<view class='acea-row row-between-wrapper'>
							<view class='name line1'>{{items.storeName}}</view>
							<view class='num'>x {{items.cartNum}}</view>
						</view>
						<view class='attr line1' v-if="items.sku">{{items.sku}}</view>
						<view class='money'>￥{{items.price}}</view>
					</view>
				</view>
				<view class='totalSum'>共{{item.totalNum || 0}}件商品，总金额 <text class=' price'>￥{{item.payPrice}}</text></view>
			</view>
		</view>
		<view class='loadingicon acea-row row-center-wrapper' v-if="orderList.length">
			<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
		</view>
		<view v-if="orderList.length == 0 && !loading">
			<emptyPage title="暂无订单~"></emptyPage>
		</view>
	</view>
</template>

<script>
	import emptyPage from '@/components/emptyPage.vue'
	import {
		orderRefundList
	} from '@/api/order.js';
	import {
		toLogin
	} from '@/libs/login.js';
	import {
		mapGetters
	} from "vuex";
	export default {
		components: {
			emptyPage
		},
		data() {
			return {
				loading: false,
				loadend: false,
				loadTitle: '加载更多', //提示语
				orderList: [], //订单数组
				orderStatus: -3, //订单状态
				page: 1,
				limit: 6,
				totalPage: 0,
				keyword: ''
			};
		},
		computed: mapGetters(['isLogin']),
		watch:{
			isLogin:{
				handler:function(newV,oldV){
					if(newV){
						this.getOrderList();
					}
				},
				deep:true
			}
		},
		onLoad() {
			if (this.isLogin) {
				if (this.loadend) return;
				this.getOrderList();
			} else {
				toLogin();
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			if (this.page > this.totalPage) {
				uni.showToast({
					title: '已经没有更多数据了',
					icon: 'none'
				});
				this.loadTitle = this.loadend ? "我也是有底线的" : '加载更多';
				return 
			}
			this.page++	
			this.getOrderList();
		},
		methods: {
			search(value = "") {
				this.keyword = value
				this.page = 1
				this.getOrderList()
			},
			/**
			 * 去订单详情
			 */
			goOrderDetails: function(refundNo) {
				if (!refundNo) return that.$util.Tips({
					title: '缺少订单号无法查看订单详情'
				});
				uni.navigateTo({
					url: '/pages/order/order_details/index?order_id=' + refundNo + '&isReturen=1'
				})
			},

			/**
			 * 获取订单列表
			 */
			async getOrderList() {
				if (this.loading) return;
				this.loading = true;
				this.loadTitle = "";
				try {
					const { data:{list,totalPage} } = await orderRefundList({
						orderNo: this.keyword,
						page: this.page,
						limit: this.limit,
					})
					this.orderList = this.page === 1 ? list : this.orderList.concat(list)
					this.loadend = this.page > this.totalPage
					this.totalPage = totalPage
					this.loading = false;
					this.loadTitle = this.page > this.totalPage ? "我也是有底线的" : '加载更多';
				} catch(e) {
					this.loading = false;
					this.loadTitle = "加载更多";
				}	
			}
		}
	}
</script>

<style lang="scss" scoped>
	.return-list .goodWrapper {
		background-color: #fff;
		margin-top: 20rpx;
		position: relative;
		padding: 0rpx 24rpx;
	}

	.return-list .goodWrapper .orderNum {
		border-bottom: 1px solid #eee;
		height: 87rpx;
		line-height: 87rpx;
		font-size: 30rpx;
		color: #333333;
	}

	.return-list .goodWrapper .item {
		border-bottom: 0;
	}

	.return-list .goodWrapper .totalSum {
		padding: 0 30rpx 32rpx 30rpx;
		text-align: right;
		font-size: 26rpx;
		color: #282828;
	}

	.return-list .goodWrapper .totalSum .price {
		font-size: 28rpx;
		font-weight: bold;
		@include price_color(theme);
	}

	.return-list .goodWrapper .iconfont {
		position: absolute;
		font-size: 109rpx;
		top: 7rpx;
		right: 22rpx;
		color: #ccc;
	}

	.return-list .goodWrapper .iconfont.powder {
		color: #f8c1bd;
	}
</style>
