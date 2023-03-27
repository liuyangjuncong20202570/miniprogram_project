// components/detailsong-Item-1/detailsong-Item-1.js
import { favorCol, likeCol, menuCol, db } from "../../database/index"
import menuStore from "../../store/menuStore"
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
    },
    menuList: {
      type: Array,
      value: []
    }
  },
  methods:{
    onSongclick(){
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`,
      })
    },
   onFavortap(){
     wx.showActionSheet({
        itemList: ['收藏', '喜欢', '添加到歌单'],
        success:(res)=>{
          const index = res.tapIndex
          this.handlefavorTap(index)
        },
        fail: (err)=>{}
      })
    },
  async handlefavorTap(index){
      let res = null
      const title = index === 0 ? '收藏': '喜欢'
      switch (index) {
        case 0: //收藏
          res = await favorCol.add(this.properties.itemData)
          break;
      
        case 1: //喜欢
          res = await likeCol.add(this.properties.itemData)
          break;
        case 2: //添加到歌单
          const menuNames = this.properties.menuList.map(item=> item.name)
          wx.showActionSheet({
            itemList: menuNames,
            success: (res)=>{
              const index = res.tapIndex
              this.handlemenuList(index)
            },
            fail:(err)=>{}
          })
          return
      }
      if (res) {
        wx.showToast({
          title: `${title}成功~`,
        })
      }
    },

   async handlemenuList(index){
    //  如何将获取的歌曲资源添加到对应的歌单中？
    // 首先properties中的itemData实际上就是歌曲资源，只需将其添加即可
    const songItem = this.properties.itemData
    // 2: 根据index找到对应的歌单
    const menu = this.properties.menuList[index]._id
    // 3: 根据查找指令将歌曲插入到歌单之中
    const cmd = db.command
    const res = await menuCol.update(menu, {
      songList: cmd.push(songItem)
    })
    if (res) {
      wx.showToast({title: '添加歌单成功'})
      menuStore.dispatch('fetchMenuListData')
    }
   }    
  }
})
