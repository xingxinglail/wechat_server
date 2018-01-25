const monent = require('moment')
const Message = require('../../models/message')
const Room = require('../../models/room')
const UserController = require('../../controls/user')
const Socket = require('../../socket')

class MessageContoller {
  /**
   * [ getAllRoom 获取用户所有聊天房间 ]
   * @param [Object] data 包含userId
   * @returns {Promise.<Array>}
   */
  static async getAllRoom (data) {
    const users = await Room.getUsers(data.userId) // 先获取和哪些聊天的人的用户信息
    const res = await Message.getAllMsg(data.userId)
    const rooms = []

    for (let i = 0; i < users.length; i++) {
      const type = users[i].type
      const data = {
        roomId: users[i].id,
        type,
        users: type === 0 ? {} : [],
        message: []
      }
      delete users[i].id
      delete users[i].type

      if (type === 0) {
        data.users = users[i]
      } else {
        data.users.push(users[i])
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

  /**
   * [ saveMsg 写入一条消息 ]
   * @param [Object] data 包含roomId房间号 fromId发送者 userId接受者 text消息内容 消息发送时间MCreateTime
   * @returns {Promise.<*>}
   */
  static async saveMsg (data) {
    const res = await Message.saveMsg(data)
    return res
  }

  /**
   * [ saveMsg 写入一条消息并发送Socket ]
   * @param [Object] data 包含roomId房间号 fromId发送者 userId接受者 text消息内容 消息发送时间MCreateTime
   * @returns {Promise.<*>}
   */
  static async saveMsgToSocket (data) {
    const res = await Message.saveMsg(data)
    if (res.code === 1) {
      const socketRes = await UserController.getSocketId(data.userId)
      if (socketRes.code === 1) {
        const socketId = socketRes.data.socketId
        if (socketId) {
          data.message = true
          data.time = data.MCreateTime
          data.isRead = 0
          Socket.toMessageBySocketId(socketId, 'message', data)
        }
      }
      return res
    } else {
      return res
    }
  }

  /**
   * [ readMsg 把消息设置为已读]
   * @param [Object] data 包含房间号和消息接受者ID
   * @returns {Promise.<*>}
   */
  static async readMsg (data) {
    const res = await Message.readMsg(data.roomId, data.userId)
    if (res.affectedRows > 0) {
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

module.exports = MessageContoller
