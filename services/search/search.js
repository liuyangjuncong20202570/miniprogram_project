import { netRequest } from "../../services/request/index"

export const hotSuggest = ()=>{
  return netRequest.get({
    url:'search/hot'
  })
}

export const suggestImagin = (keywords)=>{
  return netRequest.get({
    url:'search/suggest',
    data:{
      keywords,
      type:'mobile'
    }
  })
}

export const getdongResult = (keywords)=>{
  return netRequest.get({
    url:'cloudsearch',
    data:{
      keywords
    }
  })
}