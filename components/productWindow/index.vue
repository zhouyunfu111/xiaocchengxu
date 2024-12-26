<template>
	<view>
		<view class="product-window"
			:class="(attr.cartAttr === true ? 'on' : '') + ' ' + (iSbnt?'join':'') + ' ' + (iScart?'joinCart':'')">
			<view class="textpic acea-row ">
				<view class="pictrue" @click="showImg()">
					<image :src="attr.productSelect.image"></image>
				</view>
				<view class="text">
					<view class="u-line-1">
						{{ attr.productSelect.storeName }}
					</view>
					<view class="money">
						<view class="flex align-baseline">
							<text>￥</text>
							<view class="num">
								<text v-if="attr.productSelect.residuePromoNum && attr.productSelect.daysPromoPrice">{{ daysPromoPrice  }}</text>
								<text v-else>{{ productPrice }} </text>				
								<!-- <u-count-to v-else ref="uCountTo" color="#FE5C2D" :decimals="2" :autoplay="false" :startVal="attr.productSelect.daysPromoPrice" :endVal="uCountToEndPrice"></u-count-to> -->
						    </view>
							<view class="unit" v-if="attr.productSelect.unitName">/{{ attr.productSelect.unitName}}</view>
							<view class="fjs-m-l-10" v-if="attr.productSelect.isSuit">
								{{ `(仅￥${ unitAfterPirce }/${attr.productSelect.productUnitName})` }}
							</view>
							<view class="practical-text fjs-m-l-10" v-if="attr.productSelect.priceAfterCoupon || attr.productSelect.daysPromoPrice">劵后价</view>
							<view class="flex pl-2"
								v-if="attr.productSelect.vipPrice && attr.productSelect.vipPrice > 0">
								<image :src="urlDomain+'crmebimage/perset/staticImg/vip_badge.png'" class="vip_icon"></image>
								<text class='vip_money skeleton-rect'>￥{{attr.productSelect.vipPrice}}</text>
							</view>
						</view>
						<view class="flex">
							<text class="stock" v-if='isShow'>库存: {{ attr.productSelect.stock }}</text>
							<view class="daysPromo-info flex" 
								@click="showDaypRomoTips(0)" 
								v-show="attr.productSelect.daysPromoPrice && attr.productSelect.residuePromoNum > 0">
								{{`前${attr.productSelect.residuePromoNum + attr.productSelect.unitName}享特价￥${attr.productSelect.daysPromoPrice}/${attr.productSelect.unitName}`}}
								<u-icon name="question-circle" color="#FE5C2D" size="14"></u-icon>
							</view>
							<view class="daysPromo-info flex" 
								@click="showDaypRomoTips(attr.productSelect.priceAfterCoupon ? 2 : 1)"
								v-if="attr.productSelect.priceType === 1"
							 >
								门店特价商品
								<u-icon name="question-circle" color="#FE5C2D" size="14"></u-icon>
							</view>
							<text class='stock' v-if="limitNum">限量: {{attr.productSelect.quota}}</text>
						</view>
					</view>
				</view>
				<view class="iconfont icon-guanbi" @click="closeAttr"></view>
			</view>
			<view class="rollTop">
				<view class="productWinList">
					<view class="item" v-for="(item, indexw) in attr.productAttr" :key="indexw">
						<view class="title">{{ item.attrName }}</view>
						<view class="listn acea-row row-middle">
							<view class="itemn" :class="item.index === itemn ? 'on' : ''"
								v-for="(itemn, indexn) in item.attrValues" @click="tapAttr(indexw, indexn)"
								:key="indexn">
								{{ itemn }}
							</view>
						</view>
					</view>
				</view>
				<view class="cart acea-row row-between-wrapper">
					<view class="title u-flex-1">
						数量
						<text v-if="attr.productSelect.daysQuotaFixed >= 0">(每日限购{{attr.productSelect.daysQuotaFixed}}包，剩余{{attr.productSelect.daysQuota}}包可购)</text>
					</view>
					<view class="carnum acea-row row-left">
						<view class="item reduce" :class="attr.productSelect.cart_num <= 1 ? 'on' : ''"
							@click="CartNumDes">
							-
						</view>
						<view class='item num'>
							<input type="number" v-model="cart_num"
								data-name="productSelect.cart_num" 
								@focus="nextCartNum = cart_num"
								@change="bindCode"
								:min="1"
								maxlength="3"></input>
						</view>
						<view v-if="iSplus" class="item plus" :class="attr.productSelect.cart_num >= attr.productSelect.stock? 'on': ''" @click="CartNumAdd">
							+
						</view>
						<view v-else class='item plus'
							:class='(attr.productSelect.cart_num === onceNum) || (attr.productSelect.cart_num >= attr.productSelect.quota) || (attr.productSelect.cart_num >= attr.productSelect.stock) || (attr.productSelect.cart_num >= attr.productSelect.num)? "on":""'
							@click='CartNumAdd'>+</view>
					</view>
				</view>
			</view>
			<view class="joinBnt bg_color" v-if="iSbnt && attr.productSelect.stock>0 &&attr.productSelect.quota>0"
				@click="goCat">我要参团</view>
			<view class="joinBnt on"
				v-else-if="(iSbnt && attr.productSelect.quota<=0)||(iSbnt &&attr.productSelect.stock<=0)">已售罄</view>
			<view class="joinBnt" :class="attr.productSelect.price ? 'bg_color' : 'on'" v-if="iScart && attr.productSelect.stock" @click="goCat">确定</view>
			<!-- <view class="joinBnt bg-color" v-if="iSbnt && attr.productSelect.stock && attr.productSelect.quota" @click="goCat">确定</view> -->
			<view class="joinBnt on" v-else-if="(iScart && !attr.productSelect.stock)">已售罄</view>
		</view>
		<view class="mask" @touchmove.prevent :hidden="attr.cartAttr === false" @click="closeAttr"></view>
		<u-modal 
			:show="isShowDaysPromoTips" 
			title="提示" 
			:content='content[contentIndex]'
			confirmText="我知道了" 
			@confirm="isShowDaysPromoTips = false" 
			confirmColor="#FE5C2D">
		 </u-modal>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	export default {
		props: {
			attr: {
				type: Object,
				default: () => {}
			},
			//一次最多可买几个，活动商品中使用
			onceNum: {
				type: Number,
				value: 1
			},
			limitNum: {
				type: Number,
				value: 0
			},
			isShow: {
				type: Number,
				value: 0
			},
			iSbnt: {
				type: Number,
				value: 0
			},
			iSplus: {
				type: Number,
				value: 0
			},
			iScart: {
				type: Number,
				value: 0
			}
		},
		data() {
			return {
				urlDomain: this.$Cache.get("imgHost"),
				cart_num: 0,
				nextCartNum: 1,
				uCountToEndPrice: 0,
				isShowDaysPromoTips: false,
				content: [
					'每人每天购买该商品指定数量时，可享特价，特价商品不参与叠加优惠。超过特价数量，按正常售价计算。如同时加购特价与非特价商品，按均价进行计算。',
					'该价格为门店尊享特价，不参与任何叠加优惠',
					'该价格为门店尊享特价',
				],
				contentIndex: 0
			};
		},
		created() {},
		computed: {
			...mapGetters(['shopList']),
			productPrice(){
				const { priceAfterCoupon, price } = this.attr.productSelect
				return priceAfterCoupon ? priceAfterCoupon : price || '****'
			},
			daysPromoPrice(){
				const { priceAfterCoupon,cart_num,daysPromoPrice,residuePromoNum ,salePrice } = this.attr.productSelect
				return cart_num > residuePromoNum ? (priceAfterCoupon ? priceAfterCoupon : salePrice) : daysPromoPrice
			},
			unitAfterPirce() {
				const { unitPriceAfterCoupon,unitSalePriceAfter,cart_num,residuePromoNum } = this.attr.productSelect
				return residuePromoNum && cart_num > residuePromoNum ? unitSalePriceAfter : unitPriceAfterCoupon
			}
		},
		watch:{
			attr(){
				this.cart_num = this.attr.productSelect.cart_num
			}
		},
		methods: {
			goCat: function() {
				if(!this.attr.productSelect.price) return
				this.$emit('goCat');
			},
			showDaypRomoTips(index) {
				this.isShowDaysPromoTips = true
				this.contentIndex = index
			},
			/**
			 * 购物车手动输入数量
			 * 
			 */
			// bindCode: function(e) {
			// 	if(this.attr.productSelect.cart_num <= 0) {
			// 		this.$u.toast('商品数量不能小于1')
			// 		this.$emit('iptCartNum', 1);
			// 	} else{
			// 		this.$emit('iptCartNum', this.attr.productSelect.cart_num);
			// 	}
				
			// },
			bindCode(event) {
				const value = +event.target.value
				const stock = this.attr.productSelect.stock
				
				if(value <= 0) {
					this.$u.toast('商品数量不能小于1')
					this.cart_num = 1
					this.$emit('iptCartNum', 1);
				} 
				if(value > stock) {
					this.$u.toast('商品数量超出了库存限制')
					this.cart_num = this.nextCartNum
				} 

				this.$emit('iptCartNum', this.cart_num);
				
			},
			closeAttr: function() {
				this.$emit('myevent');
			},
			CartNumDes: function() {
				this.$emit('ChangeCartNum', false);			
			},
			CartNumAdd: function() {
				const {daysQuota,residuePromoNum,daysPromoPrice} = this.attr.productSelect
				if(daysQuota !== null && this.cart_num + 1 > daysQuota) {					
					return this.$u.toast('商品购买数量不能大于每日限购数量')
				}
				this.$emit('ChangeCartNum', true);
			},
			// switchPrice(cart_num,residuePromoNum) {
			// 	if(cart_num + 1 > residuePromoNum) {
			// 		this.uCountToEndPrice = daysPromoPrice
			// 		this.$refs.uCountTo.start();
			// 	}
			// },
			tapAttr: function(indexw, indexn) {
				let that = this;
				that.$emit("attrVal", {
					indexw: indexw,
					indexn: indexn
				});
				this.$set(this.attr.productAttr[indexw], 'index', this.attr.productAttr[indexw].attrValues[indexn]);
				let value = that.getCheckedValue().join(",");
				that.$emit("ChangeAttr", value);
			},
			//获取被选中属性；
			getCheckedValue: function() {
				let productAttr = this.attr.productAttr;
				let value = [];
				for (let i = 0; i < productAttr.length; i++) {
					for (let j = 0; j < productAttr[i].attrValues.length; j++) {
						if (productAttr[i].index === productAttr[i].attrValues[j]) {
							value.push(productAttr[i].attrValues[j]);
						}
					}
				}
				return value;
			},
			showImg() {
				this.$emit('getImg');
			},
		}
	}
</script>

<style scoped lang="scss">
	.product-window {
		position: fixed;
		bottom: 0;
		width: 100%;
		left: 0;
		background-color: #fff;
		z-index: 77;
		border-radius: 16rpx 16rpx 0 0;
		padding-bottom: 100rpx;
		padding-bottom: calc(env(safe-area-inset-bottom) + 100rpx);
		transform: translate3d(0, 100%, 0);
		transition: all .2s cubic-bezier(0, 0, .25, 1);
	}

	.product-window.on {
		transform: translate3d(0, 0, 0);
	}

	.product-window.join {
		padding-bottom: 30rpx;
	}

	.product-window.joinCart {
		padding-bottom: 30rpx;
		z-index: 999;
	}

	.product-window .textpic {
		padding: 0 90rpx 0 30rpx;
		margin-top: 29rpx;
		position: relative;
	}

	.product-window .textpic .pictrue {
		width: 150rpx;
		height: 150rpx;
	}

	.product-window .textpic .pictrue image {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}
	
	.practical-text {
		@include price_color(theme);	
		font-size: 20rpx;
	}
	
	.product-window .textpic .text {
		font-size: 32rpx;
		color: #333333;
		flex: 1;
		padding-left: 20rpx;
	}

	.product-window .textpic .text .money {
		font-size: 24rpx;
		margin-top: 23rpx;
		@include price_color(theme);
	}

	.product-window .textpic .text .money .num {
		font-family: PingFang SC;
		font-size: 36rpx;
		font-weight: 600;
	}
	.product-window .textpic .text .money .daysPromo-info {
		color: #999;
		margin-left: 20rpx;
	}
	.product-window .textpic .text .money .stock {
		color: #999;
	}

	.product-window .textpic .iconfont {
		position: absolute;
		right: 30rpx;
		top: -5rpx;
		font-size: 35rpx;
		color: #8a8a8a;
	}

	.product-window .rollTop {
		max-height: 760rpx; //规格较多时候弹框高度为高为800rpx
		overflow: auto;
		margin-top: 36rpx;
	}

	.product-window .productWinList .item~.item {
		margin-top: 36rpx;
	}

	.product-window .productWinList .item .title {
		font-size: 30rpx;
		color: #999;
		padding: 0 30rpx;
	}

	.product-window .productWinList .item .listn {
		padding: 0 30rpx 0 16rpx;
	}

	.product-window .productWinList .item .listn .itemn {
		border: 1px solid #F2F2F2;
		font-size: 26rpx;
		color: #282828;
		padding: 7rpx 33rpx;
		border-radius: 40rpx;
		margin: 20rpx 0 0 14rpx;
		background-color: #F2F2F2;
	}

	.product-window .productWinList .item .listn .itemn.on {
		@include main_color(theme);
		@include coupons_border_color(theme);
		@include cate-two-btn(theme);
	}

	.product-window .productWinList .item .listn .itemn.limit {
		color: #999;
		text-decoration: line-through;
	}

	.product-window .cart {
		margin-top: 50rpx;
		margin-bottom: 30rpx;
		padding: 0 30rpx;
	}

	.product-window .cart .title {
		font-size: 26rpx;
		color: #999;
		flex: 1;
	}

	.product-window .cart .carnum {
		height: 54rpx;
	}

	.product-window .cart .carnum view {
		// border: 1px solid #a4a4a4;
		width: 84rpx;
		text-align: center;
		height: 100%;
		line-height: 54rpx;
		color: #282828;
		font-size: 45rpx;
	}

	.product-window .cart .carnum .reduce {
		border-right: 0;
		border-radius: 6rpx 0 0 6rpx;
		line-height: 48rpx;
	}

	.product-window .cart .carnum .reduce.on {
		// border-color: #e3e3e3;
		color: #DEDEDE;
		font-size: 44rpx;
	}

	.product-window .cart .carnum .plus {
		border-left: 0;
		border-radius: 0 6rpx 6rpx 0;
		line-height: 46rpx;
	}

	.product-window .cart .carnum .plus.on {
		border-color: #e3e3e3;
		color: #dedede;
	}

	.product-window .cart .carnum .num {
		background: rgba(242, 242, 242, 1);
		color: #282828;
		font-size: 28rpx;
		border-radius: 12rpx;
		line-height: 29px;
		height: 54rpx;

		input {
			display: -webkit-inline-box;
		}
	}

	.product-window .joinBnt {
		font-size: 30rpx;
		width: 620rpx;
		height: 86rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 86rpx;
		color: #fff;
		margin: 21rpx auto 0 auto;
	}

	.align-baseline {
		align-items: baseline;
	}

	.bg_color {
		@include main-bg_color(theme);
	}

	.product-window .joinBnt.on {
		background-color: #bbb;
		color: #fff;
	}

	.align-center {
		align-items: center;
	}

	.vip_icon {
		width: 44rpx;
		height: 28rpx;
	}

	.vip_money {
		background: #FFE7B9;
		border-radius: 4px;
		font-size: 22rpx;
		color: #333;
		line-height: 28rpx;
		text-align: center;
		padding: 0 6rpx;
		box-sizing: border-box;
		margin-left: -4rpx;
	}

	.pl-2 {
		padding-left: 20rpx;
	}
</style>