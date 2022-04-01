/**
 * @description 微博view
 */
const router = require('koa-router')()
const { loginRedirect } = require('../../middleware/loginCheck')
const { getProfileBlogList } = require('../../controller/blog-profile')
const {getSquareBlogList}=require('../../controller/blog-square')

//首页
router.get('/', loginRedirect, async (ctx, next) => {
    const userInfo = ctx.session.userInfo
    const { id: userId } = userInfo

    await ctx.render('index', {
        userData: {
            userInfo
        },
    })
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

//广场
router.get('/square', loginRedirect, async (ctx, next) => {
    //获取微博数据 第一页
    const result = await getSquareBlogList(0)
    const { isEmpty, blogList, pageSize, pageIndex, count } = result.data
    await ctx.render('square', {
        isEmpty,
        blogList,
        pageSize,
        pageIndex,
        count
    })
})

module.exports=router