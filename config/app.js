// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
//移动端商城API
//let domain = 'http://192.168.0.131:8081'
//let domain = 'http://192.168.0.120:8081'
// let domain = 'http://192.168.0.110:8081'
let domain = 'https://c.api.fanjunshi.com'
if (process.env.NODE_ENV === 'development') {
	domain = 'http://192.168.0.120:8081'
} 


module.exports = {
	// 请求域名 格式： https://您的域名
	// #ifdef MP || APP-PLUS
		// HTTP_REQUEST_URL:'',
		HTTP_REQUEST_URL: domain,
		// H5商城地址
		HTTP_H5_URL: 'http://h5.xxx,com',
	// #endif
	// #ifdef H5
		HTTP_REQUEST_URL:domain,
	// #endif
	HEADER:{
		'content-type': 'application/json'
	},
	HEADERPARAMS:{
		'content-type': 'application/x-www-form-urlencoded'
	},
	// 回话密钥名称 请勿修改此配置
	TOKENNAME: 'Authori-zation',
	// 缓存时间 0 永久
	EXPIRE:0,
	//分页最多显示条数
	LIMIT: 10
};
