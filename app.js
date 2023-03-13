// app.js
App({
  globalData:{
    screenWidth:0,
    screenHeight:0,
    contentHeight:0,
    statusBarHeight:0
  },
  onLaunch(){
    wx.getSystemInfo({
      success:(res)=>{
        // console.log(res);
        this.globalData.screenHeight = res.screenHeight
        this.globalData.screenWidth = res.screenWidth
        this.globalData.statusBarHeight = res.statusBarHeight
        this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44
      }
    })
  }
})
