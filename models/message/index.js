class Message {
  /**
   * [ getAllMsg 获取一个用户所有消息 ]
   * @param [String] userId 微信id
   * @returns {Promise.<Array>}
   */
  static async getAllMsg (userId) {
    const sql = 'SELECT' +
                ' roomId,' +
                ' users,' +
                ' fromId,' +
                ' userId,' +
                ' type,' +
                ' text,' +
                ' isRead,' +
                ' MCreateTime ' +
                'FROM' +
                ' room a' +
                ' LEFT JOIN message b ON a.id = b.roomId ' +
                'WHERE' +
                ' FIND_IN_SET( ?, users )'
    const res = await query(sql, [userId])
    return res
  }

  /**
   * [ saveMsg 写入一条消息 ]
   * @param [Object] data 包含roomId房间号 fromId发送者 userId接受者 text消息内容 消息发送时间MCreateTime
   * @returns {Promise.<*>}
   */
  static async saveMsg (data) {
    const sql = 'insert into message set ?'
    const res = await query(sql, data)
    if (res.affectedRows === 1) {
      return {
        code: 1
      }
    } else {
      return {
        code: 0,
        msg: '消息写入失败'
      }
    }
  }

  /**
   * [ readMsg 把消息设置为已读 ]
   * @param [String] roomId 房间号
   * @param [String] userId 消息接受者
   * @returns {Promise.<*>}
   */
  static async readMsg (roomId, userId) {
    const sql = 'update message set isRead = 1 where isRead = 0 and roomId = ? and userId = ?'
    const res = await query(sql, [roomId, userId])
    return res
  }
}

module.exports = Message
