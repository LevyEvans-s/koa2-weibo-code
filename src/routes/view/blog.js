/**
 * @description 微博view
 */
const router = require('koa-router')()
const { loginRedirect } = require('../../middleware/loginCheck')
const { getProfileBlogList } = require('../../controller/blog-profile')
const {getSquareBlogList}=require('../../controller/blog-square')
const { isExist } = require('../../controller/user')
const {getFans}=require('../../controller/user-relation')

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
    const {userName}=ctx.session.userInfo
    ctx.redirect(`/profile/${userName}`)
})

router.get('/profile/:userName', loginRedirect, async (ctx, next) => {
    //已登录用户的信息
    const myUserInfo = ctx.session.userInfo
    const myUserName = myUserInfo.userName
    
    let curUserInfo
    const { userName: curUserName } = ctx.params
    const isMe=myUserName===curUserName
    if (isMe) {
        //是当前登录用户
        curUserInfo=myUserInfo
    } else {
        //不是当前登录用户
        const existResult = await isExist(curUserName)
        if (existResult.errno !== 0) {
            //用户不存在
            return
        }
    }

    //获取微博第一页数据
    const result = await getProfileBlogList(curUserName, 0)
    
    //获取粉丝
    const fansResult = await getFans(curUserInfo.id)
    const {count:fansCount,fansList}=fansResult.data

    //我是否关注了此人
    const amIFollowed = fansList.some(item => {
        return item.userName===myUserName
    })

    await ctx.render('profile', {
        blogData:{
            ...result.data
        },
        userData: {
            userInfo: curUserInfo,
            isMe,
            fanData: {
                count: fansCount,
                list:fansList
            },
            amIFollowed
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