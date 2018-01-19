const Router = require('koa-router')
const RoomController = require('../../controls/room')
const router = new Router()

router
  .post('/', async (ctx) => { // 创建房间
    const data = ctx.request.body
    const res = await RoomController.createRoom(data)
    ctx.body = res
  })

module.exports = router
