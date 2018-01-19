const socket = require('socket.io')
const UserController = require('../controls/user')

class Socket {
  /**
   * [ connection 建立socket链接 ]
   * @param server
   */
  static connection (server) {
    Socket.io = socket(server)
    Socket.io.on('connection', (socket) => {
      console.log('---->' + socket.id)
      // 首先更新socketId
      socket.on('setsocketid', (data) => {
        UserController.setSocketId({phone: data.phone, socketId: socket.id})
          .catch(e => {
            console.log(e)
          })
      })
    })
  }

  /**
   * [ toMessageBySocketId 根据socketId向指定客户端发送事件 ]
   * @param [String] socketId
   * @param [String] eventName 事件名
   * @param [Object] data 数据
   */
  static toMessageBySocketId (socketId, eventName, data) {
    console.log(socketId, eventName, data)
    Socket.io.to(socketId).emit(eventName, data)
  }

}

Socket.io = null

module.exports = Socket
