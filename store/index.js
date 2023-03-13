import {HYEventStore} from "hy-event-store"
import { gethotSongslist } from "../services/music/music"

const useRank = new HYEventStore({
  state:{
    hotList:[]
  },
  actions:{
   async fetchRankList(ctx){
      const res = await gethotSongslist(3778678)
      // console.log(res);
      ctx.hotList = res.playlist
    }
  }
})

export default useRank