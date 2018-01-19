const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const Socket = require('./socket')
const query = require('./db')
const router = require('./api')
const forums = new Router()
const app = new Koa()
const server = http.createServer(app.callback())

// 设置全局mysql句柄
global.query = query

Socket.connection(server)

forums.use('/api', router.routes(), router.allowedMethods())

app
  .use(koaBody())
  .use(async (ctx, next) => {
    await next()
    ctx.set('Access-Control-Allow-Origin', '*')
  })
  .use(forums.routes())

server.listen(3000)


