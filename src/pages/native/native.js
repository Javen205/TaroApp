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
    let that = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    // 查看是否授权
    wx.getSetting({
      withCredentials: true,
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称 (如果没有授权直接返回失败)
          wx.getUserInfo({
            withCredentials: true,
            success(res) {
              console.log(res)
              let userInfo = res.userInfo;
              that.setData({
                userInfo: userInfo,
                hasUserInfo: true
              })
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
