const Router = require('koa-router')
const LoginController = require('../../controls/login')
const router = new Router()

router
  .post('/', async (ctx) => {
    const user = ctx.request.body
    const res = await LoginController.login(user)
    ctx.body = res
  })

module.exports = router
