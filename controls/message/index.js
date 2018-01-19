const monent = require('moment')
const Message = require('../../models/message')
const Room = require('../../models/room')
const Utils = require('../../utlis')

class MessageContoller {
  /**
   * [ getAllRoom 获取用户所有聊天房间 ]
   * @param [Object] data 包含userId
   * @returns {Promise.<Array>}
   */
  static async getAllRoom (data) {
    const users = await Room.getUsers(data.userId) // 先获取和哪些聊天的人的用户信息
    const newUsers = Utils.uniqeByKeys(users, 'wechat_id')
    const res = await Message.getAllMsg(data.userId)
    const rooms = []

    for (let i = 0; i < newUsers.length; i++) {
      const type = newUsers[i].type
      const data = {
        roomId: newUsers[i].id,
        type,
        users: type === 0 ? {} : [],
        message: []
      }
      delete newUsers[i].id
      delete newUsers[i].type

      if (type === 0) {
        data.users = newUsers[i]
      } else {
        data.users.push(newUsers[i])
      }

      rooms.push(data)
    }

    for (let i = 0; i < res.length; i++) {
      const roomId = res[i].roomId
      if (!roomId) continue
      const index = rooms.findIndex(o => o.roomId === roomId)
      const data = {
        fromId: res[i].fromId,
        userId: res[i].userId,
        text: res[i].text,
        isRead: res[i].isRead,
        time: monent(res[i].MCreateTime).format('YYYY-MM-DD HH:mm:ss')
      }
      rooms[index].message.push(data)
    }
    return rooms
  }
}

module.exports = MessageContoller
