export const parseLyric = (string) =>{
  const lyrcArr = []
  const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
  const lyricInfo = string.split('\n')
  for (const ly of lyricInfo) {
    const allTime = timeReg.exec(ly)
    if (!allTime) continue
    const minite = allTime[1]*60*1000 
    const seconds = allTime[2]*1000
    const mseconds = allTime[3].length === 2 ? allTime[3]*10 : allTime[3]*1
    const time = minite + seconds + mseconds
    const text = ly.replace(timeReg , '')
    lyrcArr.push({time, text})
  }
  return lyrcArr
}