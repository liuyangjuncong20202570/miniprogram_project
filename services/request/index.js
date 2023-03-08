class LYRequest{
  constructor(baseURL){
    this.baseURl = baseURL
  }
  request(options){
    const {url} = options
    return new Promise((resolve, reject)=>{
      wx.request({
        ...options,
        url: this.baseURl + url,
        success:(res)=>{
          resolve(res.data)
        },
        fail:(err)=>{
          reject(err)
        }
      })
    })
  }

  get(options){
    return this.request({
      method:'get',
      ...options
    })
  }

  post(options){
    return this.request({
      method:'post',
      ...options
    })
  }
}

export const netRequest = new LYRequest('http://codercba.com:9002/')