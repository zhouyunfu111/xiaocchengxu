<template>
	<view class="shop-list">
		<view class="list" v-if="!!shopList.length" >
			<view class="list-item" v-for="item in shopList" :key="item.id" @click="toDetail(item.id)">
				<view class="item-header u-flex">
					<view class="item-img">
						<image :src="`${item.doorPic[0] ? item.doorPic[0] : '../../../static/images/my/shop.png'}`"  mode="aspectFill"  />
					</view>
					<view class="item-info u-flex">
						<view class="info-box">
							<view class="shop-head u-flex u-flex-between">
								<view class="title">
									{{item.shopName}}
								</view>
								<view class="status" :class="status[item.status]">
									{{['审核中','已审核','','审核不通过'][item.status]}}
								</view>
							</view>
							<view class="address">
								{{item.address}}
							</view>
						</view>
					</view>
				</view>
				<view class="item-bottom u-flex" v-if="item.status === 3">
					<view class="item-title">
						审核结果：
					</view>
					<view class="result-text">
						{{item.remark || '无'}}
					</view>
				</view>
			</view>
		</view>		
		<u-empty
			v-else
			mode="list"
			text="暂无门店"
			width="300"
			height="300"
			marginTop="80"
			icon="/static/images/my/no-shop.png"
		>
		</u-empty>
		<view class="add-shop">
			<navigator url="/pages/users/user_shop/index">新增门店信息</navigator>
		</view>
	</view>
</template>

<script>
	import { shopList } from '@/api/user.js';
	import {
		getAddressList,
	} from "@/api/user";
	export default {
		data () {
			return {
				status: {
					0:'waring',
					1:'success',
					3:'error'
				},
				shopList: []
			}
		},
		onShow(){
			this.getShopList()
			this.getAddressList()
		},
		methods: {
			async getShopList() {
				const {data:{list}} = await shopList()
				this.shopList = list.map(item => {
					return { ...item, doorPic: !!item.doorPic ? JSON.parse(item.doorPic) : []}
				})
			},
			getAddressList(){
				getAddressList().then(({data:{list}}) => {
					const shopName = list.find(item => item.isDefault)?.shopName ?? ''
					this.$store.commit('SET_SHOPLIST', list)
					this.$store.commit('SET_SHOP_NAME', shopName)
				})
			},
			toDetail(id) {
				uni.navigateTo({
					url: `/pages/users/user_shop/index?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shop-list {	
		.list{
			padding: 30rpx 30rpx 230rpx;
			overflow-y: auto;
		}
		.list-item {
			padding: 26rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-bottom: 30rpx;
			.item-img {
				margin-right: 32rpx;
				image {
					width: 140rpx;
					height: 140rpx;
					border-radius: 12rpx;
				}			
			}
			.item-info {
				flex: 1;
				padding-top: 12rpx;
				.info-box {
					flex:1;
				}
				.shop-head {
					display: flex;
					.title{
						color: #333;
						font-size: 32rpx;
						font-weight: 600;
					}			
				}
				.address{
					color: #999;
					font-size: 24rpx;	
					padding-top: 20rpx;
				}
				.status {
					height: 45rpx;			
					color: #fff;
					padding: 3rpx 16rpx;
					border-radius: 22rpx;
					margin-left: 38rpx;
					&.waring {
						background-color: #FF920F;
					}
					&.success{ 
						background-color: #09D82A;
					}
					&.error {
						background-color: #C60203;
					}
				}
			}
			.item-bottom {
				margin-top: 20rpx;
				.result-text {
					flex: 1;
					color: #999;
					font-size: 28rpx;
				}
				.item-title {
					padding-right: 30rpx;
				}
			}
		}
		.add-shop {
			position: fixed;
			bottom: 0rpx;
			left: 0;
			width: 100%;
			padding: 30rpx;
			height: 200rpx;
			background-color: #fff;
			navigator {
				width: 100%;
				height: 82rpx;
				color: #fff;
				line-height: 82rpx;
				border-radius: 16rpx;
				background-color: #FF920F;
				text-align: center;
				font-size: 32rpx;
			}
		}
	}
</style>