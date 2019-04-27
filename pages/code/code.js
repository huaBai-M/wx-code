import Toast from '../../dist/toast/toast';
// pages/code/code.js
//获取应用实例aa
var app = getApp();
var globalData = app.globalData;
// var Card={}
class Card {
  palette(views) {
    return ({
      width: '650rpx',
      height: '720rpx',
      borderRadius: '5rpx',
      background: '#fff',
      views: views,
    });
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardData: {},
    companyData: {},
    template: {},
    url:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //创建绘图对象

  },
  onImgOK(e) {
    this.imagePath = e.detail.path;
    console.log(e);
  },
  saveImage() {
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success:(res)=>{
        console.log(res)
        wx.showToast({
          title: '保存成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      }
    });
  },
  _image(index, win, hei, top, left, borderRadius, url) {
    return (
      {
        type: 'image',
        url: url,
        css: {
          width: `${win}rpx`,
          height: `${hei}rpx`,
          top: `${top}rpx`,
          left: `${left}rpx`,
          borderRadius: `${borderRadius}rpx`,
        },
      }
    );
  },
  _desLeft(index, content, top, left, fontsize, color) {
    const des = {
      type: 'text',
      text: content,
      css: {
        fontSize: `${fontsize}rpx`,
        color: color,
        top: `${top}rpx`,
        left: `${left}rpx`
      },
    };

    return des;
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
    var url = globalData.cardData.wxCardCode
    url = url.replace(/http/g, "https")
    console.log(url)
    let views1 = []
    views1.push(this._image(0, 500, 500, 80, 70, 5, url))
    views1.push(this._desLeft(0, '微信扫码此码，迅捷收取您的名片', 630, 108, 28, '#999999'))
    console.log(views1)
    this.setData({
      url: url
    })
    //结束
   
    this.downLoad(url)
  },
  downLoad (url) {
    var that = this;
    //缓存canvas背景图
    wx.downloadFile({
      url: url,//网络路径
      success:(res)=>{
        console.log(res);
        let views1 = []
        views1.push(this._image(0, 500, 500, 80, 70, 5, url))
        views1.push(this._desLeft(0, '微信扫码此码，迅捷收取您的名片', 630, 108, 28, '#999999'))
        this.setData({
          cardData: globalData.cardData,
          template: new Card().palette(views1),
        })
      }
    })
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

})
