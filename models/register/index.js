const wecharId = require('../../utlis/create_wechatid')

class Register {
  /**
   * [createUser 用户注册]
   * @param [Object] user 包含手机号,加密后的密码,微信id
   * @returns {Promise.<*>} 包含手机号,微信id
   */
  static async createUser (user) {
    // 检查用户是否存在
    const { code } = await this.checkUserExists(user.phone)
    if (code === 0) {
      return {
        code,
        msg: '用户已存在!'
      }
    }
    const sql = 'insert into user set ?'
    const res = await query(sql, user).catch(e => {
      console.log(e)
    })
    if (res.affectedRows === 1) { // 创建成功,直接登录
      return {
        code: 1,
        data: {
          wechat_id: user.wechat_id,
          phone: user.phone
        }
      }
    } else {
      return {
        code: 0,
        msg: '服务器异常, 请稍后重试!'
      }
    }
  }

  /**
   * [checkUserExists 检查用户是否已经存在]
   * @param [String] phone 用户手机号
   * @returns {Promise.<{code: number}>} 1用户不存在 0用户存在
   */
  static async checkUserExists (phone) {
    const sql = `select phone from user where phone= ?`
    const res = await query(sql, [phone])
    return {
      code: res.length === 0 ? 1 : 0
    }
  }
}

module.exports = Register
