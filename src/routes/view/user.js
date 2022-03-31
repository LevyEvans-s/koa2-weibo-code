const router = require('koa-router')()
const {loginRedirect}=require('../../middleware/loginCheck')

/**
 * 获取登录信息
 * @param {Object} ctx
 */
function getLoginInfo(ctx) {
    let data = {
        isLogin:false //默认未登录
    }
    const userInfo = ctx.session.userInfo
    if (userInfo) {
        data = {
            isLogin: true,
            userName:userInfo.userName
        }
    }
    return data
}

router.get('/login', async (ctx, next) => {
    await ctx.render('login', getLoginInfo(ctx))
})

router.get('/register', async (ctx, next) => {
    await ctx.render('register', ctx.session.userInfo)
})

router.get('/setting', loginRedirect,async (ctx, next) => {
    //此方法在给模板赋值时，必须一次性将模板里的所有变量都传值，否则会报错。
    await ctx.render('setting',ctx.session.userInfo)
})

module.exports=router