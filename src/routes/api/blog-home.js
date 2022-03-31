/**
 * @description 首页API
 */

const router = require('koa-router')()
const { create } = require('../../controller/blog-home')
const {loginCheck}=require('../../middleware/loginCheck')
const { genValidator } = require('../../middleware/validator')
const blogValidate=require('../../validator/blog')

router.prefix('/api/router')

//创建微博
router.post('/create', loginCheck,genValidator(blogValidate), async (ctx, next) => {
    const { content, image } = ctx.request.body
    const { id: userId } = ctx.session.userInfo
    ctx.body = await create({userId,content,image})
})
module.exports=router