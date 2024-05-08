export function shuffle (arr) {
  const newArr = arr.slice()
  // for (let i = 0; i < newArr.length; i++) console.log(newArr[i], ' ')
  for (let i = newArr.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = t
  }
  // for (let i = 0; i < newArr.length; i++) console.log(newArr[i], ' ')
  return newArr
}

export function formatTime(interval) {
  interval = interval | 0
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  const second = (interval % 60 + '').padStart(2, '0')
  return `${minute}:${second}`
}
