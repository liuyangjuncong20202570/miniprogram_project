import { HYEventStore } from "hy-event-store"
import { menuCol } from "../database/index"

const menuStore = new HYEventStore({
  state:{
    menuList: []
  },
  actions:{
    async fetchMenuListData(ctx){
      const res = await menuCol.query()
      ctx.menuList = res.data
    }
  }
})

menuStore.dispatch('fetchMenuListData')

export default menuStore