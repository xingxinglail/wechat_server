const AddFriend = require('../../models/add_friend')
const UserController  = require('../../controls/user')
const Socket = require('../../socket')

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
      const socketRes = await UserController.getSocketId(data.fromId)
      if (socketRes.code === 1 && socketRes.data.socketId) {
        Socket.toMessageBySocketId(socketRes.data.socketId, 'accept', {userId: data.userId})
      }
      return {
        code: 1
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
