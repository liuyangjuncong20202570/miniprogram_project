import { HYEventStore } from "hy-event-store"
import { gethotSongslist } from "../services/music/music"

const rankingMap = {
  newList:3779629,
  originList:2884035,
  upList:19723756
}

const rankingStore = new HYEventStore({
  state:{
    newList:{},
    originList:{},
    upList:{}
  },
  actions:{
    getRankinglist(ctx){
      for(const key in rankingMap){
        const id = rankingMap[key]
        gethotSongslist(id).then(res=>{
          // console.log(res);
          ctx[key] = res.playlist
        })
      }
    }
  }
})

export default rankingStore