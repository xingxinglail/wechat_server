const Router = require('koa-router')
const MessageController = require('../../controls/message')
const router = new Router()

router
  .post('/', async (ctx) => { // 获取用户所有房间
    const data = ctx.request.body
    const res = await MessageController.getAllRoom(data)
    ctx.body = res
  })

module.exports = router
