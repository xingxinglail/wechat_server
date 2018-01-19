const RegisterModel = require('../../models/register')
const md5 = require('../../utlis/md5')
const wechatId = require('../../utlis/create_wechatid')

class RegisterController {
  /**
   * [register 创建用户之前进行数据过滤]
   * @param [Object] user 包含手机号和密码
   * @returns {Promise.<*>} 包含状态code,手机号和微信id
   */
  static async register (user) {
    if (!user || !user.phone || !user.password) {
      return {
        code: 0,
        msg: '手机号或密码为空!'
      }
    }
    user.password = md5(user.password)
    user.wechat_id = wechatId()

    const res = await RegisterModel.createUser(user)
    return res
  }
}

module.exports = RegisterController
