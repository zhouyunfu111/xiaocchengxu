<template>
	<view >
		<view class="giveaway-list-window" :class='show ? "on" : ""' @touchmove.stop.prevent="() => {}">
			<view class="giveaway-title fjs-p-y-20 fjs-font-28 font-bold">选择{{giftData.activityType === 1 ? `赠品` : '商品'}}</view>	
			<scroll-view scroll-y  class="giveaway-goods-list">
				<u-checkbox-group
					v-model="value"
					placement="column"
					@change="groupChange"
				>
					<view class="goods-list-item flex" 
						v-for="(item,index) in storeFullInfoResList" 
						:key="item.attrValueId"
						@click="!disabled && checkboxClickItem(item)"
					>
						<u-checkbox
							:customStyle="{marginRight: '10px'}"
							placement="row"	
							shape="circle"
							:activeColor="activeColor"
							:name="item.attrValueId"
							:disabled="item.disabled"
						/>	
						<view class="item-goods-img">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="flex flex-column flex-row-between fjs-m-l-20" style="flex:1">
							<view class="item-title">
								{{item.productName}}
								<view class="unit-info color-info fjs-m-t-4 fjs-font-20">
									{{item.skuName}}
								</view>
							</view>
							<view class="item-tag flex flex-row-between">
								<view class="tag-box" v-if="giftData.activityType === 1">赠品</view>
								<view class="color-erro" v-else>{{item.fullPurchasePrice}}</view>
								<view class="tag-number">x1</view>
							</view>
						</view>
					</view>
				</u-checkbox-group>
			</scroll-view>
			<view class="giveaway-btns flex flex-row-end flex-align-center" v-if="!disabled">
				<view class="info-text fjs-m-r-20" >已选择{{value.length}}/{{giftData.fullNum}}</view>
				<view class="submit-btn flex flex-align-center flex-row-center" @click="submit">
					确定
				</view>
			</view>			
		</view>
		<view class='mask' catchtouchmove="true" :hidden='show == false' @click="close" @touchmove.stop.prevent="() => {}"></view>
	</view>
</template>

<script>
	import row from '../../uni_modules/uview-ui/libs/config/props/row';
	import { setThemeColor } from '@/utils/setTheme'
	export default {
		props: {
			show: {
				type: Boolean,
				default: () => false
			},
			giftData: {
				type: Object,
				default: () => {
					({
						storeFullInfoResList: [],
						fullNum: 0	
					})			
				}
			},
			disabled: {
				type: Boolean,
				default: () => false
			}
		},
		data() {
			return {
				value: [],
				activeColor: setThemeColor(),
				storeFullInfoResList: []
			};
		},
		watch: {
			disabled(newVal) {
				this.storeFullInfoResList.forEach(item => {
					item.disabled = (this.value.length === 0 || this.value.includes(item.attrValueId)) ? newVal : item.disabled;
				})
			},
			giftData() {
				this.storeFullInfoResList = this.giftData.storeFullInfoResList
			}
		},
		methods: {
			close() {
				this.$emit("update:show", false);
			},
			groupChange(row) {
				this.changeItemDisable(row)
			},
			submit() {
				const currendRow = this.storeFullInfoResList.filter(item => this.value.includes(item.attrValueId))
				this.$emit('submit', currendRow)
				this.close()
			},
			checkboxClickItem(item) {			
				const { attrValueId } = item || {}
				const findIndexName = this.value.findIndex(item => item === attrValueId)
				const fullNum = Number(this.giftData.fullNum) || 0;
				this.value.length < fullNum && (this.value = [...new Set([...this.value,attrValueId])])
				if(findIndexName > -1) {
					this.value.splice(findIndexName, 1)
				}
				this.changeItemDisable(this.value)
			},
			changeItemDisable(row) {
				const fullNum = Number(this.giftData.fullNum) || 0;
				const rowSet = new Set(row);
				this.storeFullInfoResList.forEach(item => {
					item.disabled = row.length >= fullNum && !rowSet.has(item.attrValueId);
				})			
			}
		}
	}
</script>

<style scoped lang="scss">
	.giveaway-list-window {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		border-radius: 16rpx 16rpx 0 0;
		z-index: 555;
		padding: 0 20rpx;
		padding-bottom: calc(constant(safe-area-inset-bottom)); ///兼容 IOS<11.2/
		padding-bottom: calc(env(safe-area-inset-bottom)); ///兼容 IOS>11.2/
		transform: translate3d(0, 100%, 0);
		transition: all .3s cubic-bezier(.25, .5, .5, .9); 
	}
	.giveaway-btns {
		background-color: #fff;
		border-top:2rpx solid #F7F7F7;
		margin: 0 -20rpx;
		box-shadow: 0px 0px 25rpx 2rpx rgba(206, 206, 206, 0.32);
		.submit-btn {
			width: 180rpx;
			height: 98rpx;
			background-color: #fa3534;
			color: #fff;
			text-align: center;
			font-size: 30rpx;
			justify-items: center;
		}
	}

	.giveaway-list-window.on {
		transform: translate3d(0, 0, 0);
	}
	.giveaway-goods-list {
		height: 823rpx;
		padding-bottom: 20rpx;
	}
	.giveaway-title {
		text-align: center;
		font-size: 32rpx;
	}
	
	.goods-list-item {
		background-color: #fff;
		padding: 26rpx 20rpx;
		border-radius: 18rpx;
		margin-bottom: 20rpx;
		.tag-box {
			border: 2rpx solid #fa3534;
			padding: 3rpx;
			color: #fa3534;
			border-radius: 6rpx;
			font-size: 24rpx;
		}
		&:last-child  {
			margin-bottom: 0;
		}
		.item-goods-img image {
			width: 148rpx;
			height: 148rpx;
			display: block;
			border-radius: 16rpx;
		}
	}

</style>