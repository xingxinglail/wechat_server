const Router = require('koa-router')
const UserController = require('../../controls/user')
const router = new Router()

router
  .post('/search', async (ctx) => { // 用户搜索
    const value = ctx.request.body
    const res = await UserController.findUser(value)
    ctx.body = res
  })
  .post('/friends', async (ctx) => { // 获取好友列表
    const value = ctx.request.body
    const res = await UserController.getFriends(value)
    ctx.body = res
  })
  .post('/getuser', async (ctx) => { // 根据微信id获取一个用户
    const value = ctx.request.body
    const res = await UserController.findUserByWechatId(value)
    ctx.body = res
  })

module.exports = router
