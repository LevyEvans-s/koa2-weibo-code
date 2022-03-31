/**
 * @description 微博view
 */
const router = require('koa-router')()
const { loginRedirect } = require('../../middleware/loginCheck')
const {getProfileBlogList}=require('../../controller/blog-profile')

//首页
router.get('/', loginRedirect, async (ctx, next) => {
    await ctx.render('index', {})
})

//个人主页
router.get('/profile', loginRedirect, async (ctx, next) => {
    const { userName } = ctx.session.userInfo
    ctx.redirect(`/profile/${userName}`)
})

router.get('/profile/:userName', loginRedirect, async (ctx, next) => {

    const { userName: curUserName } = ctx.params
    
    //获取微博第一页数据
    const result = await getProfileBlogList(curUserName, 0)
    
    await ctx.render('profile', {
        blogData:{
            ...result.data
        }
    })
})

module.exports=router