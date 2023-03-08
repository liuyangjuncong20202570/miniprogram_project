// pages/detail-video/detail-video.js
import {getMVurl,getMVdetail,getRecommandlist} from "../../services/videos/videos"
Page({
  data:{
    mvId:'',
    mvURL:'',
    mvText:{},
    isMore:false,
    recommandList:[]
  },
  onLoad(options){
    // console.log(options.mvId);
    this.setData({
      mvId:options.mvId
    })
    this.getmvText()
    this.getmvResource()
    this.getrecommandVideo()
  },
  async getmvResource(){
    const res = await getMVurl(this.data.mvId)
    this.setData({
      mvURL:res.data.url
    })
  },
  async getmvText(){
    const res = await getMVdetail(this.data.mvId)
    // console.log(res.data);
    this.setData({
      mvText:res.data
    })
  },
  onMore(){
    this.setData({
      isMore:!this.data.isMore
    })
  },
  async getrecommandVideo(){
    const res = await getRecommandlist(this.data.mvId)
    // console.log(res.data);
    this.setData({
      recommandList:res.data
    })
  }
})