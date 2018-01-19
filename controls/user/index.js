const User = require('../../models/user')

class UserController {
  /**
   * [ setSocketId 设置SocketId]
   * @param [包含用户手机号和socketId ] user
   * @returns {Promise.<void>}
   */
  static async setSocketId (user) {
    const { phone, socketId } = user
    const res = await User.setSocketId(phone, socketId)
    return res
  }

  /**
   * [ findUser 搜索添加好友]]
   * @param [Object] value
   * @returns {Promise.<void>} 包含微信id,手机号,昵称,头像,地址,性别,个性签名,微信号
   */
  static async findUser (value) {
    const { id } = value
    let source = '微信号' // 微信号
    let sql = 'select wechat_id, phone, nikename, avatar, address, sex, signature, customizeId from user where customizeId = ?'
    if (/^(1)\d{10}/.test(id)) {
      source = '手机号' // 手机号
      sql = 'select wechat_id, phone, nikename, avatar, address, sex, signature, customizeId from user where phone = ?'
    }
    const res = await User.findUser(sql, id)
    if (res.length === 1) {
      res[0].source = source
      return {
        code: 1,
        data: res[0]
      }
    } else {
      return {
        code: 0,
        msg: '用户不存在'
      }
    }
  }

  /**
   * [ findUserByWechatId 根据微信id查找一个用户 ]
   * @param [Object] 包含 wechat_id 微信id
   * @returns {Promise.<void>}
   */
  static async findUserByWechatId (data) {
    const res = await User.findUserByWechatId(data.wechat_id)
    return res
  }

  /**
   * [ 获取好友列表 getFriends ]
   * @param [Object] data 包含微信id
   * @returns {Promise.<*>} 包含code和好友列表
   */
  static async getFriends (data) {
    const { wechat_id } = data
    if (!wechat_id) {
      return {
        code: 0,
        msg: '参数错误!'
      }
    }
    const res = await User.getFriends(wechat_id)
    return {
      code: 1,
      data: res
    }
  }

  /**
   * [ getSocketId 获取socketId]
   * @param [String] value 微信id
   * @returns {Promise.<*>} 包含code和socketId
   */
  static async getSocketId (value) {
    if (!value) {
      return {
        code: 0,
        msg: '参数错误!'
      }
    }
    const res = await User.getSocketId(value)
    return {
      code: 1,
      data: res
    }
  }
}

module.exports = UserController
