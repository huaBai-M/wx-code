// pages/products/products.js
//获取应用实例
const app = getApp();
var globalData = app.globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: [],
        productBanner: [], //获取产品banner
        sideHide: true,
        white: false,
        status: true,
        state: false,
        page: 0,
        comName: [],
        phoneMessage:true,
        stateShouQuan: app.globalData.phoneSates,
        productsNodes: [],
        active: 1,
        icon: {
            normal: 'https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/xcxCode.png',
            active: 'https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/shareFa.png'
        },
        loginState:0,
        cardMian:'',
        proState: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            cardMian: globalData.cardMian
        })
    },
    onShow:function(){
       globalData.iftoAccid = true;
       var that = this;
        that.getBanner();
        that.setData({
            page:0,
            products:[],
            stateShouQuan: app.globalData.phoneSates
        })
        that.proMessage();
        that.getCardMessage();
        
        console.log(that.data.page)
        if (globalData.openid != undefined) {
            wx.request({
                url: globalData.webRequsetUrl + '/weixin/getVisitor',
                data: {
                    openId: globalData.openid
                },
                success(res) {
                    console.log(res)
                    if (res.data.data != null) {
                        that.setData({
                            loginState: res.data.data.loginState
                        })

                        console.log(that.data.loginState)
                        
                    }

                }
            });
        }






        // this.setData({
        //     stateShouQuan: app.globalData.phoneSates
        // })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        var that = this;
        // 显示加载图标
        wx.showLoading({
            title: '玩命加载中',
        })
        if (that.data.status) {
            that.proMessage();
        } else {
            wx.hideLoading();
        }

    },
    //  获取产品信息
    proMessage: function(e) {
        var that = this;
        that.data.page = that.data.page + 1;
        console.log(that.data.page)
        wx.request({
            url: app.globalData.webRequsetUrl + '/weixin/card/getProduct',
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                pageNum: that.data.page,
                companyId: globalData.companyId, //公司id
                openId: app.globalData.userInfo.openId
            },
            success: function(res) {
                console.log('产品信息')
                console.log(res)
                // 回调函数
                var moment_list = that.data.products;
                
                for (var i = 0; i < res.data.data.length; i++) {
                    moment_list.push(res.data.data[i]);
                }
                // 设置数据
                that.setData({
                    products: moment_list,
                    productsNodes: moment_list
                })
                that.productsNodes();
                console.log('-----------');
                console.log(that.data.products.length);
                console.log('-----------');

                if (that.data.products.length == 0) {
                   that.setData({
                       proState: false
                   })
                } else {
                    that.setData({
                        proState: true
                    })
                    if (res.data.data.length == 0) {
                        that.setData({
                            status: false,
                            state: true
                        })
                        wx.hideLoading();
                        return false;
                    }
                }
                
                
                // 隐藏加载框
                wx.hideLoading();

            },
            fail: function(res) {
                console.log(res)
            }
        })
    },
    productsNodes:function(e){
        var that = this;
        var pro = this.data.productsNodes;
        for (var k in pro ){
            // console.log(that.docVal(pro[k].displayImgs))
            console.log(that.removeHTMLTag(pro[k].displayImgs))
            this.data.productsNodes[k].html = that.removeHTMLTag(pro[k].displayImgs)
        }
        this.setData({
            products: this.data.productsNodes
        })
        console.log(this.data.productsNodes)
    },
    //获取banner
    getBanner:function(e){
        var that = this;
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/getCompanyInfo',
            method: 'GET',
            data: {
                companyId: globalData.companyId, //公司id
                openId: globalData.userInfo.openId
            },
            success: res => {
                console.log(res)
                
                if (res.data.data==null){
                    that.setData({
                        bannerState:false
                    })
                }else{
                    var productBanner = JSON.parse(res.data.data.productBanner);
                    console.log('cccccccccccc');
                    that.setData({
                        productBanner: productBanner,
                        bannerState: true
                    })
                    console.log(that.data.productBanner);
                    console.log('cccccccccccc');
                }
                
            }
        });
    },
    // 点击产品
    clickPro: function(e) {
        var that = this;
        var stateShouQuan = that.data.stateShouQuan;
        var productIndex = e.currentTarget.dataset.productIndex
        var products = JSON.stringify(that.data.products[productIndex]);
        console.log(that.data.comName.loginId)
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/productVisit',
            method: 'POST',
            data: {
                wxCardProductId: that.data.products[productIndex].id, //产品id 
                companyId: globalData.companyId, //公司id
                sfaCompanyId: globalData.sfaCompanyId,
                openId: globalData.userInfo.openId,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id 
                loginId: that.data.comName.loginId,
                loginType: that.data.comName.loginType
            },
            success: res => {
                console.log(res);
                console.log('')
                wx.navigateTo({
                    url: '/pages/detail/detail?products=' + encodeURIComponent(products) + '&stateShouQuan=' + stateShouQuan,
                })
            }
        });

    },
    //获取名片信息
    getCardMessage: function(e) {
        var that = this;
        console.log(globalData.source)
        wx.request({
            url: app.globalData.webRequsetUrl + '/weixin/card/getCardInfo',
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }, 
            data: {
                cardEmplyId: globalData.wxCardEmployeeId, //员工id
                companyId: globalData.companyId, //公司id
                openId: app.globalData.userInfo.openId,
                source: globalData.source
            },
            success: function(res) {
              globalData.sfaCompanyId = res.data.data.sfaCompanyId
                var comName = res.data.data;
                console.log(comName)
                that.setData({
                    comName: comName
                })
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },
    // 显示隐藏侧边栏
    clickSide: function(e) {
        var that = this;
        that.setData({
            sideHide: false
        })
    },
    clickBlue: function(e) {
        var that = this;
        var white = that.data.white;
        if (!white) {
            // console.log(white)
        } else {
            that.setData({
                white: false
            })
        }
        wx.switchTab({
            url: '/pages/recentchat/recentchat',
        })
    },
    clickWhite: function(e) {
      this.setData({
        white: true
      })
      var that = this;
      console.log(that.data.comName)
      var phoneNumber = that.data.comName.displayPhone;
        
        wx.makePhoneCall({
          phoneNumber: that.data.comName.displayPhone,
          success: res => {
            console.log(res)
          }
        })
        
        console.log(phoneNumber);
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/active',
            method: 'POST',
            data: {
                companyId: globalData.companyId, //公司id
                openId: globalData.userInfo.openId,
                sfaCompanyId: globalData.sfaCompanyId,
                type: 1,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id 
                loginId: that.data.comName.loginId,
                loginType: that.data.comName.loginType
            },
            success: res => {
                console.log(res);
                // wx.makePhoneCall({
                //     phoneNumber: phoneNumber
                // })
            }
        });

    },
    // 跳转信息页面前授权获取电话
    getPhoneNumbers: function (e) {
        var that = this;
        wx.switchTab({
            url: '/pages/recentchat/recentchat'
        })
        this.setData({
          "white": false
        })
        if (e.detail.encryptedData != null) {
            wx.request({
                url: globalData.webRequsetUrl + '/weixin/card/actice/getWxBindPhone',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                data: {
                    openId: app.globalData.userInfo.openId,
                    sessionKey: app.globalData.userInfo.sessionKey,
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv
                    // fromType: 0,
                    // fromId: shopId,
                    // fromEmplyId: emplyId
                },
                success(res) {
                    app.globalData.phoneSates= true;
                    that.setData({
                        phoneMessage: false,
                        stateShouQuan: app.globalData.phoneSates
                    })
                    wx.switchTab({
                        url: '/pages/recentchat/recentchat',
                    })
                },

            })
        }

    },
    removeHTMLTag(str) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
        str = str.replace(/&nbsp;/ig, '');//去掉&nbsp;
        return str;
    },
    onChangeTab(event) {
        console.log(event.detail);
        if (event.detail == 0) {
            wx.switchTab({
                url: '/pages/index/index'
            })
        } else if (event.detail == 2) {
            wx.switchTab({
                url: '/pages/video/video'
            })
        } else if (event.detail == 3) {
            wx.switchTab({
                url: '/pages/recentchat/recentchat'
            })
        }
    }
})