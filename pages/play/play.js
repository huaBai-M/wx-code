var buttonClicked = require('../../utils/util1.js')
import formatDate from '../../utils/util1.js';
const app = getApp();
var globalData = app.globalData;

Page({
    data: {
        cover: "cover",
        videoId: "",
        src: "",
        videoInfo: {},
        userLikeVideo: false,
        commentsPage: 1,
        commentsTotalPage: 1,
        commentsList: [],
        placeholder: "说点什么...",
        red: true,
        chuan: null,
        comName: null,
        start: false,
        hiddenStop: false,
        ladeIf: true,
        buttonClicked: false,
        pages: 1,
        lastX: 0,          //滑动开始x轴位置
        lastY: 0,          //滑动开始y轴位置
        text: "没有滑动",
        currentGesture: 0, //标识手势
        leftImg:true
    },
    //滑动移动事件
    handletouchmove: function (event) {
        var currentX = event.touches[0].pageX
        var currentY = event.touches[0].pageY
        var tx = currentX - this.data.lastX
        var ty = currentY - this.data.lastY
        var text = ""
        //左右方向滑动
        if (Math.abs(tx) > Math.abs(ty)) {
            if (tx < 0)
                text = "向左滑动";
            else if (tx > 0)
                text = "向右滑动"

        }
        //上下方向滑动
        else {
            if (ty < 0)
                text = "向上滑动"
            else if (ty > 0)
                text = "向下滑动"
        }

        //将当前坐标进行保存以进行下一次计算
        this.data.lastX = currentX
        this.data.lastY = currentY
        this.setData({
            text: text,
        });
    },

    //滑动开始事件
    handletouchtart: function (event) {
        this.data.lastX = event.touches[0].pageX
        this.data.lastY = event.touches[0].pageY
    },
    //滑动结束事件
    handletouchend: function (event) {
        this.data.currentGesture = 0;
        console.log(this.data.text);
        if (this.data.text == '向左滑动') {
            this.setData({
                indexS: this.data.indexS + 1
            });
            this.getVideo();
            this.setData({
                leftImg:false
            })

        } 
        this.setData({
            text: "没有滑动",
            lastX: 0,
            lastY: 0,
        });
        this.videoStop();
    },
    videoCtx: {},
    getVideo() {
        var indexS = this.data.indexS;
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/getVideoList',
            method: 'POST',
            data: {
                companyId: globalData.companyId,//公司id
                pageNum: this.data.indexS,
                pageSize: 1,
                visitorId: globalData.visitorId
            },
            success: res => {
                // res.data.data.videoList[0].createTime = formatDate.formatTime(res.data.data.videoList[0].createTime, 'Y/M/D');
                var createTime = 'chuan.createTime';
                console.log(formatDate.formatTime(res.data.data.videoList[0].createTime, 'Y/M/D'))
                this.setData({
                    chuan: res.data.data.videoList[0],
                    [createTime]: formatDate.formatTime(res.data.data.videoList[0].createTime, 'Y/M/D')
                })
                console.log(this.data.chuan.createTime)
                console.log(this.data.chuan.thumb)
                if (this.data.chuan.thumb) {
                    this.setData({
                        red: false
                    })
                } else {
                    this.setData({
                        red: true
                    })
                }
                console.log(res.data.data.videoList)
            }
        })
    },
    onLoad: function (params) {
        console.log(JSON.parse(params.chuan))
        var that = this;
        that.setData({
            chuan: JSON.parse(params.chuan),
            indexS: parseInt(params.indexS)
        })
        that.getCardMessage();
        console.log(that.data.chuan)
        if (that.data.chuan.thumb) {
            that.setData({
                red: false
            })
        }
       
    },

    onShow: function () {
        // var me = this;
        // me.videoCtx.play();
        console.log("99999999999999999")
    },

    onHide: function () {
        // var me = this;
        // me.videoCtx.pause();
    },

    showSearch: function () {
        // wx.navigateTo({
        //     url: '../searchVideo/searchVideo',
        // })
    },

    vodeoLade(val) {
        this.setData({
            "ladeIf": false
        })
    },
    //点赞
    likeVideoOrNot: function (e) {
        var that = this;
        buttonClicked.buttonClicked(that);
        var totalThumb = that.data.chuan.totalThumb;
        var total1 = 'chuan.totalThumb';
        console.log(that.data.chuan.thumb)

        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/actice/videoThumb',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
                videoId: that.data.chuan.id,
                employeeId: globalData.wxCardEmployeeId,
                visitorId: globalData.visitorId,
                loginId: that.data.comName.loginId,
                loginType: that.data.comName.loginType
            },
            success: res => {
                console.log(res)
                if (that.data.red) {
                    that.setData({
                        red: !that.data.red,
                        [total1]: totalThumb + 1
                    })
                } else {
                    that.setData({
                        red: !that.data.red,
                        [total1]: totalThumb - 1
                    })
                }

            }
        })
    },
    //获取名片信息
    getCardMessage: function (e) {
        var that = this;
        console.log(globalData.source)
        wx.request({
            url: app.globalData.webRequsetUrl + '/weixin/card/getCardInfo',
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                cardEmplyId: globalData.wxCardEmployeeId,//名片id
                companyId: globalData.companyId,//公司id
                openId: app.globalData.userInfo.openId,
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
    //转发

    onShareAppMessage(ops) {
        var that = this;
        var videoId = that.data.chuan.id;
        // 添加段转发数
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/actice/addVideoTransfer',
            method: 'POST',
            data: {
                wxCardVideoId: videoId,
                companyId: globalData.companyId,
                wxCardVisitorId: globalData.visitorId,
                wxCardEmployeeId: globalData.wxCardEmployeeId,
                loginId: that.data.comName.loginId,
                loginType: that.data.comName.loginType
            },
            success: res => {
                console.log(res + '+1')

            }
        })
        //添加转发记录
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/videoTransfer',
            method: 'POST',
            data: {
                wxCardVideoId: videoId,
                type: 1,
                companyId: globalData.companyId,
                forwardType: 0,
                wxCardVisitorId: globalData.visitorId,
                wxCardEmployeeId: globalData.wxCardEmployeeId,
                loginId: that.data.comName.loginId,
                sfaCompanyId: globalData.sfaCompanyId,
                loginType: that.data.comName.loginType
            },
            success: res => {
                console.log(res + '转了')
            }
        })

        if (ops.from === 'button') {
            // 来自页面内转发按钮
            console.log(ops.target)
        }
        if (globalData.companyData == null) {
            globalData.companyData = {}
        }
        var title = `您好，我是${globalData.companyData.company}公司的${this.data.comName.name}，这是我的电子名片，请惠存~~`
        if (this.data.comName.transferTitle == null || this.data.comName.transferTitle == '' || this.data.comName.transferTitle == undefined) {
        } else {
            title = this.data.comName.transferTitle
        }
        return {
            title: title,
            path: `pages/video/video?companyId= ${globalData.companyId}&wxCardEmployeeId=${globalData.wxCardEmployeeId}`,
            success: res => {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));

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
    // 播放时暂停
    clickPush: function (e) {
        var that = this;
        var videoContext = wx.createVideoContext('myVideo');
        // videoContext.seek('myVideo');
        videoContext.pause();
        that.setData({
            start: true
        })
    },
    // 点击播放
    videoStop: function () {
        var that = this;
        that.setData({
            start: false
        })
        var videoContext = wx.createVideoContext('myVideo');
        videoContext.play();

    }
})