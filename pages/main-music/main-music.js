// pages/main-music/main-music.js
Page({
  data: {
    searchValue:''
  },
  onSearchclick(){
    wx.navigateTo({url: '/pages/detail-search/detail-search'})
  }
})