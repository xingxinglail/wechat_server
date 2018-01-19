const md5 = require('../md5')

/**
 * [根据当前时间生成wechatid]
 * @return [String] wechatid
 */
module.exports = () => {
  return md5()
}