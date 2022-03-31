const Koa = require('koa')
const app = new Koa()
const path=require('path')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const koaStatic=require('koa-static')
const { REDIS_CONF } = require('./config/db')
const { isProd } = require('./utils/env')
const {SESSION_SECRET_KEY}=require('./config/secretKey')

//路由
const blogHomeAPIRouter=require('./routes/api/blog-home')
const blogViewRouter=require('./routes/view/blog')
const utilsAPIRouter=require('./routes/api/utils')
const userViewRouter=require('./routes/view/user')
const userAPIRouter=require('./routes/api/user')
const errorViewRouter = require('./routes/view/error')

// error handler
const onerrorConf = {}
if (isProd) {
  onerrorConf = {
    redirect:'/error'
  }
}
onerror(app,onerrorConf)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(koaStatic(path.join(__dirname , '/public')))
app.use(koaStatic(path.join(__dirname , '..','uploadFiles')))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

//session配置
app.keys = [SESSION_SECRET_KEY]
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
app.use(blogHomeAPIRouter.routes(),blogHomeAPIRouter.allowedMethods())
app.use(blogViewRouter.routes(),blogViewRouter.allowedMethods())
app.use(utilsAPIRouter.routes(),userAPIRouter.allowedMethods())
app.use(userViewRouter.routes(),userViewRouter.allowedMethods())
app.use(userAPIRouter.routes(),userAPIRouter.allowedMethods())
app.use(errorViewRouter.routes(),errorViewRouter.allowedMethods()) //404路由注册到最下面

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
