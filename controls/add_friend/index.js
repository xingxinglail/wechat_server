const AddFriend = require('../../models/add_friend')
const UserController  = require('../../controls/user')
const Socket = require('../../socket')
const Room = require('../../models/room')
const MessageController = require('../../controls/message')
const moment = require('moment')

class AddFriendController {
  /**
   * [addFriend 把发起好友添加请求]
   * @param [Object] data 包含fromId,userId,message,socketId
   * @returns {Promise.<*>} [Object] 包含code是否成功
   */
  static async addFriend (data) {
    const { fromId, userId, message, socketId } = data
    if (!fromId || !userId || !socketId) {
      return {
        code: 0,
        msg: '缺少参数'
      }
    }

    const res = await AddFriend.addFriend({ fromId, userId, message })
    if (res.code === 1) {
      Socket.toMessageBySocketId(socketId, 'new_friend', {fromId, message})
      return {
        code: 1
      }
    } else {
      return {
        code: 0,
        msg: '网络异常,请稍后重试!'
      }
    }
  }

  /**
   * [ getAllMessage 获取好友添加请求列表 ]
   * @param [Object] data 包含userId
   * @returns {Promise.<*>} 数组
   */
  static async getAllMessage (data) {
    const { userId } = data
    if (!userId) {
      return {
        code: 0,
        msg: '缺少参数'
      }
    }
    const res = await AddFriend.getAllMessage(userId)
    return {
      code: 1,
      data: res
    }
  }

  /**
   * [ readMessage 设置所有好友添加请求为已读 ]
   * @param [Object] data 包含userId
   *
   */
  static readMessage (data) {
    AddFriend.readMessage(data.userId)
  }

  /**
   * [ accept 通过好友添加 ]
   * @param [Object] data 包含userId,fromId
   * @returns {Promise.<{code: number, msg: string}>}
   */
  static async accept (data) {
    const res = await AddFriend.accept(data.fromId, data.userId)
    if (res.code === 1) {
      const roomId = await Room.createRoomId() // 创建房间号
      const newData = {
        id: roomId,
        users: `${data.fromId},${data.userId}`
      }
      const roomRes = await Room.createRoom(newData) // 创建房间
      if (roomRes.code === 1) {
        const msgData = await AddFriend.getMsg(data.fromId, data.userId)
        const saveToUserData = {
          roomId,
          fromId: msgData.fromId,
          userId: msgData.userId,
          text: msgData.message,
          MCreateTime: msgData.createTime,
          isRead: 0
        }
        const saveToFromData = {
          roomId,
          fromId: msgData.userId,
          userId: msgData.fromId,
          text: '我通过了你的朋友验证请求,现在我们可以开始聊天了',
          MCreateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          isRead: 0
        }
        // 把发起添加请求消息写入message表
        await MessageController.saveMsg(saveToUserData)
        // 通过好友验证后把验证消息发送给发起者
        await MessageController.saveMsg(saveToFromData)
        // 通知发起者
        const socketRes = await UserController.getSocketId(data.fromId)
        if (socketRes.code === 1 && socketRes.data.socketId) {
          const notification = {
            nowUserId: data.fromId,
            userId: data.userId, // 前端添加完成后需要改成当前用户id
            roomId,
            fromId: data.userId,
            text: saveToFromData.text,
            time: saveToFromData.MCreateTime
          }
          Socket.toMessageBySocketId(socketRes.data.socketId, 'accept', notification)
        }
        return {
          code: 1,
          data: {
            roomId,
            userId: data.userId,
            fromId: data.fromId,
            text: saveToUserData.text,
            time: saveToUserData.MCreateTime
          }
        }
      } else {
        return {
          code: 0,
          msg: '房间创建失败'
        }
      }
    } else {
      return {
        code: 0,
        msg: res.msg
      }
    }
  }
}

module.exports = AddFriendController
