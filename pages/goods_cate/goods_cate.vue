<template>
	<view class="page" :data-theme="theme" :style="{height:winHeight + 'px'}">
		<cate v-show="currentPage == 'one'"></cate>
		<contracted v-show="currentPage == 'two'" ref="classTwo"></contracted>
		<optimization v-show="currentPage == 'three'" :showSlide="showSlide" ref="classThree"></optimization>
		<fresh v-show="currentPage == 'four'" :showSlide="showSlide" ref="classFour"></fresh>
		<pageFooter  v-if="footerShow"></pageFooter>
	</view>
</template>
<script>
	import pageFooter from '@/components/pageFooter/index.vue'
	import cate from './components/default_cate';
	import optimization from './components/optimization';
	import contracted from './components/contracted';
	import fresh from './components/fresh';
	import {getShare} from '@/api/public.js';
	import {mapGetters} from 'vuex';
	export default {
		data() {
			return {
				footerShow:true,
				currentPage:'one',
				showSlide:true,
				winHeight:'',
				configApi: {}, //分享类容配置
			}
		},
		computed: {
			...mapGetters(['isLogin', 'uid','theme'])
		},
		onLoad(){
			let that = this;
			let config = that.$Cache.getItem('categoryConfig');
			that.showSlide = config.isShowCategory == 'true'? true : false;
			switch (config.categoryConfig) {
				case '1':
					that.$set(that,'currentPage','one');
					break;
				case '2':
					that.$set(that,'currentPage','two');
					break;
				case '3':
					that.$set(that,'currentPage','three');
					// uni.hideTabBar()
					// this.footerShow=false
					break;
				case '4':
					that.$set(that,'currentPage','four');
					//uni.hideTabBar()
					//this.footerShow=false
					break;
			}
			uni.getSystemInfo({
			    success: function (res) {
			        that.winHeight = res.windowHeight;
			    }
			});
			// #ifdef H5
			that.shareApi();
			// #endif
		},
		onShow(){
			console.log(this.theme)
			switch (this.currentPage){
				case 'one':
					break;
				case 'two':
					break;
				case 'three':
					//uni.hideTabBar()
					this.footerShow=false
					setTimeout(()=>{
						if(this.isLogin){
							//登录的情况下获取模板3,4的购物车商品数量和列表
							this.$refs.classThree.getCartNum();
							this.$refs.classThree.getCartLists(1);
						}
					},500)
					break;
				case 'four':
					//uni.hideTabBar()
					console.log(this.footerShow)
					//this.footerShow=false
					setTimeout(()=>{
						if(this.isLogin){
							this.$refs.classFour.getCartNum();
							this.$refs.classFour.getCartLists(1);
						}
					},500)
					break;
			}
			uni.$off("updateCate")
			uni.$on("updateCate", () => {
				const classFourRef = this.$refs.classFour
				classFourRef.getGoodListAll()
			})		
		},
		components:{
			cate,optimization,contracted,fresh,pageFooter
		},
		methods:{
			shareApi: function() {
				getShare().then(res => {
					this.$set(this, 'configApi', res.data);
					// #ifdef H5
					this.setOpenShare(res.data);
					// #endif
				})
			},
			// 微信分享；
			setOpenShare: function(data) {
				let that = this;
				if (that.$wechat.isWeixin()) {
					let configAppMessage = {
						desc: data.synopsis,
						title: data.title,
						link: location.href,
						imgUrl: data.img
					};
					that.$wechat.wechatEvevt(["updateAppMessageShareData", "updateTimelineShareData"],
						configAppMessage);
				}
			},
		},
		onReachBottom(){
			if(this.currentPage=='two'){
				this.$refs.classTwo.getProductList();
			}
			if(this.currentPage=='three'){
				this.$refs.classThree.productslist();
			}
			if(this.currentPage=='four'){
				//console.log('onReachBottom')
				// console.log('onReachBottom')
				//this.$refs.classFour.productslist();
			}
		}
	}
</script>
<style lang="scss">
	.page{
		background: #fff;
		// overflow-y: auto;
	}
</style>