// pages/music-player/music-player.js
import playerStore, {audioContext} from "../../store/playerStore"
import { throttle } from "underscore"

const app = getApp()

Page({
  data:{
    songLyrc:'',
    playerIndex:0,
    statusBar: 0,
    isPause:false,
    sliderValue:0,
    currentPage:0,
    currentSong:{},
    currentTime:0,
    durationTime:0,
    contentHeight:0,
    isWaiting:false,
    lyricScrolltop:0,
    isFirstplay:true,
    playName:'order',
    isSliderchanging:false,
    pageTitles:['歌曲','歌词'],
    playModelnames:['order', 'repeat', 'random'],
    playerKeys:['id', 'currentSong', 'currentTime', 'durationTime', 'lyricInfo', 'currentLyric', 'currentLyricindex', 'isPause', 'playModelIndex']
  },
  onLoad(options){
    // console.log(options);
    const id = options.id
    this.setData({
      id,
      statusBar: app.globalData.statusBarHeight,
      contentHeight:app.globalData.contentHeight,
    })
    
    // this.setupSong()
    if (id) {
      playerStore.dispatch('playMusicwithSongId', id)  
    }
    playerStore.onStates(this.data.playerKeys, this.getPlayerinfosHandler)

    playerStore.onStates(['playerIndex', 'songplayerList'], this.statesHandler)
  },

  // 造成点击滑块使音乐跳转时滚动条会闪回原先位置bug的主要原因是：更新currentTime和sliderValue的频率过快，也就是说：当我设定了sliderValue的时候currentTime也准备进行更新为新的sliderValue的值，但还未开始进行，仍停留在之前的位置，所以滚动条会先滚到之前的currentTime的位置，之后再回滚到设定为sliervalue的位置，所以当使用节流函数降低之间的更新频率时就不会造成回滚
  sliderMatching(){
      this.setData({
        currentTime: audioContext.currentTime*1000,
        sliderValue:(this.data.currentTime / this.data.currentSong.dt)*100,
      })
  },

  // 歌词解析
 async lyricMatching(){
    let nowIndex = this.data.lyricInfo.length - 1
    for( let i = 0; i<this.data.lyricInfo.length; i++ ){
      if (this.data.currentTime <= this.data.lyricInfo[i].time) {
        nowIndex = i - 1
        break
      }
    }
    if (this.data.currentLyricindex === nowIndex) return
      this.setData({
        currentLyric: this.data.lyricInfo[nowIndex]?.text,
        currentLyricindex: nowIndex,
        lyricScrolltop: 35 * nowIndex
      })
  },

  onScroll(event){
    // console.log(event);
    this.setData({
      currentPage: event.detail.current
    })
  },
  oncenterClick(event){
    const id = event.currentTarget.dataset.index
    this.setData({
      currentPage:id
    })
  },
  onBackclick(){
    wx.navigateBack()
  },

  onSliderchange(event){
    // 1: 获取变化后进度条的时间
    // 在事件对象的detail属性中
    // console.log(event.detail.value);
    const value = event.detail.value
    // 2: 获得进度条上对应的时间百分比后
    // 重新赋值给audioContext
    // 注意单位转化：先除100获得对应的小数后乘以整首歌的时间，注意seek函数内部要求传值为秒
    // 该方法bug：当点击进度条上的某一点进行歌曲跳转时，之前的onTimeUpdate函数不再监听歌曲时间变化，也就是说我们需要手动将播放器先暂停当跳转成功后重新开起播放器
    this.data.isWaiting = true
    setTimeout(()=>{
      this.data.isWaiting = false
      this.data.isSliderchanging = false
    },1500)
    audioContext.seek((value / 100)*this.data.durationTime / 1000)
    this.setData({
      currentTime:(value / 100)*this.data.durationTime,
      
    })
  
  },

  // 当移动滚动条时音频不变时间变化且当滚动到一定位置时歌曲播放位置发生变化
  onSliderchanging: throttle(function(event){
    const value = event.detail.value
    this.setData({
      currentTime: value / 100 *this.data.durationTime,
      isSliderchanging:true
    })
  }),

  onPauseorPlay(){
    playerStore.dispatch('musicIsplaying')
  },

  // 监听store中的数据变化
  statesHandler({playerIndex, songplayerList}){
    if (songplayerList) {
      this.setData({
        playerList: songplayerList
      })
    }
    if (playerIndex !== undefined) { this.setData({playerIndex}) }
  },

  // 点击上一首
  onprevTap(){
    playerStore.dispatch('playNextmusic', false)
  },

  // 点击下一首
  onnextTap(){
    playerStore.dispatch('playNextmusic')
  },


  // 切换播放模式
  modelChange(){
    playerStore.dispatch('musicplayModel')
  },

  getPlayerinfosHandler({id, currentSong, currentTime, durationTime, lyricInfo, currentLyric, currentLyricindex, isPause, playModelIndex}){
    if (id !== undefined) {
      this.setData({ id })
    }
    if (currentSong) {
      this.setData({ currentSong })
    }
    if (currentTime !== undefined) {
      // this.setData({ currentTime })
       if (!this.data.isSliderchanging && !this.data.isWaiting) {
            this.setData({ currentTime, sliderValue: (this.data.currentTime / this.data.currentSong.dt)*100 })
          }
    }
    if (durationTime !== undefined) {
      this.setData({ durationTime })
    }
    if (lyricInfo) {
      this.setData({ lyricInfo })
    }
    if (currentLyric) {
      this.setData({ currentLyric })
    }
    if (currentLyricindex !== undefined) {
      this.setData({ currentLyricindex, lyricScrolltop: currentLyricindex * 35 })
    }
    if (isPause !== undefined) {
      this.setData({ isPause })
    }
    if (playModelIndex !== undefined) {
      this.setData({ 
        playName: this.data.playModelnames[playModelIndex]
       })
    }
  }
})