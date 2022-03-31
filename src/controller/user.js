/**
 * @description user controller
 */

const {
    getUserInfo,
    createUser,
    deleteUser,
    updateUser
} = require('../services/user')
const {SuccessModel, ErrorModel}=require('../Model/ResModel')
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo,
    loginFailInfo,
    deleteUserFailInfo,
    changeInfoFailInfo,
    changePasswordFailInfo
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

async function deleteCurUser(userName) {
    const result = await deleteUser(userName)
    if (result) {
        return new SuccessModel()
    }
    return new ErrorModel(deleteUserFailInfo)
}

//修改基本信息(传入ctx的目的是为了改session)
async function changeInfo(ctx,{nickName,city,picture}) {
    const { userName } = ctx.session.userInfo
    if (!nickName) {
        nickName=userName
    }
    //service
    const result = await updateUser(
        {
            newNickName: nickName,
            newCity: city,
            newPicture:picture
        },
        {userName}
    )
    if (result) {
        //执行成功
        Object.assign(ctx.session.userInfo, {
            nickName,
            city,
            picture
        })
        return new SuccessModel()
    }
    //失败
    return new ErrorModel(changeInfoFailInfo)
}

//修改密码
async function changePassword(userName, password, newPassword) {
    const result = await updateUser(
        { newPassword: doCrypto(newPassword) },
        {
            userName,
            password:doCrypto(password)
        }
    )
    if (result) {
        return new SuccessModel()
    }
    return new ErrorModel(changePasswordFailInfo)
}

//退出登录
async function logout(ctx) {
    delete ctx.session.userInfo
    return new SuccessModel()
}

module.exports = {
    isExist,
    register,
    login,
    deleteCurUser,
    changeInfo,
    changePassword,
    logout
}