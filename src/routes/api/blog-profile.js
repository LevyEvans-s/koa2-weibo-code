/**
 * @description 个人主页API路由
 */
const router = require('koa-router')()
const { loginCheck } = require('../../middleware/loginCheck')
const { getProfileBlogList}=require('../../controller/blog-profile')
const {getBlogListStr}=require('../../utils/blog')

router.prefix('/api/profile')

//加载更多
router.get('/loadMore/:userName/:pageIndex', loginCheck, async (ctx, next) => { 
    const { userName, pageIndex } = ctx.params
    pageIndex = parseInt(pageIndex)
    const result=await getProfileBlogList(userName,pageIndex)

    //渲染为html字符串
    result.data.blogListTpl=getBlogListStr(result.data.blogList)
    ctx.body=result
})

module.exports=router