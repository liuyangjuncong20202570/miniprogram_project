import { getBanners,gethotSongsmenu } from "../../services/music/music"
import rankingStore from "../../store/rankingStore"
import boundingHeight from "../../utils/query-selector"
import { throttle } from "underscore"
import hotStore from "../../store/index"
import playerStore from "../../store/playerStore"

const boundingHeightThrottle = throttle(boundingHeight,100)
const app = getApp()

// pages/main-music/main-music.js
Page({
  data: {
    searchValue:'',
    banners:[],
    bannerHeight:150,
    hotList:[],
    hotmenu:[],
    recmenu:[],
    screenWidth:375,
    rankingInfos:{},
    isEmpty:false
  },
  onLoad(){
    hotStore.onState('hotList',(value)=>{this.setData({hotList:value.tracks?.slice(0,6)})})
    hotStore.dispatch('fetchRankList')
    rankingStore.dispatch('getRankinglist')
    rankingStore.onState('newList',this.getRankingdata('newList'))
    rankingStore.onState('originList',this.getRankingdata('originList'))
    rankingStore.onState('upList',this.getRankingdata('upList'))
    this.getBannersRec()
    this.gethotmenu()
    this.setData({
      screenWidth:app.globalData.screenWidth
    })
  },
  onSearchclick(){
    wx.navigateTo({url: '/pages/detail-search/detail-search'})
  },
  async getBannersRec(){
    const res = await getBanners()
    // console.log(res);
    this.setData({
      banners:res.banners
    })
  },

  // 动态获取图片高度并传给轮播图组件
 async onImageload(){
   const res = await boundingHeightThrottle(".banner-image")
  //  console.log(res[0].height);
   this.setData({
    bannerHeight:res[0].height
   })
  },
  onMoreClick(){
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=hotSongs&key=hotList',
    })
  },

  async gethotmenu(){
    gethotSongsmenu().then((res)=>{
      this.setData({
        hotmenu:res.playlists
      })
    })
    // 之所以不用await是因为在一个函数中调用了两次异步操作，如果使用
    // 会造成线程堵塞
    gethotSongsmenu('华语').then((res)=>{
      this.setData({
        recmenu:res.playlists
      })
    })
    
  },

  // 获取排行榜数据
  // newHandle(value){
  //   console.log('新歌榜',value);
  //   const newrankInfo = {...this.data.rankingInfos, newList:value}
  //   this.setData({rankingInfos:newrankInfo})
  //   console.log(this.data.rankingInfos);
  // },

  // upHandle(value){
  //   console.log('飙升榜',value);
  //   const newrankInfo = {...this.data.rankingInfos, upList:value}
  //   this.setData({rankingInfos:newrankInfo})
  //   console.log(this.data.rankingInfos);
  // },

  // originHandle(value){
  //   console.log('原创榜',value);
  //   const newrankInfo = {...this.data.rankingInfos, originList:value}
  //   this.setData({rankingInfos:newrankInfo})
  //   console.log(this.data.rankingInfos);
  // }

  getRankingdata(ranking){
    return value=>{
      const newData = {...this.data.rankingInfos, [ranking]:value}
      this.setData({rankingInfos:newData,isEmpty:true})
    }
  },
  onSongclick(event){
    const id = event.currentTarget.dataset.id
    const index = event.currentTarget.dataset.index
    console.log(index);
    wx.navigateTo({
      url: `/pages/music-player/music-player?id=${id}`,
    })
    playerStore.setState('songplayerList', this.data.hotList)
    playerStore.setState('playerIndex', index)
  }
})