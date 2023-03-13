// components/menu-area/menu-area.js
Component({
  properties:{
    screenWidth:{
      type:Number,
      value:375
    },
    title:{
      type:String,
      value:'默认标题'
    },
    text:{
      type:String,
      value:'更多'
    },
    isShow:{
      type:Boolean,
      value:true
    },
    menuList:{
      type:Array,
      value:[]
    }
  },
  methods:{
    moreClick(){
      wx.navigateTo({
        url: '/pages/detail-menu/detai-menu',
      })
    }
  }
})
