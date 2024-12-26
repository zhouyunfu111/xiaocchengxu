<template>
	<view class="ranking">
		<view class="bag">
			<image src="@/static/images/recommend/top-bg.png"></image>
		</view>
		<view class="sys-head skeleton-rect" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="mp-header">		
			<view class="icon" @click="back">
				<!-- <image class="img" :src="urlDomain+'crmebimage/perset/usersImg/left.png'"></image> -->
				<u-icon name="arrow-left" size="22" color="#333" ></u-icon>
			</view>
			军师情报
		</view>
		<scroll-view class="scroll-box" scroll-y show-scrollbar @scrolltolower="onScroll" :style="{ height: scrollHeight  }" >
			<view class="title">
				<image src="@/static/images/recommend/title.png"></image>
			</view> 
			<view class="ranking-list">
				<view class="item flex" v-for="(item,index) in productList" :key="item.id" @click="toDetail(item.productId)">
					<view class="img-box">
						<image class="pictrue" :src="item.image"></image>
						<view  class="rank_bdg top_1" v-if="index == 0">
							<image src="@/static/images/recommend/rank-bdg1.png"></image>
						</view>
						<view  class="rank_bdg top_2" v-else-if="index == 1">
							<image src="@/static/images/recommend/rank-bdg2.png"></image>
						</view>
						<view  class="rank_bdg top_3" v-else-if="index == 2">
							<image src="@/static/images/recommend/rank-bdg3.png"></image>
						</view>
					</view>
					<view class="goods-info flex-column">
						<view class="info-head">
							<view class="goods_name">{{item.productName}}</view>
							<view class="same-info">
								<view class="item-title u-flex"><text>同售店铺</text>
								<!-- 	<u-icon name="question" color="#bbb" size="14"></u-icon> -->: 			
								</view>
								<view class="item-num">{{addThousand(item.sameSaleNum)}}</view>
							</view>
						</view>			
						<view class="count-info">
							<view class="text-info">
								<view class="item-title">大盘销量: </view>
								<view class="item-num">{{addThousand(item.marketSales)}}</view>
							</view>	
							<view class="text-info" style="margin-top:4rpx;">
								<view class="item-title">本店进货量: </view>
								<view class="item-num">{{addThousand(item.quantityIn)}}</view>
							</view>						
						</view>	
					</view>
					<view class="to-icon">
						<image src="@/static/images/recommend/item-bg.png"></image>		
						<view class="text">马上抢</view>
					</view>
				</view>
			</view>
			<u-loadmore v-if="productList.length > 0" :status="status" color="#fff"  :nomoreText="nomoreText" />
		</scroll-view>	
	</view>
</template>

<script>
	import goodsRank from '../index/components/goodsRank';
	import { productRank } from '@/api/api.js'
	import animationType from '@/utils/animationType.js'
	export default {
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				statusBarHeight: 0,
				productList: [],
				params: {
					limit: 6,
					page:1,
					total: 0
				},
				status: 'loadmore',
				scrollHeight: 0,
				nomoreText: '没有更多了~',
				goodScroll: true
			}
		},
		onLoad() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			const mpheight = uni.createSelectorQuery().in(this).select('.mp-header')
			mpheight.boundingClientRect(data => {
				this.scrollHeight = uni.getSystemInfoSync().windowHeight - (data.height + this.statusBarHeight) - 10 + 'px'
			}).exec()
			this.getProductRank();
		},
		components:{
			goodsRank
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			toDetail(id){
				uni.navigateTo({
					animationType: animationType.type,
					animationDuration: animationType.duration,
					url:'/pages/goods/goods_details/index?id=' + id
				})
			},
			async getProductRank(){
				this.status = 'loadmore';			
				const {data,message} = await productRank(this.params)
				this.nomoreText = message ? message : '没有更多了'
				if(this.params.page === 1){
					this.productList = data?.list || [] 
					this.productList.length < this.params.limit &&  (this.status = 'nomore')
				} else {		
					this.productList = this.productList.concat(data.list)
				}
				this.params.total = data.total
				
			},
			addThousand(num) {
				if(num >= 10000) {
					return `${Math.floor((num / 10000))}w+`
				} else {
					return num
				}
			},
			onScroll() {
				const { page,limit,total } = this.params
				if (page * limit > total) {
					uni.showToast({
						title: '已经没有更多数据了',
						icon: 'none'
					});
					this.status = 'nomore';
					
					return 
				}
				this.params.page++
				this.getProductRank()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ranking {
		padding: 0 30rpx 30rpx;
		background: linear-gradient( 180deg, #F76F60 0%, #FFD67A 100%);
		height: 100vh;
		.title{
			position: relative;
			width: 100%;
			margin-top: 13rpx;
			image {			
				width: 230rpx;
				height: 38rpx;
				display: block;
				margin: 0 auto;
			}
		}		
		.mp-header {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			color: #fff;
			height: 43px;
		}
		.bag {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: 0;
			image {
				width: 100%;
				height: 350rpx;
				display: block;
			}
		}
		.ranking-list {
			position: relative;
			margin-top: 30rpx;
			padding-right: 7rpx;
			.item {
				background-color: #fff;
				border-radius: 16rpx;
				box-shadow: 0rpx 4rpx 20rpx 4rpx rgba(51,51,51,0.1);
				padding: 30rpx;
				position: relative;
				margin-bottom: 30rpx;
				.img-box {
					width: 180rpx;
					height: 180rpx;
					background: #F3F3F3;
					position: relative;
					border-radius: 16rpx;
					margin-right: 30rpx;
					image {
						width:100%;
						height:100%;
						border-radius: 16rpx;
					}
					.rank_bdg {
						width: 48rpx;
						height: 48rpx;
						position: absolute;
						top: 0;
						left: 12rpx;
						image {
							border-radius: 0;
						}
					}
				}
				.goods-info {
					flex: 1;
					flex-direction: column;
					justify-content: space-between;
					display: flex;
					.same-info {
						color: #bbb;
						font-size: 24rpx;
						display: flex;
						.item-num {
							margin-left: 15rpx;
						}
					}
				}
				
				.goods_name {
					font-size: 32rpx;
					font-weight: 600;
					color: #333;
					line-height: 44rpx;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: wrap;
				}
				.text-info {
					display: flex;
					.item-num {
						color: #C60203;
						margin-left: 15rpx;
					}
				}
				
				.to-icon {
					position: absolute;
					right: -6rpx;
					bottom: 30rpx;
					width: 118rpx;
					height: 54rpx;
					color: #fff;
					line-height: 57rpx;
					.text {
						position: relative;
						z-index: 3;
						padding-left: 20rpx;
					}
					image {
						width: 100%;
						height: 100%;
						display: block;
						position: absolute;
					}
				}
			}
		}
	}
	.icon {
		position: absolute;
		left: 0;
		top: 0;
		width: 86rpx;
		height: 86rpx;
		display: flex;
		align-items: center;
		.img {
			width: 50rpx;
			height: 50rpx;
		}
	}
</style>