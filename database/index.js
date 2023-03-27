
export const db = wx.cloud.database()

class LYDatabase {
  constructor(collectionName){
    this.collection = db.collection(collectionName)
  }

  // 数据库增删改查封装操作
  // 增
  add(data){
    return this.collection.add({
      data
    })
  }
  // 删
  remove(condition, isDOC = true){
    if (isDOC) {
      return this.collection.doc(condition).remove()
    }else{
      return this.collection.where(condition).remove()
    }
  }
  // 改
  update(condition, data, isDOC = true){
    if (isDOC) {
      return this.collection.doc(condition).update({data})
    }else{
      return this.collection.where(condition).update({data})
    }
  }
  // 查
  query(offset = 0, size = 20,condition={}, isDOC = false){
    if (isDOC) {
      return this.collection.doc(condition).get()
    }else{
      return this.collection.where(condition).skip(offset).limit(size).get()
    }
  }
}

export const favorCol = new LYDatabase('c_favor')
export const likeCol = new LYDatabase('c_like')
export const historyCol = new LYDatabase('c_history')
export const menuCol = new LYDatabase('c_menuList')