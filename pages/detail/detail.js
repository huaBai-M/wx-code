// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp();
var globalData = app.globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        products: [],
        proId: '',
        message: [],
        comName: [],
        phoneMessage:true,
        stateShouQuan: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
      globalData.iftoAccid = true;
    },
    onLoad: function(options) {
      console.log(options)
        var that = this;
        var products = decodeURIComponent(options.products)
        var displayImgs = JSON.parse(products).displayImgs;
        this.productVisit(JSON.parse(products).id)
        //设置html转换字符串--详情-富文本
        WxParse.wxParse('displayImgs', 'html', displayImgs, that, 0);
        that.setData({
            products: JSON.parse(products),
            stateShouQuan: options.stateShouQuan
        })
        console.log(that.data.stateShouQuan)
        that.getCompanyMessage(); //获取公司信息
        that.getCardMessage(); //获取名片信息

    },
    //获取公司信息
    getCompanyMessage: function(e) {
        var that = this;
        wx.request({
            url: app.globalData.webRequsetUrl + '/weixin/card/getCompanyInfo',
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              companyId: app.globalData.companyId,
                openId: app.globalData.userInfo.openId
            },
            success: function(res) {
                var message = res.data.data;
                // console.log(message)
                that.setData({
                    message: message
                })
            },
            fail: function(res) {
                console.log(res)
            }
        })
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
                cardEmplyId: globalData.wxCardEmployeeId, //名片id
                companyId: globalData.companyId, //公司id
                openId: globalData.userInfo.openId,
                source: globalData.source
            },
            success: function(res) {
               globalData.sfaCompanyId = res.data.data.sfaCompanyId
                var comName = res.data.data;
                // console.log(comName)
                that.setData({
                    comName: comName
                })
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },
    phoneCall(e) {
        var that = this;
        var phoneNumber = that.data.comName.displayPhone;
        
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/active',
            method: 'POST',

            data: {
                companyId: globalData.companyId, //公司id
                openId: globalData.userInfo.openId,
                type: 1,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id 
                loginId: that.data.comName.loginId,
                sfaCompanyId: globalData.sfaCompanyId,
                loginType: that.data.comName.loginType
            },
            success: res => {
                console.log(res);
                wx.makePhoneCall({
                    phoneNumber: phoneNumber
                })
            }
        });


    },
    toMessage: function(e) {
        wx.switchTab({
            url: '/pages/recentchat/recentchat',
        })
    },
    productVisit(id) {
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/actice/productVisit',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
                productId: id, //产品id 
                visitorId: globalData.visitorId //访客id 
            },
            success: res => {
                console.log("---------------------------");
                console.log(res);
            }
        });
    },
    // 跳转信息页面前授权获取电话
    getPhoneNumbers: function (e) {
        var that = this;
        wx.switchTab({
            url: '/pages/recentchat/recentchat'
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
                    app.globalData.phoneStates = true;
                    that.setData({
                        phoneMessage: false,
                        stateShouQuan: app.globalData.phoneStates
                    })
                    wx.switchTab({
                        url: '/pages/recentchat/recentchat',
                    })
                },

            })
        }

    }
})