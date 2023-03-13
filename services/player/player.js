import { netRequest } from "../../services/request/index"

// 获取歌曲详情
export const getSongdetail = (ids)=>{
  return netRequest.get({
    url:'song/detail',
    data:{
      ids
    }
  })
}

// 获取歌曲歌词
export const getSonglyrc = (id)=>{
  return netRequest.get({
    url:'lyric',
    data:{
      id
    }
  })
}
