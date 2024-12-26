// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import store from "../store";
export function setThemeColor(){
	switch (store.state.app.theme) {
		case 'theme1':
			return '#BE1C1E';
			break;
		case 'theme2':
			return '#FE5C2D';
			break;
		case 'theme3':
			return '#42CA4D';
			break;
		case 'theme4':
			return '#1DB0FC';
			break;
		case 'theme5':
			return '#FF448F';
			break;
	}
}
  