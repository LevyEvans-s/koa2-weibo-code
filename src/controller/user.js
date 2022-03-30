/**
 * @description user controller
 */

const {
    getUserInfo,
    createUser
} = require('../services/user')
const {SuccessModel, ErrorModel}=require('../Model/ResModel')
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
    loginFailInfo
} = require('../Model/ErrorInfo')
const doCrypto=require('../utils/cryp')

//用户名是否存在
async function isExist(userName) {
    //业务处理逻辑，调用service层做数据处理、格式化
    const userInfo=await getUserInfo(userName)
    if (userInfo) {
        return new SuccessModel(userInfo)
    } else {
        return new ErrorModel(registerUserNameNotExistInfo)
    }
}

//注册
async function register({ userName, password, gender }) {
    const userInfo = await getUserInfo(userName)
    if (userInfo) {
        //用户名已存在
        return ErrorModel(registerUserNameExistInfo)
    }
    try {
        await createUser({
            userName,
            password:doCrypto(password),
            gender
        })
        return new SuccessModel()
    } catch (e) {
        console.error(e.message,e.stack)//日志
        return new ErrorModel(registerFailInfo)
    }
}

//登录
async function login(ctx,userName,password) {
    const userInfo=await getUserInfo(userName,doCrypto(password))
    if (!userInfo) {
        return new ErrorModel(loginFailInfo)
    }
    //登录成功
    if (ctx.session.userInfo == null) {
        ctx.session.userInfo=userInfo
    }
    return new SuccessModel()
}

module.exports = {
    isExist,
    register,
    login
}