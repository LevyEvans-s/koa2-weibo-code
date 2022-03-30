const router = require('koa-router')()
const {loginRedirect}=require('../middleware/loginCheck')

router.get('/',loginRedirect, async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

module.exports = router
