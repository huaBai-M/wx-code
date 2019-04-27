var wxCharts = require('../../utils/wxcharts-min.js');
import Dialog from '../../dist/dialog/dialog';
// pages/AI/AI.js
var app = getApp();
var globalData = app.globalData;
var lineChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    white: true,
    activeNum: 0,
    activeChartNum: 0,
    windowWidth: 0,
    windowHeight: 0,
    aiReportForm: false,
    aiRecord: [],
    timeX: [],
    maxchartsData: 0,
    chartsData: [],
    activeCharData: [],
    changeCall: 0,
    callTel: 0,
    talkCall: 0,
    saveCall: 0,
    viewDatas: [{
      img: "http://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/aiReportForm/icon1@2x.png",
      name: "查看名片",
      count: 0,
      type: "viewCard"
    },
    {
      img: "http://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/aiReportForm/icon2@2x.png",
      name: "查看产品",
      count: 0,
      type: "viewItem"
    },
    {
      img: "http://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/aiReportForm/icon3@2x.png",
      name: "转发名片",
      count: 0,
      type: "forwardCard"
    },
    {
      img: "http://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/aiReportForm/icon4@2x.png",
      name: "复制微信",
      count: 0,
      type: "copyWechat"
    },
    {
      img: "http://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/aiReportForm/icon5@2x.png",
      name: "查看短视频",
      count: 0,
      type: "viewMV"
    },
    {
      img: "http://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/aiReportForm/icon6@2x.png",
      name: "短视频点赞",
      count: 0,
      type: "pickLikeMV"
    },
    {
      img: "http://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/aiReportForm/icon7@2x.png",
      name: "短视频分享",
      count: 0,
      type: "forwardMV"
    }
    ],
    aiReportFormTabList: [
      {
        h1: "浏览数",
        p: ""
      },
      {
        h1: "转发数",
        p: ""
      }, {
        h1: "客户数",
        p: ""
      }, {
        h1: "跟进数",
        p: ""
      }, {
        h1: "点赞数",
        p: ""
      }, {
        h1: "咨询数",
        p: ""
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //判断是否为免费用户
    if (globalData.registState == 1) {
      this.setData({
        aiReportForm: true
      })
    } else {
      this.setData({
        aiReportForm: false
      })
    }
    this.getAiRecord(0);
    this.getStatementDate(0)
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
    console.log(1247579)
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
  getDataYes() {
    this.setData({
      white: false
    })
    this.getAiRecord(1)
  },
  getDataAll() {
    this.setData({
      white: true
    })
    this.getAiRecord(0)
  },
  //点击进入详情页
  saveCalls(e) {
    let type = e.currentTarget.dataset.type;
    console.log(type);
    if (globalData.registState == 1) {
      wx.navigateTo({
        url: '/pages/AIHref/AIHref?openid=' + wx.getStorageSync('openid'),
      })
    } else {
      wx.navigateTo({
        url: '/pages/trajectory/trajectory?type=' + type,
      })
    }
  },
  opendialog() {
    Dialog.alert({
      title: '提示',
      closeOnClickOverlay: "true",
      message: '需要使用数据报表等功能。请联系客服热线电话：   18811327384'
    }).then(() => {
      // on close
    });
  },
  //报表头部点击
  aiReportAbtEven(e) {
    this.setData({
      activeNum: e.target.dataset.index
    });
    if (e.target.dataset.index == 0) {
      this.getStatementDate(0)
    } else if (e.target.dataset.index == 1) {
      this.getStatementDate(1)
    } else if (e.target.dataset.index == 2) {
      this.getStatementDate(2)
    } else {

    }

  },
  aiReportchartAbtEven(e) {
    this.setData({
      activeChartNum: e.target.dataset.index
    });
    let name = e.target.dataset.name
    let activeCharData = this.data.activeCharData;
    let time = []
    let data = []
    //判断折线图点击
    if (this.data.activeChartNum == 0) {
      activeCharData = this.data.activeCharData.trendOfViewCardDays
    } else if (this.data.activeChartNum == 1) {
      activeCharData = this.data.activeCharData.trendOfForwardCardDays
    } else if (this.data.activeChartNum == 2) {
      activeCharData = this.data.activeCharData.trendOfClientDays
    } else if (this.data.activeChartNum == 3) {
      activeCharData = this.data.activeCharData.trendOfFollowDays
    } else if (this.data.activeChartNum == 4) {
      activeCharData = this.data.activeCharData.trendOfLikeDays
    } else if (this.data.activeChartNum == 5) {
      activeCharData = this.data.activeCharData.trendOfConsultDays
    }
    console.log(activeCharData)
    if (activeCharData != null) {
      if (activeCharData.length > 0) {
        for (let i in activeCharData) {
          time.push(activeCharData[i].dateOfDay)
          data.push(activeCharData[i].num)
        };
      } else {
        return false
      }
    }


    //更新折线图数据
    var simulationData = this.createSimulationData();
    var series = [{
      name: name,
      color: "#016bff",
      data: data,
      format: false
    }];
    lineChart.updateData({
      categories: time,
      series: series
    });
  },
  chartFun() {
    var windowWidth = 375;
    var windowHeight = 213;
    var arr = this.data.activeCharData;
    var maxT = Math.max.apply(null, arr);
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
      windowHeight = res.windowHeight - 440;
      this.setData({
        windowWidth: windowWidth,
        windowHeight: res.windowHeight - 465
      })
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '浏览数',
        color: "#016bff",
        data: simulationData.data,
        format: function (val, name) {
          return val;
        }
      }],
      xAxis: {
        disableGrid: false,
        min: 0
      },
      yAxis: {
        title: '',
        format: function (val) {
          // return val.toFixed(0)
          return val
        },
        min: 0
      },
      width: windowWidth,
      height: windowHeight,
      dataLabel: false,
      dataPointShape: false,
      extra: {
        lineStyle: 'curve'
      }
    });
    console.log(lineChart)
  },
  // chart
  touchHandler(e) {
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData() {
    let categories = this.data.timeX;
    let data = this.data.chartsData;

    return {
      categories: categories,
      data: data
    }


  },
  // chart 结束
  //获取AI雷达数据
  getAiRecord(type) {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getAiRecord',
      method: 'get',
      data: {
        openId: wx.getStorageSync('openid'),
        type: type,
      },
      success: res => {
        console.log(res);
        this.setData({
          aiRecord: res.data.data
        })
      },
    })
  },
  getStatementDate(type) {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getStatementDate',
      method: 'get',
      data: {
        openId: wx.getStorageSync('openid'),
        type: type,
      },
      success: res => {
        console.log(res);
        let time = [];
        let data = [];
        let aiReportFormTabList = [
          {
            h1: "浏览数",
            p: ""
          },
          {
            h1: "转发数",
            p: ""
          }, {
            h1: "客户数",
            p: ""
          }, {
            h1: "跟进数",
            p: ""
          }, {
            h1: "点赞数",
            p: ""
          }, {
            h1: "咨询数",
            p: ""
          },
        ];
        let activeCharData = null;
        //判断折线图点击
        if (this.data.activeChartNum == 0) {
          activeCharData = res.data.data.trendOfViewCardDays
        } else if (this.data.activeChartNum == 1) {
          activeCharData = res.data.data.trendOfForwardCardDays
        } else if (this.data.activeChartNum == 2) {
          activeCharData = res.data.data.trendOfClientDays
        } else if (this.data.activeChartNum == 3) {
          activeCharData = res.data.data.trendOfFollowDays
        } else if (this.data.activeChartNum == 4) {
          activeCharData = res.data.data.trendOfLikeDays
        } else if (this.data.activeChartNum == 5) {
          activeCharData = res.data.data.trendOfConsultDays
        }
        aiReportFormTabList[0].p = res.data.data.viewCardSum
        aiReportFormTabList[1].p = res.data.data.forwardCardSum
        aiReportFormTabList[2].p = res.data.data.clientSum
        aiReportFormTabList[3].p = res.data.data.followSum
        aiReportFormTabList[4].p = res.data.data.likeSum
        aiReportFormTabList[5].p = res.data.data.consultSum
        if (activeCharData != null) {
          if (activeCharData.length > 0) {
            for (let i in activeCharData) {
              time.push(activeCharData[i].dateOfDay)
              data.push(activeCharData[i].num)
            };
            this.setData({
              "timeX": time,
              "chartsData": data,
            })
            this.chartFun()
          }
        }


        this.setData({

          "aiReportFormTabList": aiReportFormTabList,
          "activeCharData": res.data.data
        });
      },
    })
  },
  // 跳转信息页面前授权获取电话
  getPhoneNumbers: function (e) {

    this.setData({
      "white": false
    })
    var that = this;
    wx.switchTab({
      url: '/pages/recentchat/recentchat',
    })
    if (e.detail.encryptedData != null) {
      wx.request({
        url: globalData.webRequsetUrl + '/weixin/card/actice/getWxBindPhone',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          openId: app.globalData.openid,
          sessionKey: wx.getStorageSync('session_key'),
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
          // fromType: 0,
          // fromId: shopId,
          // fromEmplyId: emplyId
        },
        success(res) {
          app.globalData.phoneSates = true;
          var changeTel = 'change.tel';
          that.setData({
            [changeTel]: res.data.data,
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
})
