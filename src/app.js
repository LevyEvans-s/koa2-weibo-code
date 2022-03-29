const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// const jwtKoa=require('koa-jwt')
const session = require('koa-generic-session')
const redisStore=require('koa-redis')
const { REDIS_CONF } = require('./config/db')
const { isProd } = require('./utils/env')

//路由
const index = require('./routes/index')
const users = require('./routes/users')
const errorViewRouter = require('./routes/views/error')

const {SECRET}=require('./config/constants')

// error handler
const onerrorConf = {}
if (isProd) {
  onerrorConf = {
    redirect:'/error'
  }
}
onerror(app,onerrorConf)

// app.use(jwtKoa({
//   secret:SECRET
// }).unless({
//   path:[/^\/users\/login/]//自定义哪些目录忽略jwt
// }))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

//session配置
app.keys = ['dn9UOJD9*92_)(1D']
app.use(session({
  key: 'weibo.sid',
  prefix: 'weibo:sess',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge:24*60*60*1000
  },
  store: redisStore({
    all:`${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(errorViewRouter.routes(),errorViewRouter.allowedMethods()) //404路由注册到最下面

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
