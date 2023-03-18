// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import hotStore from "../../store/index"
import { gethotSongslist } from "../../services/music/music"
import playerStore from "../../store/playerStore"

Page({
  data:{
    type:'',
    key:'',
    songList:{}
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
    }
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

  onUnload(){
    if (this.data.type === 'ranking') {
      rankingStore.offState(this.data.key, this.listHandler)
    }else if(this.data.type === 'hotList'){
      hotStore.offState(this.data.key, this.listHandler)
    }
  }
})