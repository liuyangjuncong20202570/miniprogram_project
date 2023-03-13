// components/menuItem/menuItem.js
Component({
  properties:{
    menuItem:{
      type:Object,
      value:{}
    }
  },
  methods:{
    jumpTomenu(){
      const id = this.properties.menuItem.id
      console.log(this.properties.menuItem.id);
      wx.navigateTo({
        url: `/pages/detail-song/detail-song?type=menu&id=${id}`,
      })
    }
  }
})
