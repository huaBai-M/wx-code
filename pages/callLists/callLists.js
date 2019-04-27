var app = getApp();
var globalData = app.globalData;
import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    pageIndex: 1,
    active: 0,
    cardData: [],
    groupList: [],
    abtClass: true,
    columns: [],
    GroupIndex: null,
    userDataUrl:{}
  },
  //取消分组
  cancel() {
    this.setData({
      "show": false
    })
  },
  //选择分组名
  confirm(val) {
    console.log(val.detail.value);
    console.log(this.data.GroupIndex);
    this.toGroup(this.data.GroupIndex.visitorId, this.data.GroupIndex.relationId, val.detail.value.id)
    this.setData({
      "show": false
    })
  },
  //接收名片分组信息
  _openGroup(val) {
    this.setData({
      "GroupIndex": val.detail
    });
    if (this.data.columns.length > 0) {
      this.setData({
        "show": true 
      })
    } else {
      Toast('还没有创建分组');
    }

  },
  clearPopup(){
    this.setData({
      "show": false
    })
  },
  onChange(event) {
    console.log(event.detail);
  },
  _pagesOne() {
    this.setData({
      "pageIndex": 1
    });
    this.cardList()
  },
  _allGroup(val) {
    console.log(val.detail.groupId);
    console.log(val.detail.length);
    globalData.groupId = val.detail.groupId
    wx.navigateTo({
      url: '/pages/callGroup/callGroup?data=',
    });
    // Toast('没有内容');
  },
  _addGroup() {
    console.log(555);
    wx.navigateTo({
      url: '/pages/addCallGroup/addCallGroup',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //分享
  transfer(index) {
    wx.request({
      url: globalData.webRequsetUrlT + '/radar/active',
      method: 'POST',
      data: {
        companyId: this.data.cardData[index].companyId, //公司id
        type: 0, //访客转发
        forwardType: 0, //转发类型名片
        wxCardEmployeeId: this.data.cardData[index].cardId, //名片id
        wxCardVisitorId: globalData.visitorId, //访客id
        loginId: this.data.cardData[index].loginId,
        sfaCompanyId: this.data.cardData[index].sfaCompanyId,
        loginType: this.data.cardData[index].loginType
      },
      success: res => {
        console.log(res);
        // this.cardList()
      }
    });
  },
  onShareAppMessage(ops) {
    console.log(ops)
    var cardIndex = ops.target.dataset.cardIndex;
    //this.transfer(cardIndex)
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
        this.transfer(cardIndex)
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
  onClose() {
    this.setData({ show: false });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  activeAbt(val) {
    console.log(val.target.dataset.index)
    if (val.target.dataset.index == 0) {
      this.setData({
        "abtClass": true
      })
    } else {
      this.setData({
        "abtClass": false
      })
      this.findGroupCard()
    }
  },


  //添加到分组
  toGroup(visitorId, relationId, groupId) {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/toGroup',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: visitorId,//访客Id
        relationId: relationId,
        groupId: groupId
      },
      success: res => {
        console.log(res);
        wx.pageScrollTo({
          scrollTop: 0
        })
        this.cardList();
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  onClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail.index + 1}`,
      icon: 'none'
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.getWxUserInfo().then((res) => {
      app.globalData.visitorId = res.data.data.id;
      this.setData({
        "userDataUrl": res.data.data
      })
      //雷达记录
      this.cardList();
      this.findGroupCard();
    });
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
    console.log(125)
    this.setData({
      "pageIndex": this.data.pageIndex + 1
    })
    console.log(this.data.pageIndex)
    this.cardListT()
  },
  findGroupCard() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/group/findGroupCard',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        visitorId: globalData.visitorId//访客Id
      },
      success: res => {
        // console.log(res);
        // console.log(res.data.data)
        this.setData({
          "groupList": res.data.data
        });
        let columns = []
        for (var i in res.data.data) {
          columns.push({
            text: res.data.data[i].groupName, id: res.data.data[i].groupId
          })
        };
        console.log(columns);
        this.setData({
          "columns": columns
        })
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  //下拉获取名片
  cardListT() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getRelation',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        pageNum: this.data.pageIndex,
        visitorId: globalData.visitorId//访客Id
      },
      success: res => {
        let data = this.data.cardData;
        if (res.data.data.length != 0) {
          for (let i in res.data.data) {
            res.data.data[i].visitTime = this.time(res.data.data[i].visitTime)
            data.push(res.data.data[i])
          }
          this.setData({
            cardData: data
          })
        } else {
          this.setData({
            "pageIndex": this.data.pageIndex - 1
          })
        }
        console.log(this.data.cardData)
      },
      fail: res => {
        console.log(res)
      }
    });
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
  //首次获取名片
  cardList() {
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getRelation',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        pageNum: 0,
        visitorId: globalData.visitorId//访客Id
      },
      success: res => {
        if (res.data.data.length == 0) {
          wx.redirectTo({
            url: '/pages/Propaganda/Propaganda',
          })
        }
        let data = []
        for (let i in res.data.data) {
          res.data.data[i].visitTime = this.time(res.data.data[i].visitTime)
          data.push(res.data.data[i])
        }
        this.setData({
          cardData: data
        })
      },
      fail: res => {
        console.log(res)
      }
    });
  },
  /**
   * 用户点击右上角分享
   */

})