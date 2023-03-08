// pages/main-video/main-video.js
import {getMVlist} from "../../services/videos/videos"
Page({
  data:{
    topmvList:[],
    offset:0,
    hasMore:true
  },
  onLoad(){
   this.getmvList()
  },
 async getmvList(){
  let offset = this.data.offset
  const res = await getMVlist(offset)
  // console.log(res);
  const topmvList = this.data.topmvList
  const newList = [...topmvList,...res.data]
  this.setData({
    topmvList:newList
  })
  this.data.offset = newList.length
  this.data.hasMore = res.hasMore
 },
 onReachBottom(){
   if (!this.data.hasMore) return 
   this.getmvList()
 },
async onPullDownRefresh(){
   this.setData({topmvList:[]})
   this.data.offset = 0
   this.data.hasMore = true
  //  重新获取新数据
  // this.getmvList().then(()=>{
  //   // 因为异步函数都会返回一个Promise对象
  //   // 当成功获取数据后要关闭下拉活动
  // wx.stopPullDownRefresh()
  // })
  // 进一步优化：可以通过async/await来优化
  await this.getmvList()
  wx.stopPullDownRefresh()
 },

//  也可以通过监听组件的点击事件通过传过去的properties来进行id的传递
 toDetailPage(event){
  //  console.log(event);
   wx.navigateTo({
     url: `/pages/detail-video/detail-video?mvId=${event.currentTarget.dataset.id}`,
   })
 }
})