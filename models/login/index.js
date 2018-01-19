class Login {
  /**
   * [login 登录]
   * @param [Object] user 包含手机号和加密过的密码
   * @returns {Promise.<*>} [Object] 包含code,手机号,昵称,微信id,微信号,头像,地址,性别,个性签名,二维码
   */
  static async login (user) {
    const sql = 'select wechat_id, phone, nikename, password, avatar, address, sex, signature, qrCode, customizeId from user where phone = ? and password = ?'
    const res = await query(sql, [user.phone, user.password])
    if (res.length === 0) {
      return {
        code: 0,
        msg: '账号或密码错误!'
      }
    } else {
      delete res[0].password
      return {
        code: 1,
        data: res[0]
      }
    }
  }
}

module.exports = Login
