// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import {
	getUserInfo,
	computeUser
} from "../../api/user.js";
import {
	LOGIN_STATUS,
	UID,
	PLATFORM,
	BOTTOM_NAVIGATION_ISCUSTOM,
	USER_INFO,
	SHOP_LIST,
	OPENID,
	CURRENT_SHOP_NAME,
	THEME
} from '../../config/cache';
import Cache from '../../utils/cache';
import { getAddressList } from '@/api/user.js';

const state = {
	token: Cache.get(LOGIN_STATUS) || '',
	backgroundColor: "#fff",
	userInfo: Cache.get(USER_INFO) ? JSON.parse(Cache.get(USER_INFO)) : null,
	uid: Cache.get(UID) || null,
	openId: Cache.get(OPENID) || null,
	homeActive: false,
	chatUrl: Cache.get('chatUrl') || '',
	systemPlatform: Cache.get(PLATFORM) ? Cache.get(PLATFORM) : '',
	productType: Cache.get('productType') || '',
	shopList: Cache.get(SHOP_LIST, true) || [],
	currentShopName: Cache.get(CURRENT_SHOP_NAME) || '',
	bottomNavigationIsCustom: Cache.get('BOTTOM_NAVIGATION_ISCUSTOM') ? Cache.get('BOTTOM_NAVIGATION_ISCUSTOM') : false, //是否使用自定义导航
	theme: Cache.get(THEME) || 'theme1'
};

const mutations = {
	LOGIN(state, opt) {
		state.token = opt.token;
		Cache.set(LOGIN_STATUS, opt.token);
	},
	SETUID(state, val) {
		state.uid = val;
		Cache.set(UID, val);
	},
	SETOPENID(state, val) {
		state.openId = val
		Cache.set(OPENID, val);
	},
	UPDATE_LOGIN(state, token) {
		state.token = token;
		Cache.set(LOGIN_STATUS, token);
	},
	LOGOUT(state) {
		state.token = undefined;
		state.uid = undefined
		Cache.clear(LOGIN_STATUS);
		Cache.clear(UID);
		Cache.clear(USER_INFO);
		Cache.clear(SHOP_LIST);
		Cache.clear(OPENID);
		Cache.clear(CURRENT_SHOP_NAME)
		Cache.clear(THEME)
	},
	BACKGROUND_COLOR(state, color) {
		state.color = color;
		document.body.style.backgroundColor = color;
	},
	UPDATE_USERINFO(state, userInfo) {
		state.userInfo = userInfo;
		Cache.set(USER_INFO, userInfo);
	},
	OPEN_HOME(state) {
		state.homeActive = true;
	},
	CLOSE_HOME(state) {
		state.homeActive = false;
	},
	SET_CHATURL(state, chatUrl) {
		state.chatUrl = chatUrl;
	},
	SYSTEM_PLATFORM(state, systemPlatform) {
		state.systemPlatform = systemPlatform;
		Cache.set(PLATFORM, systemPlatform);
	},
	//更新useInfo数据
	changInfo(state, payload) {
		state.userInfo[payload.amount1] = payload.amount2;
		Cache.set(USER_INFO, state.userInfo);
	},
	//商品类型，用于区分视频号商品与一般商品
	PRODUCT_TYPE(state, productType) {
		state.productType = productType;
		Cache.set('productType', productType);
	},
	/** 是否使用自定义导航 **/
	BottomNavigationIsCustom: (state, bottomNavigationIsCustom) => {
		state.bottomNavigationIsCustom = bottomNavigationIsCustom
		Cache.set(BOTTOM_NAVIGATION_ISCUSTOM, bottomNavigationIsCustom);
	},
	SET_SHOPLIST(state, data) {
		state.shopList = data
		Cache.set(SHOP_LIST, data);
	},
	SET_SHOP_NAME(state,name){
		state.currentShopName = name
		Cache.set(CURRENT_SHOP_NAME, name);
	},
	SET_THEME(state,value){
		state.theme = value
		Cache.set(THEME, value)
	}
};

const actions = {
	USERINFO({
		state,
		commit
	}, force) {
		return new Promise(reslove => {
			getUserInfo().then(res => {
				commit("UPDATE_USERINFO", res.data);
				reslove(res.data);
			});
		}).catch(() => {
			commit("LOGOUT");
		});
	},
	
	GETADDRESSLIST({
		state,
		commit
	}) {
		return new Promise(reslove => {
			getAddressList().then(({data:{list}}) => {
				const shopName = list.find(item => item.isDefault)?.shopName ?? ''
				commit('SET_SHOPLIST', list)
				commit('SET_SHOP_NAME', shopName)
				reslove(list);
			});
		}).catch((e) => {
			rejcet(e)
		});
	}
};

export default {
	state,
	mutations,
	actions
};