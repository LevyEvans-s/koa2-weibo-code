const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const util = require('util')
const verify=util.promisify(jwt.verify)
const {SECRET}=require('../config/constants')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  let userInfo
  let token
  if (username === 'zs' && password === 'abc') {
    userInfo = {
      userId: 1,
      userName: 'zs',
      nickName: "张三",
      gender:'male'
    }
  }

  if (userInfo === null) {
    ctx.body = {
      errno: -1,
      msg:'登录失败'
    }
    return
  }

  //加密userInfo
  if (userInfo) {
    token=jwt.sign(userInfo,SECRET,{expiresIn:'1h'})
  }
  ctx.body = {
    errno: 0,
    data:token
  }
})

router.get('/getUserInfo', async (ctx, next) => {
  const token = ctx.header.authorization
  try {
    //解析jwt
    const payload=await verify(token.split(' ')[1],SECRET)
    ctx.body = {
      errno: 0,
      userInfo:payload
    }
  } catch (e) {
    ctx.body = {
      errno: -1,
      msg:'token verify failed'
    }
  }
 
})
module.exports = router
