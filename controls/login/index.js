const Login = require('../../models/login')
const md5 = require('../../utlis/md5')

class LoginController {
  /**
   * [login 登录控制器]
   * @param [Object] user 包含手机号和密码
   * @returns {Promise.<void>} [Object] 包含code,手机号,昵称,微信id,微信号,头像,地址,性别,个性签名,二维码
   */
  static async login (user) {
    if (!user || !user.phone || !user.password) {
      return {
        code: 0,
        msg: '手机号或密码为空!'
      }
    }

    user.password = md5(user.password)

    const res = await Login.login(user)
    return res
  }
}

module.exports = LoginController
