const {
  add
} = require('../../utils/util')

Page({
  data: {
    add: add(1, 2),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    motto: 'Hello World',
    hasUserInfo: false,
    userInfo: {}
  },
  onLoad() {
    console.log("onLoad...")
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称 (不推荐使用)
          wx.getUserInfo({
            success(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },

  onShow() {
    console.log("onShow...")
  },

  onReady() {
    // console.log(this.selectComponent())
    // Do something when page ready.
    console.log("onReady...")
  },

  onHide() {
    console.log("onHide...")
  },

  onUnload() {
    console.log("onUnload...")
  },
  
  // Event handler.
  viewTap() {
    this.setData({
      motto: 'Hello World By Javen'
    }, function () {
      // this is setData callback
    })
  },
  getUserInfo(e) {
    let userInfo = e.detail.userInfo;
    console.log(userInfo)

    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
  }
})
