<template>
	<view class="privacy">
		<view class="privacy-wrapper">
			<u-radio-group class="radio" :value="checkName">
				<u-radio 
					@change="radioChange" 
					:name="name"
					:size="size"
					activeColor="#FF920F"
				>		
					<text @click="radioChange(name)">我已阅读并同意</text><navigator :url="`/pages/users/web_page/index?webUel=${agreementUrl}`">《饭军师用户协议》</navigator>和 
					<navigator :url="`/pages/users/web_page/index?webUel=${privacyUrl}`">《隐私协议》</navigator>
				</u-radio>
			</u-radio-group>	
		</view>
		<u-modal title="用户协议" :show="isShowPrivacy" :show-confirm-button="false" >
			<view class="slot-content">
				<view class="text">
					我已阅读并同意<navigator :url="`/pages/users/web_page/index?webUel=${agreementUrl}`">《饭军师用户协议》</navigator>和 
					<navigator :url="`/pages/users/web_page/index?webUel=${privacyUrl}`" style="display: inline">《隐私协议》</navigator>
				</view>		
				<view class="slot-button u-flex">
					<button class="canle" @click="$emit('update:isShowPrivacy', false)">拒绝</button>
					<button class="confirm" @click="agree">我同意</button>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		options: {
			styleIsolation: 'shared'
		},
		props: {
			value: {
				type: Boolean,
				default: false
			},
			name: {
				type: String,
				default: 'privacy'
			},
			size: {
				typeof: Number,
				default: 14
			},
			isShowPrivacy: {
				type: Boolean,
				default: false
			},
		},
		data(){
			return {
				agreementUrl: 'https://h5.fanjunshi.com/agreement.html',
				privacyUrl: 'https://h5.fanjunshi.com/privacy.html'
			}
		},
		computed:{
			checkName(){
				return this.value ? this.name : ''
			},
		},
		methods:{
			radioChange(name) {
				this.privacy = name
				this.$emit('update:value', true)
				this.$emit('radioChange')
			},
			agree() {      
				this.$emit('update:value', true)
				this.$emit('update:isShowPrivacy', false)
			}
		}
	}
</script>

<style lang="scss">
	.privacy-wrapper {
		position: fixed;
		bottom: 138rpx;
		width: 100%;
		display: flex;
		left: 0;
		justify-content: center;
		navigator {
			color: #002C9D;
		}
		::v-deep .u-radio-group {
			justify-content: center;
		}
	}
	
	
	.slot-content {
		font-size: 28rpx;
		width: 100%;
		margin-top: 46rpx;
		navigator {
			display: inline-block;
			color: #002C9D;
		}
	}
	/deep/ .u-modal__title  {
		border-bottom: 1px solid #F7F7F7;
		padding-bottom: 30rpx;
	}
	.slot-button {
		margin-top: 75rpx;
		button {
			width: 272rpx;
			height: 80rpx;
			border-radius: 40rpx;
			line-height: 80rpx;
			border-radius: 40rpx;
			margin: 0 12rpx;
		}
		.canle {
			background-color: #ECECEC;
			color: #999;
		}
		.confirm {
			background-color: #FF920F;
			color: #fff;
		}
	}
</style>