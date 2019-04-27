var app = getApp();
var globalData = app.globalData;
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持 
    },
    properties: {

    },
    data: {
      isShow: false,
      userData:null
    },
    methods: {
        //不可滚动 
        noneview() {
            return true
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
                        globalData.visitorinformation=true
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
               console.log("点击授权")
               console.log(data)
                this.userMessageSave(data);
            }

        },
      // 保存用户信息
      userMessageSave(data) {
            let openid = wx.getStorageSync('openid');
            const that = this;
            wx.request({
                url: app.globalData.webRequsetUrl + '/weixin/save',
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                data: {
                  avatarUrl: data.avatarUrl,
                    city: data.city,
                    country: data.country,
                    id: null,
                    gender: data.gender,
                    nickName: data.nickName,
                    openId: openid,
                    province: data.province,
                    source: globalData.source,
                    companyId: app.globalData.companyId,
                    cardId: app.globalData.wxCardEmployeeId,
                },
                success(res) {
                    console.log(app.globalData.visitorId)
                    console.log(res)
                    // wx.setStorageSync('userData', res.data.data)
                    var pages = getCurrentPages()    //获取加载的页面
                    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
                    var url = currentPage.route    //当前页面url
                    //获取访客ID
                    if (globalData.visitorinformation){
                      that.getWxUserInfo().then((res) => {
                          console.log("获取访客id")
                          console.log(res.data.data);
                          globalData.visitorId = res.data.data.id
                          wx.setStorageSync('userData', res.data.data);
                          that.setData({
                                "userData": res.data.data
                              });
                              if (url == "pages/index/index") {
                                that.visitthat()
                              }
                          });
                    }
                    
                }
            })
        },
      visitthat() {
        wx.request({
          url: globalData.webRequsetUrlT + '/radar/visit',
          method: 'POST',
          data: {
            companyId: globalData.companyId, //公司id 
            openId: globalData.openid,
            wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
            wxCardVisitorId: globalData.visitorId, //访客id 
            loginId: globalData.cardData.loginId,
            sfaCompanyId: globalData.sfaCompanyId,
            loginType: globalData.cardData.loginType
          },
          success: res => {
            console.log(res);
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
                      wx.request({
                        url: globalData.webRequsetUrl + '/weixin/getVisitor',
                        data: {
                          openId: res.data.data.openid
                        },
                        success(res) {
                          app.globalData.visitorId = res.data.data.id
                          app.globalData.loginState = res.data.data.loginState
                            app.globalData.bindWxCardEmployeeId = res.data.data.bindWxCardEmployeeId
                          resolve(res)
                        }
                      });
                    }
                  })
                }
              }
            });
          });
        },
    },
    //页面加载后..
    ready() {
      this.getSettingSync();
      // let userData = wx.getStorageSync('userData');
      // if (userData) {
      //   this.setData({
      //     "userData": userData
      //   })
      //   console.log(this.data.userData);
      //   this.getSettingSync();
      // } else {
      //   this.getWxUserInfo().then((res) => {
      //     console.log(0)
      //     wx.setStorageSync('userData', res.data.data)
      //     this.setData({
      //       "userData": res.data.data
      //     });
      //     this.getSettingSync();
      //   });
      // }
       
        
    }
})
