import Dialog from '../../../dist/dialog/dialog';
var app = getApp();
var globalData = app.globalData;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  properties: {
    groupList: Array,

  },

  data: {
   groupList:[]
  },
  methods: {
    allGroup(val){
      this.triggerEvent("allGroup", val.currentTarget.dataset.value) 
    },
    addGroup(){
      this.triggerEvent("addGroup") 
    }
  },
  //页面加载后..
  ready() {
    console.log(this.data.groupList)
  },
})
