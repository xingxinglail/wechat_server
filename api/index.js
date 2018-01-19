const Router = require('koa-router')
const forums = new Router()
const registerRouter = require('./register')
const loginRouter = require('./login')
const userRouter = require('./user')
const addFriendRouter = require('./add_friend')
const RoomRouter = require('./room')
const MessageRouter = require('./message')

forums.use('/register', registerRouter.routes(), registerRouter.allowedMethods())
forums.use('/login', loginRouter.routes(), loginRouter.allowedMethods())
forums.use('/user', userRouter.routes(), userRouter.allowedMethods())
forums.use('/addfriend', addFriendRouter.routes(), addFriendRouter.allowedMethods())
forums.use('/room', RoomRouter.routes(), RoomRouter.allowedMethods())
forums.use('/message', MessageRouter.routes(), MessageRouter.allowedMethods())

module.exports = forums

