import Toast from '../../dist/toast/toast';
var app = getApp();
var globalData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:0,
    page:1,
    type:"",
    timeAll:"七天内被查看的行为统计",
    time1:'',
    time2: '',
    t1show: false,
    t2show:false,
    show: false,
    currentDate1: new Date().getTime(),
    currentDate2: new Date().getTime(),
    dataAll:[]
  },
  openDia(){
    this.setData({
      show: true,
    });
  },
  openTime1(){
    this.setData({
      t1show: true,
      t2show: false,
    });
  },
  openTime2() {
    this.setData({
      t1show: false,
      t2show: true,
    });
  },
  confirm1(val){
    this.setData({
      t1show: false,
      t2show: false,
      currentDate1: val.detail,
      time1: this.timeFormat(val.detail)
    })
  },
  confirm2(val) {
    this.setData({
      t1show: false,
      t2show: false,
      currentDate2: val.detail,
      time2: this.timeFormat(val.detail)
    })
  },
  onClose() {

      if (this.data.time1 == '' || this.data.time2 == '') {
        Toast('请选择时间');
        this.setData({
          t1show: false,
          t2show: false,
          show: false,
          timeAll: "七天内被查看的行为统计"
        });
        return false
      }
      
      console.log(this.data.time1)
      console.log(this.data.time2)
      this.dataFun(this.data.time1, this.data.time2)
      
  },
  cancel(){
    //取消
    this.setData({
      show: false,
      t1show: false,
      t2show: false,
      time1: "",
      time2: "",
      timeAll: "七天内被查看的行为统计"
    });
  },
  delTime(){
    this.setData({
      timeAll:"七天内被查看的行为统计",
      time1: "",
      time2: "",
    });
    this.dataFun(this.getBeforeDate(7), this.getBeforeDate(1))
  },
  timeFormat(input){
    var d = new Date(input);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
    var hour = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    return year + '-' + month + '-' + day;
  },
  dataFun(begin,end){
    var _this=this
    wx.request({
      url: globalData.webRequsetUrl + '/weixin/card/getBehaviorTrack',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        openId: wx.getStorageSync('openid'),
        title: this.data.type,
        begin: begin,
        end: end,
        page: this.data.page,
        size:10
      },
      success(res) {
        if (res.status!=200){
          return false
        }
        let data = _this.data.dataAll;
        if (_this.data.time1 != '' || _this.data.time2!=''){
          _this.setData({
            show: false,
            t1show: false,
            t2show: false,
            timeAll: _this.data.time1 + "至" + _this.data.time2
          });
          _this.setData({
            total: res.data.data.sum,
            dataAll: data.concat(res.data.data.list)
          })
        }
       
        // console.log(_this.data.dataAll)
        console.log(res.data.data.list)
        wx.hideNavigationBarLoading();    //在当前页面隐藏导航条加载动画
        wx.stopPullDownRefresh();    //停止下拉动作
        // this.setData({
        //   dataAll:res.data
        // })
      },

    })
  },
  getBeforeDate(n) {
    var n = n;
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    if (day <= n) {
      if (mon > 1) {
        mon = mon - 1;
      }
      else {
        year = year - 1;
        mon = 12;
      }
    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    var s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    return s;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log(options);
    this.setData({
      type: options.type
    });
    console.log(this.getBeforeDate(1))
    console.log(this.getBeforeDate(7))
    this.dataFun(this.getBeforeDate(7), this.getBeforeDate(1))
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
    wx.showNavigationBarLoading(); //在当前页面显示导航条加载动画
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉");
    if(this.data.dataAll.length==this.data.total){
      return false
    }
    this.setData({
      page: this.data.page + 1
    });
    if(this.data.time1!=''||this.data.time2!=''){
      this.dataFun(this.data.time1, this.data.time2)
    }else{
      this.dataFun(this.getBeforeDate(7), this.getBeforeDate(1))
    }
   
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})