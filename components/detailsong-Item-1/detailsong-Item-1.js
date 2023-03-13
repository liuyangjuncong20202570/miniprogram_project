// components/detailsong-Item-1/detailsong-Item-1.js
Component({
  properties:{
    itemData:{
      type:Object,
      value:{}
    },
    key:{
      type:Number,
      value:0
    },
    name:{
      type:String,
      value:'默认名称',
    },
    author:{
      type:String,
      value:'作者'
    }
  },
  methods:{
    onSongclick(){
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`,
      })
    }
  }
})
