import {netRequest} from "../../services/request/index"

// 获取MV数据
export const getMVlist = (offset = 0,limit = 20) =>{
  return netRequest.get({
    url:'top/mv',
    data:{
      limit,
      offset
    }
  })
}

// 获取MV视频地址
export const getMVurl = (id)=>{
  return netRequest.get({
    url:'mv/url',
    data:{
      id
    }
  })
}

// 获取MV视频详情
export const getMVdetail = (id)=>{
  return netRequest.get({
    url:'mv/detail',
    data:{
      mvid: id
    }
  })
}

// 获取MV视频列表
export const getRecommandlist = (id)=>{
  return netRequest.get({
    url:'related/allvideo',
    data:{
      id
    }
  })
}