// pages/music-player/music-player.js
import { getSongdetail,getSonglyrc } from "../../services/player/player"
import { parseLyric } from "../../utils/parseLyric"

const app = getApp()
const audioContext = wx.createInnerAudioContext()

Page({
  data:{
    id:0,
    songLyrc:'',
    lyricInfo:[],
    statusBar: 0,
    isPause:false,
    sliderValue:0,
    currentPage:0,
    currentSong:{},
    currentTime:0,
    durationTime:0,
    contentHeight:0,
    isWaiting:false,
    currentLyric:'',
    currentLyricindex:0,
    isSliderchanging:false,
    pageTitles:['歌曲','歌词']
  },
  onLoad(options){
    // console.log(options);
    this.setData({
      id:options.id,
      statusBar: app.globalData.statusBarHeight,
      contentHeight:app.globalData.contentHeight,
    })
    this.Songlyrc()
    this.Songdetail()
    // 歌曲播放
    const id = this.data.id
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = false
    // 进度条时间正确显示
    audioContext.onTimeUpdate(()=>{
      if (!this.data.isSliderchanging && !this.data.isWaiting) {
        this.lyricMatching()
        this.sliderMatching()
      }
    })
    audioContext.onWaiting(()=>{
      audioContext.pause()
    })
    audioContext.onCanplay(()=>{
      audioContext.play()
    })
  },

  // 造成点击滑块使音乐跳转时滚动条会闪回原先位置bug的主要原因是：更新currentTime和sliderValue的频率过快，也就是说：当我设定了sliderValue的时候currentTime也准备进行更新为新的sliderValue的值，但还未开始进行，仍停留在之前的位置，所以滚动条会先滚到之前的currentTime的位置，之后再回滚到设定为sliervalue的位置，所以当使用节流函数降低之间的更新频率时就不会造成回滚
  sliderMatching(){
      this.setData({
        currentTime: audioContext.currentTime*1000,
        sliderValue:(this.data.currentTime / this.data.currentSong.dt)*100,
      })
  },

  // 歌词解析
  lyricMatching(){
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
        currentLyricindex: nowIndex
      })
  },



  async Songdetail(){
    const res = await getSongdetail(this.data.id)
    // console.log(res);
    this.setData({
      currentSong:res.songs[0],
      durationTime:res.songs[0].dt
    })
  },
  async Songlyrc(){
    const res = await getSonglyrc(this.data.id)
    // console.log(res);
    const lyricString = res.lrc.lyric
    const lyricInfo = parseLyric(lyricString)
    this.setData({
      lyricInfo
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
  onSliderchanging(event){
    const value = event.detail.value
    this.setData({
      currentTime: value / 100 *this.data.durationTime,
      isSliderchanging:true
    })
  },

  onPauseorPlay(){
    this.setData({
      isPause: !this.data.isPause
    })
    if (this.data.isPause) {
      audioContext.pause()
    }else{
      audioContext.play()
    }
  }
})