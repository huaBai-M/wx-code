// pages/video/video.js
const app = getApp();
var globalData = app.globalData;
import formatDate from '../../utils/util1.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoData: [], //数据
        videoIndex: false,
        _index: null,
        status: true,
        state: false,
        states:true,
        page: 0,
        mask: true,
        red:true,//点赞
        videoId:'',
        comName:[],
        start:false,
        show:false,
        ifVideo:true,
        chuan:null,   //要传的页面参数
        videoNone:true,
        active: 2,
        icon: {
            normal: 'https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/xcxCode.png',
            active: 'https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/shareFa.png'
        },
        cardMian:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
      onLoad: function(options) {
      console.log(options)
      if (options.companyId != undefined && options.wxCardEmployeeId!=undefined) {
        app.globalData.companyId = options.companyId
        app.globalData.wxCardEmployeeId = options.wxCardEmployeeId
      }
      console.log(app.globalData.companyId)
      console.log(app.globalData.wxCardEmployeeId)
      console.log(app.globalData.visitorId)
        var that = this ;
        // that.getVideo();
        // that.getCardMessage();
        that.setData({
            cardMian: globalData.cardMian
        })
    },
    /**
         * 页面上拉触底事件的处理函数
         */
    onReachBottom: function () {
        var that = this;
        console.log(1111)
        // 显示加载图标
        wx.showLoading({
            title: '玩命加载中',
        })
      that.getVideo();
        if (that.data.status) {
            that.getVideo();
        } else {
            wx.hideLoading();
            return false;
        }

    },
    onShow:function(){
       var that = this ;
       that.setData({
           page:0,
           videoData:[]
       })
      app.globalData.iftoAccid = true;
       that.getVideo();
       that.getCardMessage();
        console.log(that.data.videoData.length)
        // if (that.data.videoData.length == 0) {
        //     that.setData({
        //         videoNone: false
        //     })
        // }
    },
    // 播放
    playVideo: function(e) {
        var that = this;
        var _index = e.currentTarget.id;
        var chuan = JSON.stringify(that.data.videoData[_index]);
        console.log(chuan)
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/actice/addVideoVisit',
            method: 'POST',
            data: {
                companyId: app.globalData.companyId,//公司id
                loginId: that.data.comName.loginId,
                loginType: that.data.comName.loginType,
                wxCardEmployeeId: globalData.wxCardEmployeeId,
                wxCardVideoId: that.data.videoData[_index].id,
                wxCardVisitorId: globalData.visitorId
            },
            success: res => {
                // 回调函数
                console.log(res);
                wx.navigateTo({
                  url: '/pages/play/play?chuan=' + chuan + "&indexS=" + _index,
                })
            }
        })
        
    },
    
    //获取短
      getVideo:function(e){
         var that = this ;
          that.data.page = that.data.page + 1;
         wx.request({
             url: globalData.webRequsetUrl + '/weixin/card/getVideoList',
             method: 'POST',
             data: {
                 companyId: app.globalData.companyId,//公司id
                 pageNum: that.data.page,
                 pageSize:6,
                 visitorId: globalData.visitorId
             },
             success: res => {
                 // 回调函数
                 console.log(res.data.data.videoList.length);
                 
                 var moment_list = that.data.videoData;
                //  console.log(res.data.data.videoList)

                 for (var i = 0; i < res.data.data.videoList.length; i++) {
                     res.data.data.videoList[i].createTime = formatDate.formatTime(res.data.data.videoList[i].createTime,'Y/M/D');
                     moment_list.push(res.data.data.videoList[i]);
                 }
                //  console.log(moment_list)
                 // 设置数据
                 that.setData({
                     videoData: moment_list
                 })
                 console.log(that.data.videoData)
                 console.log(that.data.videoData.length)
                 if (that.data.videoData.length == 0) {
                     that.setData({
                         videoNone: false
                     })
                 } else {
                     that.setData({
                         videoNone: true
                     })
                     if (res.data.data.videoList.length == 0) {
                         that.setData({
                             status: false,
                             state: true

                         })
                         console.log(that.data.videoNone)
                         wx.hideLoading();
                          return false;
                     } else {
                         console.log("ooooooooooooooo")
                         console.log(res.data.data.videoList.length)
                         that.setData({
                             ifVideo: false
                         })


                     }

                 }


                
                 // 隐藏加载框
                 wx.hideLoading();
                 
             }
         })
      },
    //获取名片信息
    getCardMessage: function (e) {
        var that = this;
        console.log(globalData.source)
        let userData = wx.getStorageSync('userData');
        let openid = wx.getStorageSync('openid');
        
        wx.request({
            url: app.globalData.webRequsetUrl + '/weixin/card/getCardInfo',
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                cardEmplyId: globalData.wxCardEmployeeId,//名片id
                companyId: globalData.companyId,//公司id
                openId: openid,
                source: globalData.source
            },
            success: function (res) {
               globalData.sfaCompanyId = res.data.data.sfaCompanyId
                var comName = res.data.data;
                that.setData({
                    comName: comName
                })
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    onChangeTab(event) {
        console.log(event.detail);
        if (event.detail == 0) {
            wx.switchTab({
                url: '/pages/index/index'
            })
        } else if (event.detail == 1) {
            wx.switchTab({
                url: '/pages/products/products'
            })
        } else if (event.detail == 3) {
            wx.switchTab({
                url: '/pages/recentchat/recentchat'
            })
        }
    }
})