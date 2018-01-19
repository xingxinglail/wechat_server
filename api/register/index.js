const Router = require('koa-router')
const RegisterController = require('../../controls/register')
const router = new Router()

router
  .post('/', async (ctx) => {
    const user = ctx.request.body
    const res = await RegisterController.register(user)
    ctx.body = res
  })

module.exports = router
