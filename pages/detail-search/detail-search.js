// pages/detail-search/detail-search.js
import { hotSuggest, suggestImagin, getdongResult } from "../../services/search/search"
import stringToNodes from "../../utils/string2nodes"
Page({
  data:{
    hotSuggestList:[],
    searchValue:'',
    searchImageList:[],
    suggestSongsNodes:[],
    isSearch:false,
    resultSongs:[]
  },
  onLoad(){
    this.gethotSuggest()
  },

  // 获取热门推荐
 async gethotSuggest(){
    const res = await hotSuggest()
    this.setData({
      hotSuggestList: res.result.hots
    })
  },
  // 获取热门搜索
  async getSuggest(kw){
    const res = await suggestImagin(kw)
     // 空关键字判断
     if (!this.data.searchValue.length) {
      this.setData({ searchImageList: [] })
      return
    }
    this.setData({
      searchImageList: res.result?.allMatch
    })
  },
  // 获取搜索结果
  async getsongResult(kw){
    const res = await getdongResult(kw)
    this.setData({ resultSongs: res.result.songs })
  },
  onChange(e){
    this.getSuggest(this.data.searchValue)
   
    this.setData({
      searchValue: e.detail
    })
  },
  onFocus(){
    this.getSuggest(this.data.searchValue)
    this.setData({ isSearch: true })
  },
  getResult(e){
    this.getsongResult(e.currentTarget.dataset.keyword)
  }
})