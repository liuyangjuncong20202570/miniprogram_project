// components/songItem-1/songItem-1.js
Component({
  properties:{
    songItem:{
      type:Object,
      value:{}
    }
  },
  methods:{
    onMoreClick(){
      wx.navigateTo({
        url: '/pages/detail-song/detail-song',
      })
    }
  }
})
