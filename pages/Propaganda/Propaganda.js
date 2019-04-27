// pages/Propaganda/Propaganda.js
import Toast from '../../dist/toast/toast';
var app = getApp();
var globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/propaganda/banner_01.png',
      'https://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/propaganda/banner_02.png',
      'https://page-bucket.oss-cn-beijing.aliyuncs.com/wechat/mini-card/propaganda/banner_03.png',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    show: false,
    username: '',
    password: '',
    wordPhone:"",
    applyName: "",
    applyPhone: "",
    applyTest:"",
    experienceName: "",
    experiencePhone:"",
  },
  onClose(event) {
    if (event.detail === 'confirm') {
      // 异步关闭弹窗
      setTimeout(() => {
        this.setData({
          show: false
        });
      }, 1000);
    } else {
      this.setData({
        show: false
      });
    }
  },
  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  popup(){
    this.setData({
      "show":true
    })
  },
  nameTest(val){
    console.log(val)
    if (val.detail.value == '' && val.target.dataset.type==1){
      Toast('姓名不能为空');
      return false
    } else if (val.detail.value != '' && val.target.dataset.type == 1){
      this.setData({
        "applyName": val.detail.value
      })
      return false
    }
    if (val.target.dataset.type == 2) {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(val.detail.value))){
        Toast("手机号码有误，请重填");
        this.setData({
          "applyPhone":""
        })
        return false
      }else{
        this.setData({
          "applyPhone": val.detail.value
        })
        return false
      }
    } 

    if (val.target.dataset.type == 22) {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(val.detail.value))) {
        Toast("手机号码有误，请重填");
        this.setData({
          "experiencePhone": ""
        })
        return false
      } else {
        this.setData({
          "experiencePhone": val.detail.value
        })
        return false
      }
    } 

    if (val.target.dataset.type == 11) {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(val.detail.value))) {
        Toast("手机号码有误，请重填");
        this.setData({
          "wordPhone": ""
        })
      } else {
        this.setData({
          "wordPhone": val.detail.value
        })
      }
    } 
  },
  submitWork(){
    if (this.data.wordPhone==''){
      Toast("手机号码不能为空");
      return false
    };
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/official/saveConcact',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {
        openId: globalData.userInfo.openId,
        name:"",
        telphone: this.data.wordPhone
      },
      success: res => {
        Toast("提交成功");
        this.setData({
          "wordPhone": ""
        })
      }
    });
  },
  submitfoot() {
    if (this.data.applyPhone == '') {
      Toast("手机号码不能为空");
      return false
    };
    if (this.data.applyName == '') {
      Toast("姓名不能为空");
      return false
    };
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/official/saveConcact',
      method: 'POST',
      data: {
        openId: globalData.userInfo.openId,
        name: this.data.applyName,
        telphone: this.data.applyPhone
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success: res => {
        Toast("提交成功");
        this.setData({
          "applyPhone":"",
          "applyName":""
        })
      }
    });
  },
  submitexperiencePhone() {
    if (this.data.experiencePhone == '') {
      Toast("手机号码不能为空");
      return false
    };
    if (this.data.applyName == '') {
      Toast("姓名不能为空");
      return false
    };
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/official/saveConcact',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      data: {
        openId: globalData.userInfo.openId,
        name: this.data.applyName,
        telphone: this.data.experiencePhone
      },
      success: res => {
        Toast("提交成功");
        this.setData({
          "experiencePhone": "",
          "applyName": "",
          "show": false
        });
      }
    });
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

  }
})