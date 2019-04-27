import Toast from '../../dist/toast/toast';
//index.js
//获取应用实例aa
var app = getApp();
var globalData = app.globalData;

Page({
    data: {
        
    active: 0,
    icon: {
        normal: 'https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/xcxCode.png',
        active: 'https://page-bucket.oiaqye7985.com/wechat/mini-card/imgs/shareFa.png'
    }
    },
    onChange(event) {
        console.log(event.detail);
        if (event.detail==1){
            wx.switchTab({
                url: '/pages/products/products'
            })
        } else if (event.detail == 2){
            wx.switchTab({
                url: '/pages/video/video'
            })
        } else if (event.detail == 3){
            wx.switchTab({
                url: 'pages/recentchat/recentchat'
            })
        }
    }
})