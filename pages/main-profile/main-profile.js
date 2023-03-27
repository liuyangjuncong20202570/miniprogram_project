// pages/main-profile/main-profile.js
import { menuCol } from "../../database/index"
import menuStore from "../../store/menuStore"
Page({
  data:{
    isLogin: false,
    userinfo: {},
    tabs:[
      {name: '我的收藏', type: 'favor'},
      {name: '我的最爱', type: 'like'},
      {name: '历史记录', type: 'history'}
    ],
    isDialogShow: false,
    input: '',
    menuList: []
  },
  // 判断用户是否已登陆
  onLoad(){
    const userinfo = wx.getStorageSync('userinfo')
    const openid = wx.getStorageSync('openid')
    this.setData({ isLogin: !!openid })
    if (this.data.isLogin) {
      this.setData({ userinfo })
    }
    menuStore.onState('menuList', this.handleMenuData)
  },
  // 用户登录功能实现
  async onUserlogin(){
  const userinfo = await wx.getUserProfile({
      desc: '获取您的头像和昵称',
    })
    this.setData({
      isLogin: true,
      userinfo: userinfo.userInfo
    })
    // 获取用户openid
    const loginRes = await wx.cloud.callFunction({
      name: 'music-userLogin'
    })
    wx.setStorageSync('userinfo', userinfo.userInfo)
    wx.setStorageSync('openid', loginRes.result.openid)
  },

  // 实现页面跳转
  onTabtap(e){
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=profile&tabname=${item.type}&title=${item.name}`,
    })
  },

  onPlustap(){
    this.setData({ isDialogShow: true })
  },
  onInputtap(){},
 async onConfirmtap(){
   const res = await menuCol.add({
      name: this.data.input,
      songList: []
    })
    if (res) {
      wx.showToast({
        title: '歌单创建成功',
      })
    }
    menuStore.dispatch('fetchMenuListData')
  },

  handleMenuData(value){
    this.setData({
      menuList: value
    })
  }
})