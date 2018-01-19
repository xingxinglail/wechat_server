const crypto = require('crypto')

/**
 * [md5 如果没有传参数,默认使用当前时间戳为wechatid加密]
 * @param [String] pwd 密码
 * @returns [String] result 加密后的字符串
 */
module.exports = (pwd) => {
  const md5 = crypto.createHash('md5')
  let result = null
  if (pwd) {
    result = md5.update(pwd)
  } else {
    result = md5.update(Date.now().toString())
  }
  result = result.digest('hex')
  return result
}
