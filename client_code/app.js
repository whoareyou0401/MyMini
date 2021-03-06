//app.js
var util = require('utils/util.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this
    // 登录
    wx.login({
      success: result => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.code = result.code
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              console.log('failed')
            }
          })
        } else {
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res
              console.log(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              wx.openSetting({
                success: (res) => {
                  /*
                  * res.authSetting = {
                  *   "scope.userInfo": true,
                  *   "scope.userLocation": true
                  * }
                  */
                  wx.login({
                    success: function () {
                      wx.getUserInfo({
                        withCredentials: true,
                        success: ress => {
                          // 可以将 res 发送给后台解码出 unionId
                          that.globalData.userInfo = ress
                          console.log(ress)
                          if (that.userInfoReadyCallback) {
                            that.userInfoReadyCallback(ress)
                          }
                        },
                        fail: res => {
                          console.log('获取不到')
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
    util.WXLogin()
  },

  globalData: {
    userInfo: null,
    baseUrl: "https://sharemsg.cn",
    // baseUrl: "http://sharemsg.cn:12348"
  }
})