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
        code:'',
        codeReal:'',
        send: false,
        currentTime: 60,
        disabled: true
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
        wx.request({  //埋点
            url: globalData.webRequsetUrl + '/weixin/card/burialRecords',
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
                visitorId: globalData.userData.id,
                operationType: 0
            },
            success(res) {
                console.log('返回埋点')
                console.log(res)
            }
        })
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
            wx.request({  //埋点
                url: globalData.webRequsetUrl + '/weixin/card/burialRecords',
                method: 'GET',
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                data: {
                    visitorId: globalData.userData.id,
                    operationType: 1
                },
                success(res) {
                    console.log('发送验证码埋点')
                    console.log(res)
                }
            })
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
                        codeReal:res.data.data
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
        } else if (code!==that.data.codeReal){
            Toast('验证码不正确，请重新输入')
        }else{
            wx.request({
                url: globalData.webRequsetUrl + '/weixin/card/login/check',
                method: 'GET',
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                data: {
                    phone: phone,
                    openId: globalData.openid
                },
                success(res) {
                    console.log(res)
                    if(res.data.data == null ){
                        wx.reLaunch ({
                            url: '/pages/login/login?phone=' + phone,
                        })
                    }else{
                        console.log(res.data.data.loginState)
                        var loginState = res.data.data.loginState;
                        globalData.msgLogin = res.data.data;

                        console.log(globalData.msgLogin)

                        console.log(loginState)
                        globalData.loginState = loginState;
                        console.log('000000000000000000000')
                        console.log(globalData.loginState)
                        console.log('000000000000000000000')
                        wx.request({  //埋点
                            url: globalData.webRequsetUrl + '/weixin/card/burialRecords',
                            method: 'GET',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded' // 默认值
                            },
                            data: {
                                visitorId: globalData.userData.id,
                                operationType: 2
                            },
                            success(res) {
                                console.log('完成埋点')
                                console.log(res)
                            }
                        })
                        wx.navigateTo ({
                            url: '/pages/updateMsg/updateMsg?phone=' + phone +'&bangding='+'bangding',
                        })
                    }



                    // if (loginState == 0 || res.data.data == null) {
                    //     wx.navigateTo({
                    //         url: '/pages/login/login?phone=' + phone,
                    //     })
                    // }else{
                    //     wx.switchTab({
                    //         url: '/pages/index/index',
                    //     })
                    // }
                   
                }
            })
        }
    },
})