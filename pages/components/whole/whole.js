import Dialog from '../../../dist/dialog/dialog';
var app = getApp();
var globalData = app.globalData;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  properties: {
    cardData:Array,
    start:String,
  },
  
  data: {
    datas: [],
    cardData: null, //名片信息
    start:'',
    companyData: null, //公司信息
    cardLists: [],//名片列表
    transferTitle: null,
    pageIndex: 1,
  },
  methods: {
    //分组点击交互父组件
    _openGroup(e){
      let item = e.currentTarget.dataset.cardIndex;
      console.log(item)
      this.triggerEvent("openGroup", item) 
    },
    rmGroup(val){
      let i = val.currentTarget.dataset.cardI;
      // this.triggerEvent("rmg", val) 
      var val=val;
      Dialog.confirm({
        title: '提示',
        message: '确定要移出当前名片么？'
      }).then((res) => {
        wx.request({
          url: globalData.webRequsetUrl + '/weixin/card/group/rmGroup',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: {
            visitorId: globalData.visitorId,
            relationId: val.target.dataset.cardIndex.relationId,
          },
          success: res => {
            console.log(res);
            this.triggerEvent("rmg", val) 
          }
        }); 
      }).catch(() => {
        // on cancel
      });

    },
    // 删除名片
    deleteCall: function (e) {
      let item = e.currentTarget.dataset.cardIndex;
      let userData = wx.getStorageSync('userData');
      let i = e.currentTarget.dataset.cardI;
      console.log(i)
      let data={
        val: item,
        index:i
      }
      Dialog.confirm({
        title: '提示',
        message: '确定要屏蔽当前名片么？'
      }).then((res) => {
        console.log(item);
        console.log(globalData.userInfo);
        wx.request({
          url: globalData.webRequsetUrl + '/weixin/card/deleteRelation',
          method: 'GET',
          data: {
            emplyId: item.cardId, //名片id
            openId: userData.openId,
          },
          success: res => {
            console.log(res);
            this.setData({
              "pageIndex": 1
            })
            wx.pageScrollTo({
              scrollTop: 0
            })
            // this.cardList();
            console.log(item)
            this.triggerEvent("pagesOne", data) 
          }
        });
      }).catch(() => {
        // on cancel
      });
    },
    //开启名片
    openCardPage(e) {
      let item = e.currentTarget.dataset.cardIndex
      let i = e.currentTarget.dataset.cardI;
      console.log(i)
      let data = {
        val: item,
        index: i
      }
      let userData = wx.getStorageSync('userData');
      Dialog.confirm({
        title: '提示',
        message: '确定要开启当前名片么？'
      }).then((res) => {
        console.log(item);
        console.log(userData.openId);
        wx.request({
          url: globalData.webRequsetUrl + '/weixin/card/recoverRelation',
          method: 'GET',
          data: {
            emplyId: item.cardId, //名片id
            openId: userData.openId,
          },
          success: res => {
            console.log(res);
            this.setData({
              "pageIndex": 1
            })
            wx.pageScrollTo({
              scrollTop: 0
            })
            this.triggerEvent("pagesOne", data) 
          }
        });
      }).catch(() => {
      });
    },
    //分享
    transfer() {
      wx.request({
        url: globalData.webRequsetUrlT + '/radar/active',
        method: 'POST',
        data: {
          companyId: globalData.companyId, //公司id
          type: 0, //访客转发
          forwardType: 0, //转发类型名片
          wxCardEmployeeId: globalData.wxCardEmployeeId, //名片id
          wxCardVisitorId: globalData.visitorId, //访客id
          loginId: that.data.cardData.loginId,
          loginType: that.data.cardData.loginType
        },
        success: res => {
          console.log(res);
          // this.cardList()
        }
      });
    },
    //转发数据
    getGlobal: function (e) {
      var cardIndex = e.currentTarget.dataset.cardIndex;
      console.log(cardIndex)
      app.globalData.wxCardEmployeeId = this.data.cardData[cardIndex].cardId;
      app.globalData.companyId = this.data.cardData[cardIndex].companyId;
      this.setData({
        "transferTitle": this.data.cardData[cardIndex].transferTitle
      })
      // console.log(this.data.cardData[cardIndex].transferTitle)
    }, 
    // 点击名片跳到首页
    clickCard: function (e) {
      var cardIndex = e.currentTarget.dataset.cardIndex;
      if (this.data.cardData[cardIndex].status == -1) {
        console.log("名片已经删除")
        return false
      }
      app.globalData.wxCardEmployeeId = this.data.cardData[cardIndex].cardId;
      app.globalData.companyId = this.data.cardData[cardIndex].companyId;
      wx.switchTab({
        url: '/pages/index/index?page=0',
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    },

  },
  //页面加载后..
  ready() {
    
  },
})
