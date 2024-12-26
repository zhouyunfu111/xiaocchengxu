<template>
	<view class="photo-upload">
		<view class="upload-main">
			<view class="order-no u-flex">
				<text>订单编号</text>
				<view class="text-input">
					<input v-model="orderNumber" placeholder="请输入订单编号" />
				</view>
			</view>
			<view class="upload">
				<view class="title">
					<view>上传照片</view>
					<text class="tips">*请上传包含完整货物及门头的照片，需要用水印相机拍摄，图片需要包含位置时间信息</text>
				</view>
				<view class="upload-btn">
					<u-upload
						:fileList="fileList1"
						@afterRead="afterRead"
						@delete="deletePic"
						name="1" 
						multiple
						:maxCount="9"
					></u-upload>
				</view>
			</view>
		</view>
		<view class="submit-btn">
			<button @click="submit">确定</button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { frontSave } from '@/api/user.js'
	export default {
		data() {
			return {
				fileList1: [],
				EvUrl: '',
				orderNumber: '',
			}
		},
		computed:mapGetters(['token']),
		onLoad(){
			this.EvUrl = this.$config.HTTP_REQUEST_URL + '/api/front/upload/image?model=maintain&pid=0'
		},
		methods: {
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result.url
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: this.EvUrl, // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'multipart',				
						header: {
							// #ifdef MP
							"Content-Type": "multipart/form-data",
							// #endif
							['Authori-zation']: this.token
						},
						success: (res) => {
							resolve(JSON.parse(res.data).data)
						}
					});
				})
			},
			async submit() {
				if(!this.orderNumber) {
					return this.$u.toast('请输入订单编号!');
				}
				if(!this.fileList1.length){
					return this.$u.toast('请上传货物及门头照片!');
				}
				const params = { 
					orderNumber: this.orderNumber,
					deliveryImages: JSON.stringify(this.fileList1.map(item => item.url))
				}
				try{
					const data = await frontSave(params)
					this.showToast({type:'success',message:'操作成功'})
				}catch(e){
					//TODO handle the exception
				}
				
			},
			showToast(params) {
				this.$refs.uToast.show({
					...params,
					complete() {
						params.url && uni.navigateTo({
							url: params.url
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.photo-upload {
		padding: 30rpx;
		.upload-main {
			border-radius: 16rpx;
			background-color: #fff;
			padding: 30rpx 20rpx 12rpx;
		}
		.text-input {
			align-items: center;
			padding-left: 40rpx;
			flex:1;
		}
		.title{
			color: #333;
			font-size: 28rpx;
			margin-top: 64rpx;
			.tips {
				color: #C60203;
				font-size: 24rpx;
			}
		}
		.submit-btn {
			margin-top: 60rpx;
			button {
				border-radius: 16rpx;
				height: 82rpx;	
				background-color: #FF920F;
				line-height: 82rpx;
				color: #fff;
			}
		}
		.upload-btn {
			margin-top: 30rpx;
		}
	}
	
</style>