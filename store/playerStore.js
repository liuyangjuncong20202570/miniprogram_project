import { HYEventStore } from "hy-event-store"
import { getSongdetail, getSonglyrc } from "../services/player/player"
import { parseLyric } from "../utils/parseLyric"

export const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state:{
    songplayerList:[],
    playerIndex: 0,

    id:0,
    isPause: false,
    currentSong:{},
    currentTime:0,
    durationTime:0,
    lyricInfo:[],
    playModelIndex: 0, // 0：顺序播放，1：单曲循环，2：随机播放
    isFirstplay:true,
    currentLyric:'',
    currentLyricindex:0
  },
  actions:{
    playMusicwithSongId( ctx, id ){
      // 切换歌曲时将数据清空
      ctx.currentSong = {}
      ctx.currentTime = 0
      ctx.durationTime = 0
      ctx.lyricInfo = []
      ctx.isPause = false

      ctx.id = id
      // 获取歌词
      getSonglyrc(ctx.id).then(res=>{
        ctx.lyricInfo = parseLyric(res.lrc.lyric)
      })
      // 获取歌曲详情
      getSongdetail(ctx.id).then(res=>{
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      // 歌曲播放
      // 当切换播放模式时，同一个音频URl可能会导致audioContext不识别，所以需要在调用src之前将audioContext给关闭再重新打开
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true
      // 进度条时间正确显示
      if (ctx.isFirstplay) {
        ctx.isFirstplay = false
        audioContext.onTimeUpdate(()=>{
          // 设置当前时间
          ctx.currentTime = audioContext.currentTime*1000
          // 歌词匹配
          let nowIndex = ctx.lyricInfo.length - 1
          for( let i = 0; i<ctx.lyricInfo.length; i++ ){
            if (ctx.currentTime <= ctx.lyricInfo[i].time) {
              nowIndex = i - 1
              break
            }
          }
          if (ctx.currentLyricindex === nowIndex || nowIndex === -1) return
          ctx.currentLyric = ctx.lyricInfo[nowIndex]?.text
          ctx.currentLyricindex = nowIndex
        })
        audioContext.onWaiting(()=>{
          audioContext.pause()
        })
        audioContext.onCanplay(()=>{
          audioContext.play()
        })
        audioContext.onEnded(()=>{
          if (audioContext.loop) return
          // 切换下一首歌曲
          this.dispatch('playNextmusic')
        })
      }
    },
    musicIsplaying( ctx ){
      if (!ctx.isPause) {
        audioContext.pause()
        ctx.isPause = true
      }else{
        audioContext.play()
        ctx.isPause = false
      }
    },
    musicplayModel(ctx){
    let model = ctx.playModelIndex
    model = model + 1
    if (model === 1) {
      audioContext.loop = true
    }else{ audioContext.loop = false }
    if (model === 3) model = 0
    ctx.playModelIndex = model
    },
    playNextmusic( ctx, isNext = true ){
    // 1：获取索引值
    // 2: 对现在的索引值进行加一操作
    // 3：根据索引获取当前歌曲信息
    // 4：将新的索引值保存到playerStore中
     let index = ctx.playerIndex
     const length = ctx.songplayerList.length
     switch(ctx.playModelIndex){
       case 1:
       case 0:
         index = isNext ? index + 1 : index - 1
         if (index === length) index = 0
         if (index === -1) index = length - 1
         break
       case 2:
         index = Math.floor(Math.random() * length)
         break
     }
     const newSong = ctx.songplayerList[index]
     ctx.playerIndex = index
     this.dispatch('playMusicwithSongId', newSong.id)
    }
  }
})

export default playerStore