const Router = require('koa-router')
const UserController = require('../../controls/user')
const AddFriendController = require('../../controls/add_friend')
const router = new Router()

router
  .post('/', async (ctx) => { // 添加用户
    const { fromId, userId, message } = ctx.request.body
    const res = await UserController.getSocketId(userId)
    if (res.code === 1) {
      const socketId = res.data.socketId
      const res2 = await AddFriendController.addFriend({ fromId, userId, message, socketId })
      if (res2.code === 1) {
        ctx.body = res2
      } else {
        ctx.body = {
          code: 0,
          msg: res.msg
        }
      }
    } else {
      ctx.body = {
        code: 0,
        msg: res.msg
      }
    }
  })
  .post('/message', async (ctx) => { // 获取好友添加请求列表
    const res = await AddFriendController.getAllMessage(ctx.request.body)
    ctx.body = res
  })
  .post('/read', (ctx) => { // 设置好友添加请求为已读
    AddFriendController.readMessage(ctx.request.body)
    ctx.body = {code: 1}
  })
  .post('/accept', async (ctx) => {
    const res = await AddFriendController.accept(ctx.request.body)
    ctx.body = res
  })

module.exports = router
