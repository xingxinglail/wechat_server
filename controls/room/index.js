const Room = require('../../models/room')
const Message = require('../../models/message')
const UserController = require('../../controls/user')
const Socket = require('../../socket')

class RoomController {
  /**
   * [ createRoom 创建房间 ]
   * @param [Object] data 包含发送者fromId, 接着收userId 和消息text time时间
   * @returns {Promise.<*>}
   */
  static async createRoom (data) {
    const roomId = await Room.createRoomId() // 创建房间号
    const newData = {
      id: roomId,
      users: `${data.fromId},${data.userId}`
    }
    const res = await Room.createRoom(newData) // 创建房间
    if (res.code === 1) {
      // 写入消息
      const saveData = {
        roomId,
        fromId: data.fromId,
        userId: data.userId,
        text: data.text,
        MCreateTime: data.time
      }
      const msgRes = await Message.saveMsg(saveData)
      if (msgRes.code === 1) {
        const socketRes = await UserController.getSocketId(saveData.userId)
        if (socketRes.code === 1) {
          const socketId = socketRes.data.socketId
          if (socketId) {
            saveData.time = data.time
            saveData.isRead = 0
            delete saveData.MCreateTime
            Socket.toMessageBySocketId(socketId, 'message', saveData)
          }
        }
        return {
          code: 1,
          roomId
        }
      } else {
        return msgRes
      }
    } else {
      return res
    }
  }
}

module.exports = RoomController
