<template>
	<view class="goodsList" @touchstart="touchstart" @touchend="touchend">	
		<scroll-view class="scroll-view" scroll-y  :style="{ height: scrollHeight + 'px' }">
			<template  v-if="!!tempArr.length">
				<view class="prod-item"  v-for="item in tempArr" :key="item.titleName">
					<view class="title-name">
						{{item.titleName}}
					</view>
					<view class="item acea-row" v-for="(prod,index) in item.children" :key='index' >
						<view class="pic" :class="prod.activeTag ? 'active-tag' : ''"   @click="goDetail(prod)">
							<image :src="prod.image" mode=""></image>
							<view class="active-tag-img" v-if="prod.activeTag">
								<text>{{prod.activeTag}}</text>
							</view>
						</view>
						<view class="pictxt acea-row row-column-between">
							<view class="title" @click="goDetail(prod)">
								<view class="text u-line-2">{{prod.storeName}}</view>
								<view class="product-info u-line-1">{{prod.storeInfo}}</view>
							</view>
							<view class="bottom acea-row ">				
								<view class="money">
									<view class="flex-align-center flex">
										<view class="price">
											<text class="sign">￥</text>
											{{displayPriceBasedOnConditions(prod)}}
										</view>
										<view class="unit">
											<text>{{prod.unitName ? `/${prod.unitName}` : ''}}</text>
										</view>
										<view class="practical-text" v-if="prod.priceAfterCoupon">劵后价</view>
									</view>
									<view class="unit-price" v-if="prod.suitPrice">
										{{ `(仅￥${prod.suitUnitPrice}/${prod.suitUnitName})` }}
									</view>
								</view>
								<view v-if="prod.stock>0">
									<view>
										<!-- 多规格 -->
										<view class="bnt" @click.stop="goCartDuo(prod)">
											选规格
											<view class="num" v-if="item.cartNum">{{item.cartNum}}</view>
										</view>
									</view>
								</view>
								<view class="bnt end" v-else>已售罄</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<u-empty
				v-else
				mode="car"
				icon="/static/images/cate/no-data.png"
				text="敬请期待"
			/>			
			<view class='next-text acea-row row-center-wrapper' v-show="tempArr.length">
				上滑查看下一分类
				<!-- 已经没有更多了~ -->
			</view>
		</scroll-view>	
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	let observer = null;
	export default {
		name: 'd_goodList',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			tempArr:{
				type: Array,
				default:[]
			},
			scrollHeight: {
				type: Number,
				default: () => 0
			}
			// isLogin:{
			// 	type: Boolean,
			// 	default:false
			// }
		},
		data() {
			return {
				isTolower: false,
				startclientY: 0,	
				appear: false
			};
		},
		computed: {
			...mapGetters(['isLogin', 'uid','shopList','theme'])
		},
		onReady() {
			observer = uni.createIntersectionObserver(this)
			observer.relativeTo('.scroll-view').observe('.next-text', (res)=>{
				if (res.intersectionRatio > 0 && !this.appear) {
					this.appear = true;
				} else if (!res.intersectionRatio > 0 && this.appear) {
					this.appear = false;
				}
			})
		},
		methods: {
			goDetail(item){
				this.$emit('detail',item);
			},
			goCartDuo(item){
				this.$emit('gocartduo',item);
			},
			goCartDan(item,index){
				this.$emit('gocartdan',item,index);
			},
			CartNumDes(index,item){
				this.$emit('ChangeCartNumDan', false,index,item);
			},
			CartNumAdd(index,item){
				this.$emit('ChangeCartNumDan', true,index,item);
			},
			displayPriceBasedOnConditions(prod) {
				return prod.suitPrice ? prod.suitPrice : (prod.priceAfterCoupon ? prod.priceAfterCoupon : prod.price || '****')
			},
			inputChange(){
				//是否登录
				if (this.isLogin === false) {
					toLogin();
				} else {
					this.goCat(1);
				}
			},
			goCat: function(num) {
				let that = this,
					productSelect = that.productValue[this.attrValue];
				//打开属性
				if (that.attrValue) {
					//默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
					that.attr.cartAttr = !that.isOpen ? true : false;
				} else {
					if (that.isOpen) that.attr.cartAttr = true;
					else that.attr.cartAttr = !that.attr.cartAttr;
				}
				//只有关闭属性弹窗时进行加入购物车
				if (that.attr.cartAttr === true && that.isOpen === false)
					return (that.isOpen = true);
				//如果有属性,没有选择,提示用户选择
				if (
					that.attr.productAttr.length &&
					productSelect.stock === 0 &&
					that.isOpen === true
				)
					return that.$util.Tips({
						title: "产品库存不足，请选择其它"
					});
				if (num === 1) {
					let q = {
						productId: parseFloat(that.id),
						cartNum: parseFloat(that.attr.productSelect.cart_num),
						isNew: false,
						productAttrUnique: that.attr.productSelect !== undefined ?
							that.attr.productSelect.unique : that.productInfo.id
					};
					postCartAdd(q).then(function(res) {
							that.isOpen = false;
							that.attr.cartAttr = false;
							that.$util.Tips({
								title: "添加购物车成功",
								success: () => {
									that.getCartCount(true);
								}
							});
						})
						.catch(res => {
							that.isOpen = false;
							return that.$util.Tips({
								title: res
							});
						});
				} else {
					this.getPreOrder();
				}
			},
			touchstart(event) {
				this.startclientY = event.changedTouches[0].clientY
			},
			touchend(event) {
				console.log(this.appear)
				if(this.appear && this.startclientY > event.changedTouches[0].clientY) {
					this.$emit('getNextClassify')
					this.isTolower = false;
				}
			}
		}
	};
</script>

<style lang="scss">
	.goodsList{
		padding: 0 30rpx;
		margin-top: 128rpx;
		.title-name {
			font-size: 28rpx;
			color: #333;
			font-weight: 500;
			margin-bottom: 38rpx;
		}

		.item{
			width: 100%;
			box-sizing: border-box;
			margin-bottom: 38rpx;
			padding-bottom: 38rpx;
			border-bottom: 2rpx solid #F7F7F7;
			display: flex;
			.pic{
				width: 172rpx;
				height: 172rpx;
				position: relative;
				border-radius: 22rpx;
				margin-right: 20rpx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 16rpx;
				}
			}
			.active-tag {
				position: relative;
				color: #fff;
				font-size: 20rpx;
				&::before {
					position: absolute;
					width: calc(100% - 8rpx);
					height: calc(100% - 8rpx);
					@include border_color(them);
					border: 6rpx solid;
					border-radius: 16rpx;
					content: "";
					display: block;
					z-index: 2;
				}
				.active-tag-img {
					position: absolute;
					left: -3rpx;
					top: 0;
					width: 94rpx;
					height: 40rpx;
					border-radius: 16rpx 0rpx 16rpx 0rpx;
					z-index: 2;
					line-height: 36rpx;
					text-align: center;
					padding: 0 6rpx;
					background: linear-gradient(180deg, #FA9552 0%, #FE5C2D 60%);
					box-sizing: content-box;
				}
			}
			.pictxt{
				flex: 1;
				.text {
					font-size:26rpx;
					font-family: PingFang SC;
					font-weight: 600;
					color: $crmeb-font-color;
				}
				.product-info {
					margin-top: 10rpx;
				}
				.bottom{
					margin-top: 22rpx;
					justify-content: space-between;
					align-items: flex-end;
					.money{		
						font-weight: 800;
						@include price_color(theme);
						.pricem.unit {
							font-size: 29rpx;
						}					
						.practical-text {
							@include price_color(theme);
							font-size: 20rpx;
							margin-left: 10rpx;
						}
						.sign {
							font-size: 22rpx;
						}
					}
					.unit-price {
						font-size: 24rpx;
						@include price_color(theme);
						font-style: normal;
						font-weight: 400;	
					}
					.old-price {
						font-size: 20rpx;
						color: #aaa;
						font-weight: 400;
						margin-left: 10rpx;
					}
				
					/* .otPrice{
						font-size: 20rpx;
						font-family: PingFang SC;
						font-weight: 400;
						line-height: 24rpx;
						padding-left: 14rpx;
						color: #999999;
					} */
					.cart{
						height: 46rpx;
						.pictrue{
							color: $crmeb-theme-color;
							font-size:46rpx;
							width: 46rpx;
							height: 46rpx;
							text-align: center;
							line-height: 46rpx;
							&.icon-jiahao{
								 color: $crmeb-theme-color;
							}
						}
						.num{
							font-size: 30rpx;
							color: $crmeb-font-color;
							font-weight: bold;
							width: 60rpx;
							text-align: center;
						}
					}
					.icon-gouwuche6{
						width: 46rpx;
						height: 46rpx;	
						background-color: $crmeb-theme-color;
						border-radius: 50%;
						color: $crmeb-font-color-white;
						font-size: 30rpx;
					}
					.bnt{
						padding: 0 20rpx;
						height: 46rpx;
						line-height: 46rpx;
						@include main_bg_color(theme);
						border-radius:23rpx;
						font-size: 22rpx;
						color: $crmeb-font-color-white;
						position: relative;
						&.end{
							background:$crmeb-font-color-disable;
						}
						.num{
							min-width: 12rpx;
							@include main_color(theme);
							@include coupons_border_color(theme);
							background: #fff;
							border-radius: 15px;
							position: absolute;
							right: -13rpx;
							top: -11rpx;
							font-size: 16rpx;
							padding: 0 11rpx;
							height: 32rpx;
							line-height: 32rpx;
						}
					}
				}
			}
		}
	}
	.scroll-view {
		padding-top: 37rpx;
		box-sizing: border-box;
	}
	// .goodsList .prod-item:last-child  .item {
	// 	&:last-child {
	// 		margin-bottom: 0
	// 	}	
	// }
	.next-text {
		width: 100%;
		overflow: hidden;
		color: #999;
		font-size: 24rpx;
		// padding-bottom: 30rpx;
	}
</style>
