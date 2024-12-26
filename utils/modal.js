import {setThemeColor} from '@/utils/setTheme.js'
export default {
  // 消息提示
  msg(content) {
    uni.showToast({
      title: content,
      icon: 'none'
    })
  },
  // 错误消息
  msgError(content) {
    uni.showToast({
      title: content,
      icon: 'error'
    })
  },
  // 成功消息
  msgSuccess(content) {
    uni.showToast({
      title: content,
      icon: 'success'
    })
  },
  // 隐藏消息
  hideMsg(content) {
    uni.hideToast()
  },
  // 弹出提示
  alert(content, title) {
    uni.showModal({
      title: title || '提示',
      content: content,
      showCancel: false
    })
  },
  // 确认窗体
  confirm(option) {
    return new Promise((resolve, reject) => {
      uni.showModal({
		...option,
        title: option.title || '提示',
		confirmColor: setThemeColor(),
        success: function(res) {
          if (res.confirm) {
            resolve(res.confirm)
          } else {
			reject(res.confirm)
		  }
        }
      })
    })
  },
  // 提示信息
  showToast(option) {
    if (typeof option === "object") {
      uni.showToast(option)
    } else {
      uni.showToast({
        title: option,
        icon: "none",
        duration: 2500
      })
    }
  },
  // 打开遮罩层
  loading(content) {
    uni.showLoading({
      title: content,
      icon: 'none'
    })
  },
  // 关闭遮罩层
  closeLoading() {
    uni.hideLoading()
  }
}
