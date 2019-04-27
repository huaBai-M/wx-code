import Toast from '../../dist/toast/toast';
//index.js
//获取应用实例aa
var app = getApp();
var globalData = app.globalData;
//  交换信息
var change = {
    tel: '',
    name: '',
    company: '',
    job: '',
    url: ''
};

Page({
    data: {
        change: change,
        trueOrFalse: true,
        visitthatIF: true,
        show: false,
        sideHide: true,
        white: false,
        renqi: true,
        dianzan: true,
        zhuanfa: true,
        //数据
        cardData: {}, //名片信息
        companyData: {}, //公司信息
        HotProduct: null, //推荐产品
        abtdisabled: false,
        catchtouch: false,
        phoneState: false, //电话是否授权
        phoneMessage: true, //点击信息页前是否授权
        stateShouQuan: app.globalData.phoneSates,
        hideProBtn: true, //推荐产品是否显示补位
        wxHeadUrl: '',
        loginState: 0,
        active: 0,
        icon: {
            normal: 'https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/xcxCode.png',
            active: 'https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/shareFa.png'
        },
        tjState: true,//推荐产品是否展示
        jsState: true,//公司介绍是否展示
        cardMian: '',
        allshow: false,
        bindWxCardEmployeeId: null,
        showOpetion: false,
        ifShowBtn:false

    },
    //onLoad事件处理函数
    onShow: function (str) {
        //   wx.hideTabBar();

        console.log("---------messageNumber--------")

        var that = this;
        globalData.iftoAccid = true;
        if (globalData.messageNumber != null) {
            wx.setTabBarBadge({
                index: 3,
                text: "" + globalData.messageNumber + ""
            })
        }
        let userData = wx.getStorageSync('userData');
        app.globalData.userInfo = userData;
        if (userData) {
            app.globalData.userData = userData;
            globalData.visitorId = userData.id
            that.funcData(that); //获取 名片，产品，用户信息
        } else {
            app.getWxUserInfo().then((res) => {
                wx.setStorageSync('userData', res.data.data);
                console.log("无访客id")
                console.log(res.data.data)
                if (res.data.data != null) {
                    globalData.visitorId = res.data.data.id
                }
                that.funcData(that); //获取 名片，产品，用户信息

            });
        }
        console.log('222222222222222222')
        console.log(globalData.openid)
        if (globalData.openid != undefined) {
            wx.request({
                url: globalData.webRequsetUrl + '/weixin/getVisitor',
                data: {
                    openId: globalData.openid
                },
                success(res) {
                    console.log(res)
                    if (res.data.data != null) {
                        that.setData({
                            loginState: res.data.data.loginState,
                            bindWxCardEmployeeId: res.data.data.bindWxCardEmployeeId
                        })
                        globalData.registState = res.data.data.registState//是否付费  0=未注册 1=已注册 2=试用 ,
                        console.log(res.data.data.loginState)
                        globalData.bindWxCardEmployeeId = res.data.data.bindWxCardEmployeeId
                        if (res.data.data.loginState == 1) {
                            that.setData({
                                ifShowBtn: true
                            })
                        }
                        console.log(that.data.ifShowBtn)
                        // if (that.data.allshow) {
                        //     that.setData({
                        //         trueOrFalse: false
                        //     })
                        // console.log(that.data.trueOrFalse)
                        // } 
                        console.log(globalData.bindWxCardEmployeeId)
                    }

                }
            });
        }

        console.log(globalData.bindWxCardEmployeeId)
        console.log('222222222222222222')
    },
    onLoad: function (options) {
        this.setData({
            cardMian: globalData.cardMian
        })
        console.log(wx.getStorageSync('userData'))
        let session_key = wx.getStorageSync('session_key');
        console.log(session_key)
        console.log("进入index---------------------");

        // if (globalData.messageNumber==null){

        // }
        if (JSON.stringify(options) != '{}' && JSON.stringify(options) != undefined) {
            app.globalData.companyId = options.companyId
            app.globalData.wxCardEmployeeId = options.wxCardEmployeeId
        }
        console.log(JSON.stringify(options))
        console.log(options)
        console.log("--------------------------")
        console.log("--------------------------")
        // console.log(app.globalData);
        // app.getWxUserInfo()
        //   app.getWxUserInfo().then((res) => {
        //     app.globalData.visitorId = res.data.data.id;
        //       //雷达记录
        //     console.log(that)
        //     that.funcData(that); //获取 名片，产品，用户信息
        //     console.log("568522566")
        //   });
        // that.funcData(that);

    },
    catchtouch: function () {
        return this.data.catchtouch
    },
    //显示或隐藏名片信息
    showHide(e) {
        var that = this;
        var trueOrFalse = that.data.trueOrFalse;
        if (trueOrFalse) {
            that.setData({
                trueOrFalse: false
            })
        } else {
            that.setData({
                trueOrFalse: true
            })
        }
    },
    onClose(e) {
        this.setData({
            show: false
        });
    },
    changeHide(e) {
        this.setData({
            show: false
        });
        // this.catchtouch();
    },
    onShowChange(e) {
        var wxHeadUrlT = app.globalData.userInfo.avatarUrl;
        console.log("点击点击")
        this.setData({
            "wxHeadUrl": wx.getStorageSync('userData').avatarUrl
        })
        this.setData({
            show: true
        });
        // this.catchtouch();
    },
    // 显示隐藏侧边栏
    clickSide(e) {
        var that = this;
        that.setData({
            sideHide: false
        })
    },
    //留言
    clickBlue(e) {
        var that = this;
        // var white = that.data.white;
        that.setData({
            white: false
        })
        // if (!white) {
        //     console.log(white)
        // } else {
        //     that.setData({
        //         white: false
        //     })
        // }
        wx.switchTab({
            url: '/pages/recentchat/recentchat'
        })
    },
    //电话
    clickWhite(e) {

        this.setData({
            "white": true
        })
        console.log(this.data.white);
        wx.makePhoneCall({
            phoneNumber: this.data.cardData.telphone,
            success: res => {
                console.log(res)
            }
        })

        wx.request({
            url: globalData.webRequsetUrlT + '/radar/active',
            method: 'POST',
            data: {
                companyId: globalData.companyId, //公司id
                openId: globalData.openid,
                sfaCompanyId: globalData.sfaCompanyId,
                type: 1,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id 
                loginId: this.data.cardData.loginId,
                loginType: this.data.cardData.loginType
            },
            success: res => {
                console.log(res);
            }
        });
    },
    // 人气
    clickRenqi(e) {
        var that = this;
        that.setData({
            renqi: !this.data.renqi
        });
        console.log(this.data.cardData)
        console.log(this.data.companyData)
    },
    //点赞
    clickDianzan(e) {
        var that = this;
        that.setData({
            "abtdisabled": true
        })
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/actice/thumb',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
                employeeId: globalData.wxCardEmployeeId, //名片id
                visitorId: globalData.visitorId, //访客id
                loginId: that.data.cardData.loginId,
                loginType: that.data.cardData.loginType
            },
            success: res => {
                console.log(that.data.cardData.thumb);
                that.setData({
                    dianzan: !that.data.dianzan,
                    "abtdisabled": false
                })
            }
        });
    },
    // 点击跳到名片列表页面
    calling(e) {
        wx.redirectTo({
            url: '/pages/callLists/callLists',
        })
    },
    //更新交换名片name phone complay 
    nameval(res) {
        let typeVal = res.currentTarget.dataset.type;
        let value = res.detail.value;
        if (typeVal == "name") {
            this.setData({
                "change.name": value
            })
        } else if (typeVal == "phone") {
            this.setData({
                "change.tel": value
            })
        } else if (typeVal == "company") {
            this.setData({
                "change.company": value
            })
        } else if (typeVal == "job") {
            this.setData({
                "change.job": value
            })
        }
    },
    //拨打电话
    telerPhone(res) {
        let val = res.currentTarget.dataset.value
        //调取
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/active',
            method: 'POST',
            data: {
                companyId: globalData.companyId, //公司id
                openId: globalData.openid,
                sfaCompanyId: globalData.sfaCompanyId,
                type: res.currentTarget.dataset.type,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id 
                loginId: this.data.cardData.loginId,
                loginType: this.data.cardData.loginType
            },
            success: res => {
                console.log(res);
                wx.makePhoneCall({
                    phoneNumber: val
                })
            }
        });
    },
    //复制
    copy(res) {
        console.log(res.currentTarget.dataset.type);
        let val = res.currentTarget.dataset.value
        if (res.currentTarget.dataset.type == 5) {
            wx.setClipboardData({
                data: val,
                success: function (res) {
                    wx.getClipboardData({
                        success: function (res) { }
                    })
                }
            })
            return false
        }
        wx.setClipboardData({
            data: val,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) { }
                })
            }
        })

    },
    //不可滚动 
    //同步通讯录
    phoneOpen() {
        //调取
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/active',
            method: 'POST',
            data: {
                companyId: globalData.companyId, //公司id
                openId: globalData.openid,
                type: 2,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id 
                loginId: this.data.cardData.loginId,
                sfaCompanyId: globalData.sfaCompanyId,
                loginType: this.data.cardData.loginType
            },
            success: res => {
                console.log(res);
                wx.addPhoneContact({
                    firstName: this.data.cardData.name,
                    mobilePhoneNumber: this.data.cardData.telphone,
                    organization: this.data.companyData.company,
                })
            }
        });
    },
    //交换名片
    clickCard() {
        if (this.data.change.name == "" || this.data.change.tel == "") {
            Toast('内容不能为空');
            return false
        };
        if (!(/^1(3|4|5|7|8|6)\d{9}$/.test(this.data.change.tel))) {
            Toast('手机号码有误，请重填');
            return false;
        };
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/exchange',
            method: 'POST',
            data: {
                company: this.data.change.company, //公司名称 
                name: this.data.change.name, //姓名
                phone: this.data.change.tel, //电话
                title: this.data.change.job, //职位  
                companyId: globalData.companyId, //公司id 
                openId: globalData.openid,
                sfaCompanyId: globalData.sfaCompanyId,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id
                loginId: this.data.cardData.loginId,
                loginType: this.data.cardData.loginType
            },
            success: res => {
                console.log(res);
                this.changeHide();
                Toast('交换成功');
                // this.catchtouch();
            },
            erreor: err => {
                Toast('无法连接服务器');
            }
        });
    },
    //转发点击
    clickZhuanfa(e) {
        // this.setData({
        //   zhuanfa: false
        // })
    },
    //点击推荐产品跳转
    hotproductfun(res) {
        console.log(res)
        console.log(this.data.cardData.loginId)
        console.log(this.data.cardData.loginType)
        let products = JSON.stringify(res.currentTarget.dataset.value);
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/productVisit',
            method: 'POST',
            data: {
                wxCardProductId: res.currentTarget.dataset.value.id, //产品id 
                companyId: globalData.companyId, //公司id 
                openId: globalData.openid,
                sfaCompanyId: globalData.sfaCompanyId,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id 
                loginId: this.data.cardData.loginId,
                loginType: this.data.cardData.loginType
            },
            success: res => {
                console.log(res);
                wx.navigateTo({
                    url: '/pages/detail/detail?products=' + encodeURIComponent(products),
                });
            }
        });


    },
    //转发
    onShareAppMessage(ops) {
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/transfer',
            method: 'POST',
            data: {
                companyId: globalData.companyId, //公司id 
                forwardType: 0,
                type: 1,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id 
                loginId: this.data.cardData.loginId,
                sfaCompanyId: globalData.sfaCompanyId,
                loginType: this.data.cardData.loginType
            },
            success: res => {
                console.log(res);
                console.log('转发了++++首页+++名片');
            }
        });
        console.log(this.data.companyData)
        var employeeInfo = this.data.employeeInfo;
        if (ops.from === 'button') {
            // 来自页面内转发按钮
            // console.log(ops.target)
        }
        console.log()
        if (this.data.companyData == null) {
            this.setData({
                "companyData": {}
            })
        }
        var title = `您好，我是${this.data.cardData.company}公司的${this.data.cardData.name}，这是我的电子名片，请惠存~~`
        if (this.data.cardData.transferTitle == null || this.data.cardData.transferTitle == '' || this.data.cardData.transferTitle == undefined) {
        } else {
            title = this.data.cardData.transferTitle
        }
        return {
            title: title,
            path: `pages/index/index?companyId= ${globalData.companyId}&wxCardEmployeeId=${globalData.wxCardEmployeeId}`,
            success: res => {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
                this.setData({
                    zhuanfa: false
                })
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
    //记录进入index页面
    visitthat() {
        console.log(123588)
        wx.request({
            url: globalData.webRequsetUrlT + '/radar/visit',
            method: 'POST',
            data: {
                companyId: globalData.companyId, //公司id 
                openId: globalData.openid,
                wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
                wxCardVisitorId: globalData.visitorId, //访客id 
                loginId: this.data.cardData.loginId,
                sfaCompanyId: globalData.sfaCompanyId,
                loginType: this.data.cardData.loginType
            },
            success: res => {
                this.setData({
                    "visitthatIF": false
                })
                console.log(res);
            }
        });
    },
    funcData(that) {
        //获取名片信息
        let userData = wx.getStorageSync('userData');
        globalData.userInfo = userData
        // if (wx.getStorageSync('openid') == '') {
        //   console.log("没有openid");
        //   return false
        // }
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/getCardInfo',
            method: 'GET',
            data: {
                cardEmplyId: globalData.wxCardEmployeeId, //名片id
                companyId: globalData.companyId, //公司id
                openId: wx.getStorageSync('openid'),
                source: globalData.source
            },
            success: res => {
                // 新增
                console.log(res);
               globalData.sfaCompanyId = res.data.data.sfaCompanyId
                that.setData({
                    cardData: res.data.data,
                })

                globalData.cardData = res.data.data;
                console.log("**************")
                console.log(globalData.wxCardEmployeeId)
                if (globalData.bindWxCardEmployeeId == that.data.cardData.id) {
                    that.setData({
                        allshow: true,
                        trueOrFalse: false
                    })
                } else {
                    that.setData({
                        allshow: false,
                        trueOrFalse: true
                    })
                }
                console.log(that.data.cardData);
                
                console.log(that.data.cardData.id)
                if (app.globalData.userInfo != null) {
                    var wxHeadUrlT = app.globalData.userInfo.avatarUrl;
                    that.setData({
                        'wxHeadUrl': wxHeadUrlT
                    })
                }

                // 新增结束
                // console.log(res)
                // globalData.wxCardEmployeeId = res.data.data.id

                this.setData({
                    dianzan: !res.data.data.thumb
                })
                console.log(this.data.cardData.thumb);
                this.setData({
                    "visitthatIF": true
                })
                if (globalData.visitorId != -1) {
                    this.visitthat(that);
                }
                console.log('进没进访客')
                console.log(globalData.bindWxCardEmployeeId)
                console.log(this.data.cardData.id)
                console.log('进没进访客')
                

                console.log('进没进访客')
                console.log(this.data.allshow)
                console.log('进没进访客')
                console.log(globalData.loginState)
                
            }
        });


        //获取公司信息
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/getCompanyInfo',
            method: 'GET',
            data: {
                companyId: globalData.companyId, //公司id
                openId: globalData.openid
            },
            success: res => {
                console.log("公司介绍")
                console.log(res.data.data)
                if (res.data.data == null) {
                    that.setData({
                        jsState: true
                    })
                } else {
                    globalData.companyData = res.data.data
                    that.setData({
                        companyData: res.data.data,
                        jsState: false
                    })
                }

            }
        });
        //获取推荐产品信息
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/getHotProduct',
            method: 'GET',
            data: {
                companyId: globalData.companyId, //公司id
                openId: globalData.openid
            },
            success: res => {
                console.log('tj');
                console.log(res.data.data.length)
                if (res.data.data.length == 0) {
                    that.setData({
                        tjState: true
                    })
                } else {
                    that.setData({
                        tjState: false,
                        HotProduct: that.arrHandle(res.data.data)
                    })
                    console.log(this.data.HotProduct.length)
                }

                //   if (that.data.HotProduct.length % 2 != 0) {
                //       that.setData({
                //             hideProBtn: true
                //         })
                //     }
            }
        });
    },
    //处理推荐产品函数
    arrHandle(arr) {
        const len = arr.length;
        var that = this;
        let result = []
        const sliceNum = 2;
        if (len % 2 != 0) {
            arr.push(arr[0])
        }

        for (let k = 0; k <= len - 1; k++) {
            arr[k].lastVisitImgs = JSON.parse(arr[k].lastVisitImgs);
        }
        for (let i = 0; i < len / sliceNum; i++) {
            result.push(arr.slice(i * sliceNum, (i + 1) * sliceNum))
        }
        return result;
    },
    // 交换名片前授权获取电话
    getPhoneNumber: function (e) {
        console.log(app.globalData.userInfo)
        console.log(wx.getStorageSync('userData'))
        this.setData({
            "wxHeadUrl": wx.getStorageSync('userData').avatarUrl
        })
        var that = this;
        that.setData({
            show: true
        });
        console.log(e.detail.encryptedData)
        if (e.detail.encryptedData != null) {
            wx.request({
                url: globalData.webRequsetUrl + '/weixin/card/actice/getWxBindPhone',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                data: {
                    openId: wx.getStorageSync('openid'),
                    sessionKey: wx.getStorageSync('session_key'),
                    encryptedData: e.detail.encryptedData,
                    iv: e.detail.iv
                    // fromType: 0,
                    // fromId: shopId,
                    // fromEmplyId: emplyId
                },
                success(res) {
                    console.log("5654646454")
                    console.log(wx.getStorageSync('openid'))
                    console.log(wx.getStorageSync('session_key'))
                    console.log(res)
                    var changeTel = 'change.tel';
                    app.globalData.phoneSates = true;
                    console.log(app.globalData.phoneSates)
                    that.setData({
                        [changeTel]: res.data.data,
                        phoneState: true,
                        stateShouQuan: app.globalData.phoneSates
                    })
                },

            })
        }

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
    //点击查看更多产品
    btnViewPro: function (e) {
        wx.switchTab({
            url: '/pages/products/products',
        })
    },
    erweima: function (e) {
        wx.navigateTo({
            url: '/pages/code/code',
        })
    },
    createdCard: function () {
        console.log(globalData.userData.id)
        wx.request({  //埋点
            url: globalData.webRequsetUrl + '/weixin/card/burialRecords',
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
                visitorId: globalData.userData.id,
                operationType: 5
            },
            success(res) {
                console.log(res)
            }
        })
        wx.navigateTo({
            url: '/pages/bangding/bangding',
        })
    },
    AIMat: function () {
        this.onClose2();
        wx.navigateTo({
            url: '/pages/AI/AI',
        })
    },
    onChangeTab(event) {
        console.log(event.detail);
        if (event.detail == 1) {
            wx.switchTab({
                url: '/pages/products/products'
            })
        } else if (event.detail == 2) {
            wx.switchTab({
                url: '/pages/video/video'
            })
        } else if (event.detail == 3) {
            wx.switchTab({
                url: '/pages/recentchat/recentchat'
            })
        } else {
            return false;
        }
    },
    navigateToMiniProgram() {
        var cardData = this.data.cardData;
        wx.navigateToMiniProgram({
            appId: 'wx2cc6c9258fa1659a',
            path: 'pages/index/index',
            extraData: {
                from: cardData
            },
            envVersion: 'develop',
            success(res) {
                // 打开其他小程序成功同步触发
                wx.showToast({
                    title: '跳转成功'
                })
            }
        })
    },
    msgUpdate: function () {
        this.onClose2();
        wx.navigateTo({
            url: '/pages/updateMsg/updateMsg?index=' + 'index',
        })
    },
    inMyCard: function () {
        var that = this;
        console.log(globalData.openid)
        wx.request({
            url: globalData.webRequsetUrl + '/weixin/card/login/findCardInfo',
            method: 'GET',
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
                openId: globalData.openid
            },
            success(res) {
                console.log(res)
                globalData.companyId = res.data.data.companyId;
                globalData.wxCardEmployeeId = res.data.data.id;
                console.log('点击进入我的名片------')
                console.log(globalData.companyId)
                console.log(globalData.wxCardEmployeeId)
                console.log('点击进入我的名片++++++++')
                that.funcData(that);
            }
        })
    },
    operation: function () {
        var that = this;
        that.onClose2();
        that.setData({
            showOpetion: true
        })
    },
    titleOpen: function () {
        Toast('更多精彩，敬请期待~');
        this.onClose2();
        // wx.navigateTo({
        //     url: '/pages/linkLine/linkLine',
        // })
    },
    onClose2: function () {
        var that = this;
        that.setData({
            showOpetion: false
        })
    },
    erweimaAdd:function(){
        wx.navigateTo({
            url: '/pages/newCard/newCard',
        })
    }
})