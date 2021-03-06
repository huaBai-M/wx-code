// pages/login/login.js
import Toast from '../../dist/toast/toast';
import Dialog from '../../dist/dialog/dialog';
var app = getApp();
var globalData = app.globalData;
var array = ['互联网/信息技术', '制造业', '贸易/批发/零售', '房地产业', '建筑业', '金融业', '服务业', '运输/物流/仓库', '教育行业', '文体/娱乐/传媒', '商业服务/租赁', '医疗医药', '政府/事业单位', '社会组织', '科研服务', '公共/环境', '居民服务', '开采业', '餐饮', '农/林/牧/渔', '电/热/燃气/水/供应', '其他行业'];
var array = [
    {
        text: '工业|制造|能源|化工', id: 1
    },
    {
        text: '机械|专用设备', id: 2
    },
    {
        text: '配件|五金工具', id: 3
    },
    {
        text: '包装|印刷|办公用品', id: 4
    },
    {
        text: '服装|纺织|配饰', id: 5
    },
    {
        text: '日用百货|家用电器', id: 6
    },
    {
        text: '会计|金融|银行|保险', id: 7
    },
    {
        text: '房地产|建筑|装潢', id: 8
    },
    {
        text: '媒体|广告,媒体|广告', id: 9
    },
    {
        text: '医疗保健,医疗保健', id: 10
    },
    {
        text: '批发|零售|代理商', id: 11
    },
    {
        text: '餐饮|旅游|休闲|娱乐|体育', id: 12
    },
    {
        text: '计算机|网络|通信|电子', id: 13
    },
    {
        text: '服务|教育|培训', id: 14
    },
    {
        text: '贸易|物流', id: 15
    },
    {
        text: '农林牧渔', id: 16
    },
    {
        text: '非营利性组织', id: 17
    }
]
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatar: "",
        username: '',
        phone: '',
        companyName: "",
        mail: '',
        job: '',
        wechat: '',
        region: ['北京市', '北京市', '东城区'],
        address: '',
        show: false,
        msgLogin: {},
        array: array,
        index: 0,
        productFirstId: array[0].id,
        trade: array[0].text,
        cardData: {},
        history: false,//是否显示出提示条件
        listsName: [],//提示条件
        sfaId: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        console.log(globalData.cardData)
        console.log(globalData.msgLogin)
      console.log(globalData.cardData.trade)
        this.setData({
            cardData: globalData.cardData,
            msgLogin: globalData.msgLogin,
            trade: globalData.cardData.trade,
            productFirstId: globalData.cardData.productFirstId
        })

        console.log(options.phone)
        if (options.index == 'index') {
            console.log('index')
            this.getUserInfo();
        } else if (options.bangding == 'bangding'){
            console.log('bangding')
            this.getUserInfoC();
            
        }else{
            console.log('genggai')
            this.getUserInfo();
        }
        if (options.phone == undefined) {
            console.log('noneShouji')
            this.setData({
                phone: this.data.cardData.telphone
            })
        } else {
            console.log('haveShouji')
            this.setData({
                phone: options.phone
            })
        }

    },
    //获取信息 
    getUserInfo: function () {
        var that = this;
        var cardData = that.data.cardData;
        var avatar = that.data.cardData.cardImageUrl == null ? globalData.userInfo.avatarUrl : that.data.cardData.cardImageUrl;
        var username = that.data.cardData.name == null ? globalData.userInfo.nickName : that.data.cardData.name;
        var region = '';
        for (var i in array) {
            if (array[i] == cardData.trade) {
                that.setData({
                    index: i
                })
            }
        }
        that.setData({
            avatar: avatar,
            username: username,
            companyName: cardData.company,
            mail: cardData.email,
            job: cardData.title,
            wechat: cardData.wechat,
            // trade: array[that.data.index],
            address: cardData.companyLocation
        })
    },
    //获取信息 ===创建进来
    getUserInfoC: function () {
        var that = this;

        var msgLogin = that.data.msgLogin;
        console.log(msgLogin)
        var avatar = that.data.msgLogin.cardImageUrl == null ? globalData.userInfo.avatarUrl : that.data.msgLogin.cardImageUrl;
        var username = that.data.msgLogin.name == null ? globalData.userInfo.nickName : that.data.msgLogin.name;
        var region = '';
        for (var i in array) {
            if (array[i].text == msgLogin.trade) {
                that.setData({
                    index: i
                })
            }
        }
        that.setData({
            avatar: avatar,
            username: username,
            companyName: msgLogin.company,
            mail: msgLogin.email,
            job: msgLogin.title,
            wechat: msgLogin.wechat,
            trade: array[that.data.index].text,
            address: msgLogin.companyLocation
        })
    },
    bindPickerChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        var trade = this.data.array[e.detail.value];
        console.log(trade)
        this.setData({
            index: e.detail.value,
            trade: trade.text,
            productFirstId: trade.id
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
    //昵称修改
    onChangeUsername(event) {
        // event.detail 为当前输入的值
        // console.log(event.detail);
        this.setData({
            username: event.detail
        })
    },
    //手机号修改
    onClickPhone(event) {
        // event.detail 为当前输入的值
        this.setData({
            show: true
        })
    },
    //手机号修改
    onChangePhone(event) {
        // event.detail 为当前输入的值
        // console.log(event.detail);

    },
    //公司名修改
    onChangeCompany(event) {
        // event.detail 为当前输入的值
        var that = this;
        console.log(event.detail);
        if(event.detail.length>=4){
            wx.request({
                url: globalData.webRequsetUrl + '/weixin/card/login/findSfaCustomerByName',
                method: 'GET',
                data: {
                    custName: event.detail
                },
                success(res) {
                    console.log(res.data.data)
                    if (res.data.data != null) {
                        if (res.data.data.length == 0) {
                            that.setData({
                                history: false,
                                companyName: event.detail,
                                sfaId: -1
                            })
                        } else {
                            that.setData({
                                listsName: res.data.data,
                                history: true
                            })
                        }
                    } else {
                        that.setData({
                            history: false,
                            listsName: []
                        })
                    }

                    console.log(that.data.listsName)
                },

            })
        }else{
            that.setData({
                companyName: event.detail,
                history: false
            })
        }
        console.log(that.data.companyName)
        // if (event.detail)
        //调用接口 返回不为空 设置可见
        //返回为空时 设置名字是输入的名字

    },
    //邮箱地址修改
    onChangeMail(event) {
        // event.detail 为当前输入的值
        // console.log(event.detail);
        this.setData({
            mail: event.detail
        })
    },
    //客户职位修改
    onChangeJob(event) {
        // event.detail 为当前输入的值
        // console.log(event.detail);
        this.setData({
            job: event.detail
        })
    },
    //微信修改
    onChangeWetChat(event) {
        // event.detail 为当前输入的值
        // console.log(event.detail);
        this.setData({
            wechat: event.detail
        })
    },
    //所在区域修改
    onChangeRegion(event) {
        // event.detail 为当前输入的值
        // console.log(event.detail);
    },
    //详细地址修改
    onChangeAddress(event) {
        // event.detail 为当前输入的值
        // console.log(event.detail);
        this.setData({
            address: event.detail
        })
    },
    onClose() {
        this.setData({ show: false });
    },
    bindRegionChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },
    closeTitle(e) {
        this.setData({
            history: false
        })
    },
    clickName(e) {
        var companyName = e.currentTarget.dataset.companyName;
        var companyIndex = e.currentTarget.dataset.companyIndex;
        console.log(companyName)
        console.log(companyIndex)
        var that = this;
        // var sfaId = that.data.listsName[companyIndex].channelId
        that.setData({
            companyName: companyName,
            // sfaId: sfaId,
            history: false
        })
        console.log(that.data.companyName)
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
    changeAvatar: function () {

        var that = this;

        // var childId = wx.getStorageSync("child_id");

        // var token = wx.getStorageSync('token');

        wx.chooseImage({

            count: 1, // 最多可以选择的图片张数，默认9
            sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success: function (res) {

                console.log(res.tempFilePaths + "修改页面")

                var avatar = res.tempFilePaths;

                that.setData({
                    avatar: avatar,
                    upAvatar: true
                })

                console.log(that.data.avatar)

            },

            fail: function () {

                // fail

            },

            complete: function () {

                // complete

                wx.uploadFile({
                    url: globalData.webRequsetUrl + '/weixin/card/file/imageUpload',
                    name: 'file',
                    header: {
                        "Content-Type": "multipart/form-data"
                    },
                    filePath: that.data.avatar[0],
                    success(res) {
                        var path = JSON.parse(res.data).data;
                        console.log(path)
                        that.setData({
                            avatar: path
                        })
                    },

                })
            }

        })

    },



    concel: function () {
        Dialog.confirm({
            title: '提示',
            message: '确定要取消编辑么？'
        }).then(() => {
            // on confirm
            wx.switchTab({
                url: '/pages/index/index',
            })
        }).catch(() => {
            // on cancel
        });
    },
    confirm: function () {
        if (this.data.avatar == '' || this.data.avatar == null) {
            Toast("头像不能为空~")
        } else if (this.data.username == '' || this.data.username == null) {
            Toast("姓名不能为空~")
        } else if (this.data.companyName == '' || this.data.companyName == null) {
            Toast("公司名称不能为空~")
        } else if (this.data.trade == '' || this.data.trade == null) {
            Toast("公司行业不能为空~")
        } else {
            var region = this.data.region.join(",");
            console.log(region)
            var address = this.data.address;
            Dialog.confirm({
                title: '提示',
                message: '确定要保存当前编辑的注册信息么？'
            }).then(() => {
                console.log(this.data.sfaId)
                console.log(this.data.companyName)
                // on confirm
                var elymData = {
                    headImageUrl: this.data.avatar,
                    name: this.data.username,
                    telphone: this.data.phone,
                    company: this.data.companyName,
                    email: this.data.mail,
                    title: this.data.job,
                    wechat: this.data.wechat,
                    area: region,
                    trade: this.data.trade,
                    productFirstId: this.data.productFirstId,
                    companyLocation: address,
                    id: globalData.cardData.id,
                    openId: globalData.openid
                }
                // elymData = JSON.stringify(elymData);
                wx.request({
                    url: globalData.webRequsetUrl + '/weixin/card/updateEmplyeeInfo',
                    method: 'POST',
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    data: elymData,
                    success(res) {
                        console.log(res)
                        if (res.data.status == 200) {
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }
                    },

                })
            }).catch(() => {
                // on cancel
            });
        }

    },
    changePhone: function () {
        wx.navigateTo({
            url: '/pages/changePhone/changePhone'
        })
    }
})
