// components/song-rank-item/song-rank-item.js
Component({
  properties:{
    listData:{
      type:Object,
      value:{}
    },
    key:{
      type:String,
      value:''
    }
  },
  methods:{
    onJumptoDetail(){
      wx.navigateTo({
        url: `/pages/detail-song/detail-song?type=ranking&key=${this.properties.key}`,
      })
    },
  }
})
