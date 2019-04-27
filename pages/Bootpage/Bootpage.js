// pages/Bootpage/Bootpage.js
var app = getApp();
var globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: null,
    isShow: false,
    dataId: null,
    test: "aaa"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      "dataId": options
    })
    let userData = wx.getStorageSync('userData');
    this.setData({
      "test": userData
    })
    if (userData) {
      this.setData({
        "userData": userData,
      })
      this.ifUrl(options)
      console.log(this.data.userData)
    } else {
      this.getWxUserInfo().then((res) => {
        console.log(res)
        if (res.data.status == 500) {
          console.log(res.data.msg);
          if (res.data.msg == "无访客信息") {
            globalData.visitorinformation = true;
            this.ifUrl(options);
          }
          // wx.redirectTo({
          //   url: '/pages/Propaganda/Propaganda',
          // })
        } else {
          wx.setStorageSync('userData', res.data.data)
          this.setData({
            "userData": res.data.data,
          });
          this.ifUrl(options);
        }

      }).catch((err) => {
        this.setData({
          "test": err,
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("结束")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取用户信息判断是否授权
  getSettingSync() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {

          // // 已经授权
          // wx.getUserInfo({
          //   success: res => {
          //     console.log("已经授权");
          //     console.log(res)
          //   },
          //   error: err => {
          //     console.log(err)
          //   }
          // })
        } else {
          console.log('未授权');
          wx.hideTabBar({})
          this.setData({ isShow: true });
        }
      }
    })
  },
  //点击授权
  getUserInfoResult: function (e) {
    //授权成功后处理 ： 展示tabbar 隐藏modal
    if (e.detail.userInfo) {
      this.setData({ isShow: false });
      wx.showTabBar({})
      let data = e.detail.userInfo
      this.userMessageSave(data);
    }

  },
  // 保存用户信息
  userMessageSave(data) {
    const that = this;
    wx.request({
      url: app.globalData.webRequsetUrl + '/weixin/save',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        avatarUrl: this.data.userData.avatarUrl,
        cityw: data.city,
        country: data.country,
        id: null,
        gender: data.gender,
        nickName: data.nickName,
        openId: globalData.openid,
        province: data.province,
        source: globalData.source,
        companyId: app.globalData.companyId,
        cardId: app.globalData.wxCardEmployeeId,
      },
      success(res) {
        console.log(res)
      }
    })
  },
  //判断url
  ifUrl(e) {
    if (this.data.userData == null) {
    } else {
      globalData.visitorId = this.data.userData.id
    }
    console.log(e.scene)
    if (e.scene != undefined) {
      //扫码进入
      console.log("扫码进入")
      console.log(e)
      var urlDataArr = decodeURIComponent(e.scene);
      urlDataArr = urlDataArr.split("A")
      globalData.companyId = urlDataArr[0];
      globalData.wxCardEmployeeId = urlDataArr[1];
      globalData.cardEmplyId = urlDataArr[1];
      globalData.source = 2;
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (globalData.eAppT.query.companyId != undefined && globalData.eAppT.query.wxCardEmployeeId != undefined) {
      //转发进入
      console.log("转发进入")
      console.log(e)
      globalData.companyId = globalData.eAppT.query.companyId
      globalData.wxCardEmployeeId = globalData.eAppT.query.wxCardEmployeeId
      globalData.cardEmplyId = globalData.eAppT.query.wxCardEmployeeId;
      globalData.source = 0;
      if (e.url == undefined) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        wx.switchTab({
          url: '/pages/recentchat/recentchat',
        })
      }
      // this.cardfun()
    } else if (e.companyId != undefined && e.wxCardEmployeeId != undefined) {
      //转发进入
      console.log("转发进入")
      globalData.companyId = e.companyId
      globalData.wxCardEmployeeId = e.wxCardEmployeeId
      globalData.cardEmplyId = e.wxCardEmployeeId;
      globalData.source = 0;
      console.log(e)
      if (e.url == undefined) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        wx.switchTab({
          url: '/pages/recentchat/recentchat',
        })
      }

      // this.cardfun()
    } else {
      console.log("搜索进入");
      // this.setData({
      //   "test": "ccc"
      // })
      console.log(this.data.userData)
      this.navigaeToCall(e)
      globalData.source = 3;
    }
  },
  //获取名片列表
  navigaeToCall(e) {
    console.log("1566")
    let visitorId = this.data.userData;
    if (visitorId == null) {
      visitorId = -1
    } else {
      visitorId = this.data.userData.id
      globalData.visitorId = this.data.userData.id
    }
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getRelation',
      method: 'GET',
      header: { 'content-type': 'application/x-www-form-urlencoded' }, // 默认值
      data: { pageNum: 1, visitorId: visitorId },
      success: res => {
        console.log("获取名片列表");

        console.log(res)
        if (res.data.data.length == 0) {
          wx.redirectTo({
            url: '/pages/Propaganda/Propaganda',
          })
        } else {
          wx.redirectTo({
            url: '/pages/callLists/callLists',
          })
        }
      },
      fail: res => {
        console.log(res);
        wx.redirectTo({
          url: '/pages/Propaganda/Propaganda',
        })
      }
    });
  },
  //回调函数
  getWxUserInfo() {
    const that = this
    return new Promise((resolve, reject) => {
      //获取openid
      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              url: globalData.webRequsetUrl + '/weixin/code',
              data: {
                code: res.code
              },
              success(res) {
                wx.setStorageSync('openid', res.data.data.openid)
                globalData.openid = res.data.data.openid
                wx.request({
                  url: globalData.webRequsetUrl + '/weixin/getVisitor',
                  data: {
                    openId: res.data.data.openid
                  },
                  success(res) {
                    resolve(res);
                    // app.globalData.visitorId = res.data.data.id
                  },
                  fail: res => {
                    console.log(res);
                    wx.redirectTo({
                      url: '/pages/Propaganda/Propaganda',
                    })
                  }
                });
              }
            })
          }
        }
      });
    });
  },
})