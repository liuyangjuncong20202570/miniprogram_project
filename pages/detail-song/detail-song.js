// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import hotStore from "../../store/index"
import { gethotSongslist } from "../../services/music/music"
import playerStore from "../../store/playerStore"
import menuStore from "../../store/menuStore"
import { menuCol } from "../../database/index"

const db = wx.cloud.database()
Page({
  data:{
    type:'',
    key:'',
    songList:{},
    menuList: []
  },
  onLoad(options){
    this.setData({
      type:options.type,
      key:options.key || ''
    })
    if(options.type === 'ranking'){
      rankingStore.onState(options.key, this.listHandler)
    }else if(options.type === 'hotSongs'){
      hotStore.onState(options.key, this.listHandler)
    }else if(options.type === 'menu'){
      this.getmenusonglist(options.id)
    }else if(options.type === 'profile'){
      const type = options.tabname
      const title = options.title
      this.handleDatabase(type, title)
    }else if(options.type === 'meunList'){
      const _id = options.id
      const name = options.name
      this.handleMenu(_id, name)
    }
    menuStore.onState('menuList', this.handleMenuListdata)
  },
  listHandler(value){
    wx.setNavigationBarTitle({
      title: value.name,
    })
    this.setData({
      songList:value
    })
  },

  async getmenusonglist(id){
    const res = await gethotSongslist(id)
    this.setData({
      songList:res.playlist
    })
  },

  onListtap(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState('songplayerList', this.data.songList.tracks)
    playerStore.setState('playerIndex', index)
  },

  async handleDatabase(type, title){
    const collection = db.collection(`c_${type}`)
    const res = await collection.get()
    wx.setNavigationBarTitle({
      title,
    })
    this.setData({
      songList:{
        name: title,
        tracks: res.data
      }
    })
  },

  async handleMenu(_id, name){
   const offset = 0
   const size = 20
   const res =await menuCol.query(offset,size,_id, true)
   this.setData({
     songList:{
       name,
       tracks: res.data.songList
     }
   })
  },

  handleMenuListdata(value){
    this.setData({ menuList: value })
  },
  onUnload(){
    if (this.data.type === 'ranking') {
      rankingStore.offState(this.data.key, this.listHandler)
    }else if(this.data.type === 'hotList'){
      hotStore.offState(this.data.key, this.listHandler)
    }
    menuStore.offState('menuList', this.handleMenuListdata)
  }
})