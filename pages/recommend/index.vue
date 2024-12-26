<template>
	<view class="menus-view">
		<scroll-view class="scroll-box" scroll-y @scrolltolower="onScroll" :style="{ height: height + 'px'}">
			<view class="goods-list">
				<view class="list-box" v-for="item in list" :key="item.id" @click="toDetail(item)">
					<view class="item-img">
						<image :src="item.pic"></image>
					</view>
					<view class="view-info">
						<view class="title u-line-1">
							{{item.name}}
						</view>
						<view class="desc u-line-2">
							{{item.description}}
						</view>
					</view>			
				</view>	
			</view>	
			<u-loadmore v-if="list.length > 0" :status="status" />
		</scroll-view>
	</view>
</template>

<script>
	import { foodMenuList } from '@/api/activity.js'
	export default {
		data(){
			return {
				list: [],
				params: {
					limit: 10,
					page:1,
					total: 0
				},
				type: 1,
				height: 0,
				status: 'loadmore',
			}
		},
		provide(){
			return {
				info: this.info
			}
		},
		onReady() {
			this.height = uni.getSystemInfoSync().windowHeight - 20
		},
		onLoad(params){		
			this.type = params.type || 1
			uni.setNavigationBarTitle({
				title: {1:'军师推荐',2:'食材分类'}[params.type || 1]
			})
			this.getList();
		},
		methods:{
			async getList() {
				this.status = 'loadmore';
				const {data} = await foodMenuList(this.type,this.params)
				if(this.params.page === 1){
					this.list = data.list
					this.list.length < this.params.limit && (this.status = 'nomore')
				} else {
					this.list = this.list.concat(data.list)
				}
				
				this.params.total = data.total
			},
			onScroll() {
				const { page,limit,total } = this.params
				if (page * limit > total){
					uni.showToast({
						title: '已经没有更多数据了',
						icon: 'none'
					});
					this.status = 'nomore';
					return;			
				}
				this.params.page++
				this.getList()
			},
			toDetail(item){
				this.$u.toast("敬请期待！")
				// uni.navigateTo({
				// 	url: `/pages/recommend/details?title=${item.name}`,
				// 	success:(res) =>{
				// 		res.eventChannel.emit('toDetails',item.info)
				// 	}
				// })
			}
		}
	}
</script>

<style lang="scss">
	.menus-view {
		padding:0 30rpx;
		height: 100vh;
		.goods-list {
			display: flex;
			flex-wrap: wrap;
			padding-top: 40rpx;
			margin: 0 -10rpx;
			
			.list-box{
				width: 50%;
				padding: 0 10rpx 30rpx;
				//margin-bottom: 30rpx;
			}
			.item-img {
				height: 300rpx;
				image {
					width: 100%;
					height: 300rpx;
					border-radius: 16rpx 16rpx 0rpx 0rpx;
				}
			}
			.view-info {
				padding: 12rpx 20rpx 36rpx; 
				background-color: #fff;
				border-radius: 0rpx 0rpx 16rpx 16rpx;
				.title {
					font-size: 32rpx;
					font-weight: 600;
					padding-bottom: 13rpx;
				}
				.desc {
					color: #666;
					font-size: 28rpx;
				}
			}
			.view-info {
				height: 180rpx;
			}
		}
		
	}
	
</style>