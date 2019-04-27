// pages/bangding/bangding.js
import Toast from '../../dist/toast/toast';
var app = getApp()
var globalData = app.globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        voteTitle: null,
        tel: '',
        code: '',
        codeReal: '',
        send: false,
        currentTime: 60,
        disabled: true,
        cardMian:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       var that = this;
       that.setData({
           cardMian: globalData.cardMian
       })
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

    },
    //验证码倒计时函数
    getCode: function (options) {
        var that = this;
        var currentTime = that.data.currentTime;
        var interval = setInterval(function () {
            that.setData({
                send: true,
                currentTime: (currentTime - 1)
            })
            currentTime--;
            if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                    send: false,
                    currentTime: 60
                })
            }
        }, 1000)
    },
    //验证码倒计时结束
    formName: function (e) {
        this.setData({
            tel: e.detail.value
        })
    },
    formCode: function (e) {
        this.setData({
            code: e.detail.value
        })
    },




    //获取验证码
    clickPost: function (e) {
        var that = this;
        var mobile = that.data.tel;
        if (!(/^1[34578]\d{9}$/.test(mobile)) || mobile.length > 11) {
            Toast('请输入正确的手机号')
        } else {
            that.getCode();
           
            wx.request({
                url: globalData.webRequsetUrl + '/weixin/card/getMobileCode',
                method: 'GET',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                data: {
                    mobile: mobile
                },
                success(res) {
                    console.log(res)
                    Toast("验证码已发送");
                    that.setData({
                        send: true,
                        codeReal: res.data.data
                    })
                }
            })
        }
    },
    // 点击绑定
    clickBang: function (e) {
        var that = this;
        var phone = that.data.tel;
        var code = that.data.code;
        console.log(that.data.codeReal)
        if (phone == '' || code == '') {
            Toast('请输入完整的手机号和验证码');
        } else if (code !== that.data.codeReal) {
            Toast('验证码不正确，请重新输入')
        } else {
            wx.navigateTo({
                url: '/pages/updateMsg/updateMsg?phone=' + phone,
            })
        }
    },
})