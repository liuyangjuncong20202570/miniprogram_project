// components/menuItem-v2/menuItem-v2.js
import { menuCol } from "../../database/index"
import menuStore from "../../store/menuStore"

Component({
  properties:{
    itemData:{
      type: Object,
      value: {}
    }
  },
  methods:{
   async onDeletetap(){
     const _id = this.properties.itemData._id
     const res = await menuCol.remove(_id)
     if (res) {
      wx.showToast({title: '删除成功~'})
      menuStore.dispatch('fetchMenuListData')
     }
   },
   onleftTap(){
     const _id = this.properties.itemData._id
     const name = this.properties.itemData.name
     wx.navigateTo({
       url: `/pages/detail-song/detail-song?type=meunList&id=${_id}&name=${name}`,
     })
   }
  }
})
