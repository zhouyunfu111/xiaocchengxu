<template>
	<view class="orderGoods borRadius14">
		<view class='total'>共{{ orderProNum?orderProNum:totalNmu}}件商品</view>
		<view class='goodWrapper pad30'>
			<view class="item goods-item" v-for="(item,index) in cartInfo" :key="index"
				@click="jumpCon(item.productId)">
				<view class="flex flex-row-between">
					<view class='pictrue'>
						<image :src='item.image'></image>
					</view>
					<view class='text'>
						<view class='acea-row row-between-wrapper'>
							<view class='name line1 flex flex-align-center'>
								<view class="tag-item" v-if="item.isBenefit">特惠</view>
								{{item.productName ? item.productName : item.storeName}}
							</view>
							<view class='num'>x {{item.payNum ? item.payNum : item.cartNum}}</view>
						</view>
						<view class='attr line1' v-if="item.sku">
							<view>{{item.sku}}</view>
						</view>
						<view class='money flex flex-row-between'>
							<view class="flex flex-align-center">
								<view class="money-text">￥{{item.vipPrice ? item.vipPrice : item.price}}</view>
								<view class="fjs-m-l-5"  v-if="item.residuePromoNum && item.payNum > item.residuePromoNum">
									{{ productDetails(item) }}					
								</view>
							</view>	
							<view class="tool-btns flex flex-align-center">
								<view
									v-if="orderInfo.outboundStatus === 1 && item.refundedNum < item.cartNum"
									hover-class="none" 
									class='bnt cancel'
									@click.stop="toRefundPages(item)"
								>
									申请售后 
								</view>
								<view class='evaluate-btn fjs-m-l-10' v-if='item.isReply==0 && evaluate==2' @click.stop="evaluateTap(item)">评价</view>
								<view class='evaluate-btn fjs-m-l-10' v-else-if="item.isReply==1">已评价</view>
							</view>
						</view>
					</view>
				</view>
				<view class="section-refund-info fjs-m-t-10">
					<text v-if="item.refundedNum > 0">{{item.refundedNum}}件已申请售后</text>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			evaluate: {
				type: Number,
				default: 0,
			},
			cartInfo: {
				type: Array,
				default: function() {
					return [];
				}
			},
			orderId: {
				type: String,
				default: '',
			},
			ids: {
				type: Number,
				default: 0,
			},
			jump: {
				type: Boolean,
				default: false,
			},
			orderProNum: {
				type: Number,
				default: function() {
					return 0;
				}
			},
			productType: {
				type: Number,
				default: function() {
					return 0;
				}
			},
			orderInfo: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				totalNmu: ''
			};
		},
		watch: {
			cartInfo: function(nVal, oVal) {
				let num = 0
				nVal.forEach((item, index) => {
					num += item.cartNum
				})
				this.totalNmu = num
			}
		},
		methods: {
			evaluateTap(item) {
				uni.navigateTo({
					url: "/pages/goods/goods_comment_con/index?unique=" + item.attrId + "&orderId=" + this.orderId + '&id=' + this.ids
				})
			},
			jumpCon: function(id) {
				let type = this.productType==0?'normal':'video'
				if (this.jump) {
					uni.navigateTo({
						url: `/pages/goods/goods_details/index?id=${id}&type=${type}`
					})
				}
			},
			productDetails(item) {
				return `(￥${item.salePrice}x${item.payNum - item.residuePromoNum},￥${item.promoPrice}x${item.residuePromoNum})`
			},
			toRefundPages(item) {
				uni.navigateTo({
					url: `/pages/goods/goods_return/index?orderId=${this.orderId}&attrValueId=${item.attrId}&outboundStatus=${this.orderInfo.outboundStatus}`
				}) 
			}
		}
	}
</script>

<style scoped lang="scss">
	.orderGoods {
		background-color: #fff;
		margin-top: 15rpx;
	}
	.money-text{
		@include price_color(theme);
	}
	.orderGoods .total {
		width: 100%;
		height: 86rpx;
		padding: 0 24rpx;
		border-bottom: 2rpx solid #f0f0f0;
		font-size: 30rpx;
		color: #282828;
		line-height: 86rpx;
		box-sizing: border-box;
	}

	.pictrue image {
		background: #f4f4f4;
	}
	.tag-item{
		border-radius: 8rpx;
		padding: 8rpx;
		font-size: 20rpx;
		color: #fff;							
		margin-right: 10rpx;
		background-color: #CE3835;
	}	
	
	.money .bnt.cancel {
		color: #aaa;
		border: 1rpx solid #ddd;
		width: 158rpx;
		height: 54rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 48rpx;
		font-size: 27rpx;
	}
	.goods-item {
		bottom: 2rpx solid #f0f0f0;
		padding: 26rpx 0;
		height: auto;
	}
	.evaluate-btn {
		width: 114rpx;
		height: 48rpx;
		border: 1rpx solid #bbb;
		border-radius: 4rpx;
		text-align: center;
		line-height: 46rpx;
	}
</style>
