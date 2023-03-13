import {netRequest} from "../request/index"

// 获取轮播图数据
export const getBanners = ( type = 0)=>{
  return netRequest.get({
    url:'banner',
    data:{
      type
    }
  })
}

// 获取热门歌曲数据
export const gethotSongslist=(id)=>{
  return netRequest.get({
    url:'playlist/detail',
    data:{
      id
    }
  })
}

// 获取热门歌单数据
export const gethotSongsmenu=(cat="全部",limit=6,offset=0)=>{
  return netRequest.get({
    url:'top/playlist',
    data:{
      cat,
      limit,
      offset
    }
  })
}

// 获得歌曲tag列表
export const getTagList = ()=>{
  return netRequest.get({
    url:'playlist/hot'
  })
}