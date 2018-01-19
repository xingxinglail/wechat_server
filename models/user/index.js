class User {
  /**
   * [ setSocketId 数据库更新socketId ]
   * @param [String] phone 用户手机号
   * @param [String] socketId
   * @returns {Promise.<*>}
   */
  static async setSocketId (phone, socketId) {
    const sql = 'UPDATE user set socketId = ? where phone = ?'
    const res = await query(sql, [socketId, phone])
    return res
  }

  /**
   * [ findUser 搜索添加好友]
   * @param [String] sql sql语句
   * @param [String] value 值
   * @returns {Promise.<void>} 包含微信id,昵称,手机号,头像,地址,性别,个性签名,微信号
   */
  static async findUser (sql, value) {
    const res = await query(sql, [value])
    return res
  }

  /**
   * [ findUserByWechatId 根据微信id查找一个用户 ]
   * @param [String] wechat_id 微信id
   * @returns {Promise.<*>}
   */
  static async findUserByWechatId (wechat_id) {
    const sql = 'select wechat_id, phone, nikename, avatar, address, sex, signature, customizeId from user where wechat_id = ?'
    const res = await query(sql, [wechat_id])
    return res[0]
  }

  /**
   * [ getFriends 获取好友列表 ]
   * @param [String] value wechat_id
   * @returns {Promise.<*>} 返回好友列表
   */
  static async getFriends (value) {
    const sql = 'SELECT ' +
                  'wechat_id,' +
                  'phone,' +
                  'remark,' +
                  'nikename,' +
                  'avatar,' +
                  'address,' +
                  'sex,' +
                  'signature,' +
                  'customizeId ' +
                'FROM ' +
                  'friends a ' +
                  'LEFT JOIN user b ON a.userId = b.wechat_id ' +
                'WHERE ' +
                  'fromId = ?'
    const res = await query(sql, [value])
    return res
  }

  /**
   * [ getSocketId 获取socketId]
   * @param [String] value 微信id
   * @returns {Promise.<*>} socketId
   */
  static async getSocketId (value) {
    const sql = 'select socketId from user where wechat_id = ?'
    const res = await query(sql, [value])
    return res[0]
  }
}

module.exports = User
