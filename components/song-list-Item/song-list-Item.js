// components/song-list-Item/song-list-Item.js
import { gethotSongsmenu } from "../../services/music/music"
Component({
  data:{
    songItem:[]
  },
  properties:{
    title:{
      type:String,
      value:'默认内容'
    },
    tag:{
      type:String,
      value:'全部'
    }
  },
  lifetimes:{
    attached(){
      this.getSongslist()
    }
  },
  methods:{
    async getSongslist(){
      const res = await gethotSongsmenu(this.properties.tag)
      // console.log(res)
      this.setData({
        songItem:res.playlists
      })
    }
  }
})
