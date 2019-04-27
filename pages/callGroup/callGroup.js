// pages/callGroup/callGroup.js
import Dialog from '../../dist/dialog/dialog';
var app = getApp();
var globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urls: ["http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg", "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg", "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg", "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg", "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg", "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg", "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg", "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg", "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"],
    timeShow: true,
    cardData: [],
    grounpData: {},
    start: "grounp",
    cardNameVal: '',
    hideSet: false
  },
  _pagesOne(val) {
    this.findByGroupId();
  },
  _rmg(val) {
    this.findByGroupId();
  },
  _openGroup() {

  },
  //修改函数
  modify() {
    globalData.grounpData = this.data.grounpData
    wx.redirectTo({
      url: '/pages/addCallGroup/addCallGroup',
    });
  },
  deleteGro(){ 
    this.setData({
      "hideSet":false
    })
    Dialog.confirm({
      title: '提示',
      message: '确定要删除当前分组么？'
    }).then(() => {
      // on confirm
      this.deleteGroup()
    }).catch(() => {
      this.setData({
        "hideSet":false
      })
      // on cancel
    });
  },
  BgClassFun(){
    this.setData({
      "hideSet": false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(globalData.groupId)
      this.setData({
        "grounpData.groupId": globalData.groupId
      });

    this.findByGroupId()
  },
  time(input) {
    if (input == null) {
      return ''
    }
    var d = new Date(input);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    return year + '-' + month + '-' + day + '/' + hour + ':' + minutes;
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
  //  this.CardByName('', this.data.grounpData.groupId, true);
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
  //查询
  findByGroupId(){
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/findByGroupId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorId,//访客Id
        groupId: this.data.grounpData.groupId,
      },
      success: res => {
        console.log(res);
        if (res.statusCode!=200){
          return false
        }
        let data = res.data.data.relations;
        let url = []
        for (let i in data) {
          data[i].visitTime = this.time(data[i].visitTime);
          if (data[i].headImageUrl == null || data[i].headImageUrl == '') {
            data[i].headImageUrl = "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
          }
          url.push(data[i].headImageUrl)
        }
        this.setData({
          cardData: data,
          grounpData: res.data.data,
          "urls": url
        })
      },
      fail: res => {
        console.log(res)
      }
    });   
  },
  
  //删除组
  deleteGroup() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/deleteGroup',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorId,//访客Id
        groupId: this.data.grounpData.groupId,
      },
      success: res => {
        console.log(res);
        wx.navigateBack({
          delta: 1
        })
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  topQuery: function () {
    var that = this;
    that.setData({
      timeShow: false
    })
    console.log("升序")
    this.CardByName('', this.data.grounpData.groupId, true);
  },
  downQuery: function () {
    var that = this;
    that.setData({
      timeShow: true
    })
    console.log("降序")
    this.CardByName('', this.data.grounpData.groupId, false);
  },
  search: function () {
    var that = this;
    console.log("搜索");
    this.CardByName(this.data.cardNameVal, this.data.grounpData.groupId, this.data.timeShow);
  },
  cardName(val) {
    console.log(val);
    this.setData({
      "cardNameVal": val.detail.value
    })
  },
  hideSet: function () {
    var that = this;
    that.setData({
      hideSet: !that.data.hideSet
    })
  },
  CardByName(cardName, groupId, isDesc) {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/findGroupCardByName',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorId,//访客Id
        cardName: cardName,
        groupId: groupId,
        isDesc: isDesc
      },
      success: res => {
        console.log(res);
        let data = res.data.data;
        let url = []
        for (let i in data) {
          data[i].visitTime = this.time(data[i].visitTime);
          if (data[i].headImageUrl == null || data[i].headImageUrl == '') {
            data[i].headImageUrl = "http://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/head.jpg"
          }
          url.push(data[i].headImageUrl)
        }
        this.setData({
          "cardData": data,
          "cardNameVal": '',
          "urls": url
        });
      },
      fail: res => {

        console.log(res)
      }
    });
  },
  onShareAppMessage(ops) {
    console.log(ops)
    var cardIndex = ops.target.dataset.cardIndex;
    console.log(this.data.cardData[cardIndex])
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      // console.log(ops.target)
    }
    var title = `您好，我是${this.data.cardData[cardIndex].company}公司的${this.data.cardData[cardIndex].emplyName}，这是我的电子名片，请惠存~~`
    if (this.data.cardData[cardIndex].transferTitle == null || this.data.cardData[cardIndex].transferTitle == '' || this.data.cardData[cardIndex].transferTitle == undefined) {
    } else {
      title = this.data.cardData[cardIndex].transferTitle
    }
    console.log(title)
    return {
      title: title,
      path: `pages/index/index?companyId= ${this.data.cardData[cardIndex].companyId}&wxCardEmployeeId=${this.data.cardData[cardIndex].cardId}`,
      success: res => {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        this.transfer()
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
        if (res.shareTickets) {
          // 获取转发详细信息  TODO  服务器解密
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success(res) {
              res.errMsg; // 错误信息
              res.encryptedData; // 解密后为一个 JSON 结构（openGId  群对当前小程序的唯一 ID）
              res.iv; // 加密算法的初始向量
              console.log('个人转发详情信息：' + JSON.stringify(res.encryptedData));

            },
            fail(res) {
              console.log(res)
            },
            complete() {
              console.log(res)
            }
          });
        }
      },
      fail(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }, 
})