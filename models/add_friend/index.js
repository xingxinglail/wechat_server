class AddFriend {
  /**
   * [addFriend 把发起请求写入数据库]
   * @param [Object] data 包含fromId,userId,message
   * @returns {Promise.<*>} [Object] 包含code是否成功
   */
  static async addFriend (data) {
    const checkRes = await AddFriend.checkexists(data)
    if (checkRes.code === 1) {
      const res = await query(checkRes.sql, [data.message, data.fromId, data.userId])
      if (res.affectedRows === 1) {
        return {
          code: 1
        }
      } else {
        return {
          code: 0
        }
      }
    } else {
      const res = await query(checkRes.sql, data)
      if (res.affectedRows === 1) {
        return {
          code: 1
        }
      } else {
        return {
          code: 0
        }
      }
    }
  }

  /**
   * [ checkexists 检查好友请求是否存在 ]
   * @param [Object] data 包含fromId,userId message,
   * @returns {Promise.<*>} code 1 更新 2 插入 sql语句
   */
  static async checkexists (data) {
    const sql = 'select fromId, userId from add_friend_message where fromId = ? and userId = ?'
    const res = await query(sql, [data.fromId, data.userId])
    if (res.length === 1) {
      return {
        code: 1,
        sql: 'update add_friend_message set message = ?, isRead = 0 where fromId = ? and userId = ?'
      }
    } else {
      return {
        code: 2,
        sql: 'insert into add_friend_message set ?'
      }
    }
  }

  /**
   * [ getAllMessage 获取好友添加请求列表]
   * @param [String] userId 当前登录用户微信id
   * @returns {Promise.<*>} 返回数组
   */
  static async getAllMessage (userId) {
    const sql = 'SELECT ' +
                ' wechat_id,' +
                ' phone,' +
                ' nikename,' +
                ' avatar,' +
                ' address,' +
                ' sex,' +
                ' signature,' +
                ' customizeId,' +
                ' isRead,' +
                ' success,' +
                ' message ' +
                'FROM ' +
                ' add_friend_message a ' +
                ' LEFT JOIN user b ON a.fromId = b.wechat_id ' +
                'WHERE ' +
                'userId = ?'
    const res = query(sql, [userId])
    return res
  }

  /**
   * [ readMessage 设置所有好友添加请求为已读 ]
   * @param [String] userId 被添加者Id
   *
   */
  static readMessage (userId) {
    const sql = 'update add_friend_message set isRead = 1 where isRead = 0 and userId = ?'
    query(sql, [userId])
  }

  /**
   * [ accept 通过好友添加]
   * @param [String] fromId 发起者id
   * @param [String] userId 被添加者id
   * @returns {Promise.<{code: number, msg: string}>}
   */
  static async accept (fromId, userId) {
    const add_msg_sql = 'update add_friend_message set success = 1 where fromId = ? and userId = ?'
    const add_msg_res = await query(add_msg_sql, [fromId, userId])
    if (add_msg_res.affectedRows === 1) {
      const sql = 'insert into friends(fromId, userId) VALUES ?'
      const post = [[fromId, userId], [userId, fromId]]
      const res = await query(sql, [post]).catch(e => {
        console.error(e)
        return {
          code: 0,
          msg: 'friends 插入失败'
        }
      })
      if (res.affectedRows === 2) {
        return {
          code: 1
        }
      } else {
        return {
          code: 0,
          msg: 'friends 插入失败'
        }
      }
    } else {
      return {
        code: 0,
        msg: 'add_friend_message 更新失败'
      }
    }
  }
}

module.exports = AddFriend
