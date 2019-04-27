import WeAppRedux from './redux/index.js';
import createStore from './redux/createStore.js';
import reducer from './store/reducer.js';

import ENVIRONMENT_CONFIG from './config/envConfig.js'
import PAGE_CONFIG from './config/pageConfig.js'

const { Provider } = WeAppRedux;
const store = createStore(reducer) // redux store

App(
  Provider(store)(
    {
      globalData: {
        emitter: null,
        netcallController: null,
        ENVIRONMENT_CONFIG,
        PAGE_CONFIG,
        webRequsetUrl: 'http://192.168.1.190:8085',
        webRequsetUrlT: 'http://192.168.1.131:8082',
        // webRequsetUrl:"https://card.wayboo.com",
        // webRequsetUrlT: 'https://card.wayboo.com',
        userData:null,
        userInfo: null,
        source: 0,
        eAppT:null,
        cardEmplyId: -1, //员工id
        companyId: -1, //公司id
        visitorId: -1, //访客id
        wxCardEmployeeId: -1, //员工id/名片id
        cardData: null, //获取名片数据
        openid:null,
        messageNumber: null,
        sfaCompanyId:"",
        iftoAccid: true,
        phoneSates: false,
        visitthatIF:false,
        visitorinformation:false,
        loginState: 0,
        msgLogin:null,
        registState:0,
        cardMian: '18811327384',
        bindWxCardEmployeeId:null, 
      },
      onShow: function (e) {
        if (e.scene == 1007 || e.scene == 1008) {
          try {
            this.globalData.netcall && this.globalData.netcall.destroy()
            this.globalData.nim && this.globalData.nim.destroy({
              done: function () {
              }
            })
          } catch (e) {
          }
        }
      },
      onLaunch: function (e) {
          const that = this
          wx.login({
              success: res => {
                  if (res.code) {
                      wx.request({
                          url: this.globalData.webRequsetUrl + '/weixin/code',
                          data: {
                              code: res.code
                          },
                          success(res) {
                              console.log(res)
                              wx.setStorageSync('openid', res.data.data.openid)
                              wx.setStorageSync('session_key', res.data.data.session_key)
                              that.globalData.openid = res.data.data.openid
                          }
                      })
                  }
              }
          });

        this.globalData.eAppT = e;
        //im
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
          this.globalData.userInfo = userInfo
        }
        let systemInfo = wx.getSystemInfoSync()
        this.globalData.videoContainerSize = {
          width: systemInfo.windowWidth,
          height: systemInfo.windowHeight
        }
        this.globalData.isPushBeCallPage = false;
        //im结束
      
        //保存用户信息到本地
        let userData = wx.getStorageSync('userData');
        if (userData){
          this.globalData.userData = userData;
         // console.log(this.globalData.userData);
        }else{
          this.getWxUserInfo().then((res) => {
           // console.log(res);
            wx.setStorageSync('userData', res.data.data)
          });
        }
        console.log("ididid")
        console.log(this.globalData.visitorId)
      },
      //回调函数
      
      getWxUserInfo() {
        const that=this
        return new Promise((resolve, reject) => {
          //获取openid
          wx.login({
            success: res => {
              if (res.code) {
                wx.request({
                  url: this.globalData.webRequsetUrl + '/weixin/code',
                  data: {
                    code: res.code
                  },
                  success(res) {
                    console.log(res)
                    wx.setStorageSync('openid', res.data.data.openid)
                    wx.setStorageSync('session_key', res.data.data.session_key)
                    that.globalData.openid = res.data.data.openid
                    wx.request({
                      url: that.globalData.webRequsetUrl + '/weixin/getVisitor',
                      data: {
                        openId: res.data.data.openid
                      },
                      success(res) {
                        resolve(res);
                        // that.globalData.visitorId=res.data.data.id
                      },
                      fail: res => {
                        // wx.redirectTo({
                        //   url: '/pages/Propaganda/Propaganda',
                        // })
                        console.log(res)
                      }
                    });
                  }
                })
              }
            }
          });
        });
      },
      getCardfun(cardEmplyId, companyId, openId){
        const that = this;
        return new Promise((resolve, reject) => {
          wx.request({
            url: that.globalData.webRequsetUrl + '/weixin/card/getCardInfo',
            data: {
              cardEmplyId: cardEmplyId, //名片id
              companyId: companyId, //公司id
              openId: openId,
              source: that.globalData.source
            },
            success(res) {
              resolve(res)
            },
            fail: res => {
              console.log(res)
            }
          });
        });
      }
      //回调函数结束
    }
  )
)
