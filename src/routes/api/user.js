/**
 * usr API路由
 */
const router = require('koa-router')()
const {isExist,register,login,deleteCurUser, changeInfo, changePassword, logout}=require('../../controller/user')
const userValidate=require('../../validator/user')
const { genValidator } = require('../../middleware/validator')
const {isTest}=require('../../utils/env')
const {loginCheck}=require('../../middleware/loginCheck')
const {getFollowers}=require('../../controller/user-relation')

router.prefix('/api/user')

//注册
router.post('/register',genValidator(userValidate),async (ctx, next) => {
    const { userName, password, gender } = ctx.request.body
    ctx.body = await register({
        userName,
        password,
        gender
    })
})

//用户名是否存在
router.post('/isExist', async (ctx, next) => {
    const { userName } = ctx.request.body
    ctx.body=await isExist(userName)
})

//登录
router.post('/login', async (ctx, next) => {
    const { userName, password } = ctx.request.body
    //controller
    ctx.body=await login(ctx,userName,password)
})

//删除
router.post('/delete', loginCheck,async (ctx, next) => {
    //测试环境下
    if (isTest) {
        const {userName}=ctx.session.userInfo
        ctx.body=await deleteCurUser(userName)
    }
})

//修改个人信息
router.patch('/changeInfo', loginCheck, genValidator(userValidate), async (ctx, next) => {
    const { nickName, city, picture } = ctx.request.body
    ctx.body=await changeInfo(ctx,{nickName,city,picture})
})


//修改密码
router.patch('/changePassword', loginCheck, genValidator(userValidate), async (ctx, next) => {
    const { password, newPassword } = ctx.request.body
    const { userName } = ctx.session.userInfo
    ctx.body=await changePassword(userName,password,newPassword)
})

//退出登录
router.post('/logout', loginCheck, async (ctx, next) => {
    ctx.body=await logout(ctx)
})

//获取@列表 即关注人列表
router.get('/getAtList', loginCheck, async (ctx, next) => {
    const { id: userId } = ctx.session.userInfo
    const result=await getFollowers(userId)
    const { followerList } = result.data
    const list = followerList.map(user => {
        return `${user.nickName} - ${user.userName}`
    })
    ctx.body=list
})

module.exports=router