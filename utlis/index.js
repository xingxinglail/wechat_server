function obj2key (obj, keys) {
  let n = keys.length
  const arr = []
  while (n--) {
    arr.push(obj[keys[n]])
  }
  return arr.join('|')
}

// 对象去重
function uniqeByKeys (array, keys) {
  const arr = []
  const hash = {}
  for (let i = 0; i < array.length; i++) {
    const key = obj2key(array[i], keys)
    if (!(key in hash)) {
      hash[key] = true
      arr.push(array[i])
    }
  }
  return arr
}

const Utils = {
  uniqeByKeys
}

module.exports = Utils
