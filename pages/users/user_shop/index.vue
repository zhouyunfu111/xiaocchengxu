<template>
	<view class="user-shop">
		<view class="shop-from">
			<view class="item">
				<view class="title">企业名称</view>
				<view class="title-info">
					<input type="text" v-model="form.enterpriseName" class="uni-input"  placeholder="企业/商家/个体户营业执照上的名称" />
				</view>
			</view>
			<view class="item">
				<view class="title">门头名称</view>
				<view class="title-info">
					<input type="text" v-model="form.shopName" class="uni-input"  placeholder="请输入店铺名(门头名称)" />
				</view>
			</view>
			<view class="item">
				<view class="title">门店类型</view>
				<view class="title-info" @click="shopTypeVisible = true">
					<view class="picker line1">{{shopTypeList[form.type-1].label || '请选择门店类型'}}</view>
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title">法人姓名</view>
				<view class="title-info">
					<input type="text" class="uni-input" v-model="form.contacts"  placeholder="请输入法人/经营者姓名" />
				</view>
			</view>
			<view class="item">
				<view class="title">手机号码</view>
				<view class="title-info">
					<input type="number" name="phone" maxlength="11" @blur="getPhone" :value="form.mobile"  placeholder="请输入手机号码" ></input>
				</view>
			</view>
			<view class="item">
				<view class="title">门店位置</view>
				<view class="title-info" @click="changeMap">
					<input type="text" class="uni-input" v-model="userAddress.location" disabled placeholder="请选择" />
					<u-icon class="arrow-right" name="arrow-right" size="20" color="#333"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="title">所在地区</view>
				<view class="title-info u-flex" @click="cityVisible = true">
					<view class="picker line1">{{region[0]}}，{{region[1]}}，{{region[2]}}</view>
					<view class='iconfont icon-xiangyou abs_right'></view>
				</view>
			</view>
			<view class="item">
				<view class="title">详细地址</view>
				<view class="title-info">
					<input type="text" class="uni-input" name='detail' v-model="userAddress.detail"  maxlength="100" placeholder="请输入详细地址，包含楼号/门牌号等" />
				</view>
			</view>	
			<!-- <view class="shop-photo u-flex-column">
				<view class="shop-photo-title">
					<view>门头照片</view>
					<view class="info-error">
						*请上传真实的门头照片正面门脸照，完整显牌匾
					</view>
				</view>
				<view class="upload-btn" >
					<u-upload
						:fileList="fileList1"
						@afterRead="afterRead"
						@delete="deletePic"
						name="1"
						multiple
						:maxCount="9"
					>	
					</u-upload>
				</view>
			</view> -->
			<!-- <view class="shop-photo u-flex-column">
				<view class="shop-photo-title">
					<view>店内照片</view>
					<view class="info-error">
						*请上传真实的店内环境照片
					</view>
				</view>
				<view class="upload-btn">
					<u-upload
						:fileList="fileList2"
						@afterRead="afterRead"
						@delete="deletePic"
						name="2"
						multiple
						:maxCount="9"
					></u-upload>
				</view>
			</view>	 -->
		</view>
		<view class="invite-code">
			<view class="title">邀请码</view>
			<view class="title-info">
				<input type="text" :disabled="!!id" v-model="form.inviteCode" class="uni-input"  placeholder="没有可不填" />
			</view>
		</view>
		<view class="submit-btn">
			<button  @click="$u.debounce(submit, 500)">提交审核</button>
		</view>
		<view v-show="showLoading" class="bg-fixed"></view>
		<u-picker :show="cityVisible" 
			ref="uPicker" 
			:columns="[multiArray[0],multiArray[1],multiArray[2]]" 
			immediateChange 
			@change="bindMultiPickerColumnChange"
			@confirm="bindRegionChange" 
			@cancel="cityVisible = false" 
			confirmColor="#FF920F">
		</u-picker>
		<u-picker :show="shopTypeVisible"
			:columns="[shopTypeList]"
			keyName="label"
			immediateChange 
			@confirm="bindShopTypeChange" 
			@cancel="shopTypeVisible = false" 
			confirmColor="#FF920F">
		</u-picker>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import {
		getCityList
	} from "@/utils";
	import { shopSave,shopDetail,shopUpdate } from '@/api/user.js'
	import {
		salesAreaListTree,
	} from '@/api/api.js';
	import {
		toLogin,
	} from '@/libs/login';
	let app = getApp();
	export default {
		data() {
			return {
				form: {
					shopName: '', //店铺名称
					enterpriseName: '', //企业名称
					mobile: '', //手机号码
					contacts: '', //联系人
					inviteCode: '', //邀请码
					latitude: '', //经度
					longitude: '' ,//纬度
					type: null, //门店类型
				},
				region: ['省', '市', '区'],
				valueRegion: [0,0,0],
				multiIndex: [0, 0, 0],
				district: [],
				multiArray: [],
				doorPic: [], // 门头照片
				indoorPic: [], //室内照片
				userAddress: {
					isDefault: false,
					detail: '',
					location: ''
				}, //地址详情
				EvUrl: '',
				showLoading: true,
				fileList1: [],
				fileList2: [],
				cityId: '',
				id: '',
				isSubmit: true,
				cityVisible: false,
				resolvePrivacyAuthorization: {},
				shopTypeList: [{label:'外卖',id:1},{label:'堂食',id:2},{label:'外卖加堂食',id:3}],
				shopTypeVisible: false
			}
		},	
		computed:mapGetters(['token','isLogin']),
		onLoad(options) {
			if (this.isLogin) {
				this.id = options.id || 0;
				uni.setNavigationBarTitle({
					title: options.id ? '修改门店' : '添加门店'
				})
				options.id && this.shopDetail();
			} else {
				uni.navigateTo({url:'/pages/users/wechat_login/index'})
			}		
			// 获取小程序二维码的邀请码
			if (options.scene) {
				let qrCodeValue = this.$util.getUrlParams(decodeURIComponent(options.scene));
				let mapeMpQrCodeValue = this.$util.formatMpQrCodeData(qrCodeValue);
				app.globalData.inviteCode = mapeMpQrCodeValue.inviteCode;
				this.form.inviteCode = mapeMpQrCodeValue.inviteCode;
			}
			
			this.EvUrl = this.$config.HTTP_REQUEST_URL + '/api/front/upload/image?model=maintain&pid=0'
		
		},
		onShow(){
			salesAreaListTree().then(res=>{
				this.district = res.data
				this.initialize();
			})		
		},
		methods: {
			async shopDetail() {
				const {data,data:{doorPic,indoorPic,latitude,longitude}} = await shopDetail(this.id);
				Object.assign(this.form, data);
				this.userAddress.detail = data.address;
				this.fileList1 = (JSON.parse(doorPic) || []).map(url => ({url,message:'',status:'success'}))
				this.fileList2 = (JSON.parse(indoorPic) || []).map(url => ({url,message:'',status:'success'}))
				this.userAddress.location = latitude + ',' + longitude;
				this.region = [data.province,data.city,data.district];
				this.cityId = data.cityId
			},
			getPhone(e) {
				this.form.mobile = e.detail.value
			},
			changeMap() {
				const Tips = this.$util.Tips
				this.$util.$L.getLocation(Tips).then(res=>{
					uni.chooseLocation({
						latitude: uni.getStorageSync('user_latitude'),
						longitude: uni.getStorageSync('user_longitude'),
						success: ({address,name,latitude,longitude}) => {
							this.form.latitude = latitude
							this.form.longitude = longitude
							this.userAddress.location = latitude + ',' + longitude;
						}
					})
				})
			},
			bindShopTypeChange({value}) {
				this.form.type = value[0].id
				this.shopTypeVisible = false
			},
			initialize: function() {
				let that = this,province = [],city = [],area = [];
				if (that.district.length) {
					let cityChildren = that.district[0].child || [];
					let areaChildren = cityChildren.length ? (cityChildren[0].child || []) : [];
					that.district.forEach(function(item,i) {
						province.push(item.name);
						if (item.name === that.region[0]) {
							that.valueRegion[0] = i
							that.multiIndex[0] = i
						}
					});
					that.district[this.valueRegion[0]].child.forEach((item,i)=>{
						city.push(item.name);
						if (that.region[1] == item.name) {
							that.valueRegion[1] = i
							that.multiIndex[1] = i
						}
					})
					that.district[this.valueRegion[0]].child[this.valueRegion[1]].child.forEach((item,i)=>{
						area.push(item.name);
						if (that.region[2] == item.name) {
							that.valueRegion[2] = i
							that.multiIndex[2] = i
						}
					})
					this.multiArray = [province, city, area]
				}
			},
			bindRegionChange: function(e) {
				let multiIndex = this.multiIndex,
				province = this.district[multiIndex[0]] || {
					child: []
				},
				city = province.child[multiIndex[1]] || {
					child: []
				},
				area = city.child[multiIndex[2]] || {
					cityId: 0
				},
				multiArray = this.multiArray,
				value = e.indexs;
				this.region = [multiArray[0][value[0]], multiArray[1][value[1]], multiArray[2][value[2]]]
				this.cityId = area.cityId;
				this.valueRegion = [0, 0, 0]
				this.cityVisible = false
				this.initialize();
			},
			bindMultiPickerColumnChange: function(e) {
				let that = this,
				column = e.columnIndex,
				value = e.index,
				currentCity = this.district[value] || {
					child: []
				},
				multiArray = that.multiArray,
				multiIndex = that.multiIndex;
				multiIndex[column] = value;
				const {
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				switch (column) {
					case 0:
						let areaList = currentCity.child[0] || {
							child: []
						};
						multiArray[1] = currentCity.child.map((item) => {
							return item.name;
						});
						multiArray[2] = areaList.child.map((item) => {
							return item.name;
						});
						picker.setColumnValues(1, multiArray[1])
						picker.setColumnValues(2, multiArray[2])
						break;
					case 1:
						let cityList = that.district[multiIndex[0]].child[multiIndex[1]].child || [];
						multiArray[2] = cityList.map((item) => {
							return item.name;
						});
						picker.setColumnValues(2, multiArray[2])
						break;
					case 2:
			
						break;
				}
				// #ifdef MP || APP-PLUS
				this.$set(this.multiArray, 0, multiArray[0]);
				this.$set(this.multiArray, 1, multiArray[1]);
				this.$set(this.multiArray, 2, multiArray[2]);
				// #endif
				// #ifdef H5
				this.multiArray = multiArray;
				// #endif
				this.multiIndex = multiIndex
				// this.setData({ multiArray: multiArray, multiIndex: multiIndex});
			},
			async submit() {
				const {mobile, shopName,enterpriseName,contacts,type} = this.form
				if (!enterpriseName){
					return this.$u.toast('请输入企业名称');
				}
				if (!shopName){
					return this.$u.toast('请输入店铺名(门头名称)');
				}
				if (!type){
					return this.$u.toast('请选择门店类型');
				}
				if (!contacts){
					return this.$u.toast('请输入法人/经营者姓名');
				}
				if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(mobile))) {
					return this.$u.toast('请输入正确的手机号码');
				}
				if(!this.userAddress.location) {
					return this.$u.toast('请选择门店位置');
				}
				if(!this.userAddress.detail) {
					return this.$u.toast('请填写门店的详细地址');
				}
				if(!this.cityId) {
					return this.$u.toast('请选择省市区');
				}
				// if(this.fileList1.length === 0) {
				// 	return this.$u.toast('请上传门头图片!');
				// }
				// if(this.fileList2.length === 0) {
				// 	return this.$u.toast('请上传店内图片!');
				// }		
				const params = {
					...this.form,
					address: this.userAddress.detail,
					province: this.region[0],
					cityId: this.cityId,
					city: this.region[1],
					district: this.region[2],
					doorPic: JSON.stringify(this.fileList1.map(item => item.url)),
					indoorPic: JSON.stringify(this.fileList2.map(item => item.url))
				}
				if(!this.isSubmit) return
				this.isSubmit = false	
				uni.showLoading({
					title: '后台处理中...'
				})
				const modifyAddressTips = () => {
					return new Promise((resolve,reject) => {
						uni.showModal({
							title:'提示',
							content:'地址需要详细到号、室，否则可能无法为您配送到位',
							confirmText:'修改一下',
							cancelText:'继续保存',
							confirmColor:'#FF920F',
							success: (res) => {
								if (res.confirm) {
									uni.hideLoading()
									this.isSubmit = true
								} else if (res.cancel) {
									resolve()
								}			
							}
						});
					})
				} 
				if(!this.userAddress.detail.includes('号') && !this.userAddress.detail.includes('室')) await modifyAddressTips.bind(this)()
				try {				
					this.id ? await shopUpdate(params) : await shopSave(params)
					uni.hideLoading()
					this.showToast({message: `${this.id ? '修改' : '新增'}门店成功`,type:'success',url: '/pages/users/user_shop_list/index'})
				} catch(e) {
					this.$u.toast(e)
					console.log(e)
				}
				this.isSubmit = true
			},
			showToast(params) {
				const pages = getCurrentPages().map(item => item.$page.fullPath);			
				this.$refs.uToast.show({
					...params,
					duration: 300,
					complete() {
						if(params.url && pages.indexOf('/pages/users/user_shop_list/index') !== -1){
							uni.navigateBack()
						} else {
							uni.redirectTo({
								url: params.url
							})
						}				
					}
				})
			},

			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			async afterRead(event) {
				console.log(event)
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
					let item = this[`fileList${event.name}`][fileListLen]
					try {
						const result = await this.uploadFilePromise(lists[i].url)			
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result.url
						}))
						fileListLen++
					} catch(data){
						this[`fileList${event.name}`].splice(fileListLen, 1)	
						//TODO handle the exception
					}
					
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: this.EvUrl, 
						filePath: url,
						name: 'multipart',				
						header: {
							// #ifdef MP
							"Content-Type": "multipart/form-data",
							// #endif
							['Authori-zation']: this.token
						},
						success: (res) => {
							const data = res.data ? JSON.parse(res.data) : {};
							if(data.code === 200){
								resolve(data.data);
							} else if([410000, 410001, 410002, 401].indexOf(data.code) !== -1){
								toLogin();
								reject(data);
							} else {
								this.$u.toast(data.message)
								reject(data)
							}				
						},
						fail:(res)=> {
							uni.showToast({
								title:"上传失败",
								icon:'error'
							})
							reject(res)
						}
					});
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.user-shop {
	  padding: 30rpx;
	  .shop-from {
		padding: 0 20rpx 30rpx;
		background-color: #fff;
		border-radius: 16rpx;
		.item {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 36rpx 32rpx 36rpx 0;
			border-bottom: 2rpx solid #F7F7F7;
			.title {
				width: 30%;
				font-size: 30rpx;
			}
			.picker {
				flex: 1;
			}
			.iconfont {
				font-size: 37rpx;
			}
			.title-info {
				display: flex;
				flex: 1;
				align-items: center;
				input {
					font-size: 28rpx;
					color: #333;
					flex: 1;
					padding-right: 10rpx;
				}
				/deep/ .u-icon {
					width: 32rpx;
					height: 32rpx;
				}
			}
			&:last-child{
				border-bottom: 0;
				padding-bottom: 0;
			}
		}
		
		.shop-photo {
			display: flex;
			padding: 30rpx 32rpx 22rpx 0;
			.info-error {	
				color: #C60203;
				font-size: 24rpx;
				margin-top: 6rpx;
			}
			.upload-btn {
				margin-top: 30rpx;
			}
			&:last-child {
				padding-top: 0 !important;
			}
		}
		.slot-btn {
			width: 25%;
			height: 160rpx;
			background-color: #ECECEC;
			border-radius: 12rpx;
			display: flex;
			text-align: center;
			/deep/ .u-icon {
				margin: 40rpx auto 0;
				display: block;
			}
		}
		.pre-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
			.pre-item {
				flex: 0 0 25%;
				border-radius: 10rpx;
				height: 160rpx;
				overflow: hidden;
				position: relative;
				margin-bottom: 20rpx;
				.pre-item-image {
					width: 100%;
					height: 140rpx;
				}
			}
		}
	  }
	  .invite-code {
			margin-top: 30rpx;
			border-radius: 16rpx;
			background-color: #fff;
			padding: 20rpx 30rpx;
			display: flex;
			align-items: center;
			.title {
				width: 30%;
			}
			.title-info {
				color: #999;
			}
			.upload-btn {
				margin-top: 30rpx;
			}
	  }
	  .submit-btn  {
			margin-top: 60rpx;
			button {
				background-color: #FF920F;
				color: #fff;
				height: 82rpx;
				line-height: 82rpx;
				border-radius: 16rpx;
				font-size: 32rpx;
			}
			button[loading]{
				color: hsla(0, 0%, 100%, .6);
				background-color: #f58804
			}
	  }
	  .picker-view {
	  	width: 750rpx;
	  	height: 600rpx;
	  	margin-top: 20rpx;
	  }
	  .picker-item {
	  	line-height: 100rpx;
	  	text-align: center;
	  }
	}
	
	
	// .bg-fixed{
	// 	width: 100%;
	// 	height: 750rpx;
	// 	position: absolute;
	// 	top: 0;
	// 	background-color: rbga(0,0,0,0.3);
	// }


</style>