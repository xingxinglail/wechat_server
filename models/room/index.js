const moment = require('moment')

class Room {
  /**
   * [ createRoomId 根据当天创建的房间数来创建房间ID ]
   * @returns {Promise.<string>} [String] 房间ID
   */
  static async createRoomId () {
    const today = moment().format('YYYY-MM-DD')
    const sql = 'select count(id) from room where DATE_FORMAT(createTime, "%Y-%m-%d") = ?'
    const res = await query(sql, [today])
    const count = res[0]['count(id)']
    return moment().format('YYYYMMDD') + (count + 1)
  }

  /**
   * [ createRoom 创建房间 ]
   * @param [Object] data 包含房间id, users
   * @returns {Promise.<*>}
   */
  static async createRoom (data) {
    const sql = 'insert into room set ?'
    const res = await query(sql, data)
    if (res.affectedRows === 1) {
      return {
        code: 1
      }
    } else {
      return {
        code: 0,
        msg: '房间创建失败!'
      }
    }
  }

  /**
   * [ getUsers 查询和哪些用户在聊天 ]
   * @param [String] wechat_id 当前登录用户微信id
   * @returns {Promise.<*>}
   */
  static async getUsers (wechat_id) {
    const sql = 'SELECT' +
                ' a.id,' +
                ' type,' +
                ' wechat_id,' +
                ' phone,' +
                ' nikename,' +
                ' avatar,' +
                ' address,' +
                ' sex,' +
                ' signature,' +
                ' customizeId,' +
                ' remark ' +
                'FROM' +
                ' room a' +
                ' LEFT JOIN user b ON FIND_IN_SET( b.wechat_id, a.users )' +
                ' LEFT JOIN friends c ON c.fromId = ?' +
                ' AND FIND_IN_SET( c.userId, a.users )' +
                'WHERE' +
                ' wechat_id != ?' +
                ' AND FIND_IN_SET( ?, users )'
    const res = await query(sql, [wechat_id, wechat_id, wechat_id])
    return res
  }
}

module.exports = Room
