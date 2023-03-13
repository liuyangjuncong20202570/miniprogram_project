// pages/detail-menu/detai-menu.js
import { all } from "underscore"
import { getTagList } from "../../services/music/music"
Page({
  data:{
    tagList:[]
  },
  onLoad(){
    this.getTag()
  },
   async getTag(){
      const allPromise = []
      const tagRes = await getTagList()
      tagRes.tags.forEach((item)=>{
        allPromise.push(item.name)
      })
      // 为了提高性能，可以在循环语句中将循环的tag插入到一个数组当中
      // 使用Promise的静态all方法将数组插入到data当中
      Promise.all(allPromise).then(()=>{
        this.setData({
          tagList: allPromise
        })
      })
    }
})