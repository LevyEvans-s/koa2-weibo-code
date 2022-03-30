/**
 * @description user controller
 */

const {
    getUserInfo,
    createUser
} = require('../services/user')
const {SuccessModel, ErrnoModel}=require('../Model/ResModel')
const {
    registerUserNameNotExistInfo,
    registerUserNameExistInfo,
    registerFailInfo
} = require('../Model/ErrorInfo')
const doCrypto=require('../utils/cryp')

//用户名是否存在
async function isExist(userName) {
    //业务处理逻辑，调用service层做数据处理、格式化
    const userInfo=await getUserInfo(userName)
    if (userInfo) {
        return new SuccessModel(userInfo)
    } else {
        return new ErrnoModel(registerUserNameNotExistInfo)
    }
}

//注册
async function register({ userName, password, gender }) {
    const userInfo = await getUserInfo(userName)
    if (userInfo) {
        //用户名已存在
        return ErrnoModel(registerUserNameExistInfo)
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
        return new ErrnoModel(registerFailInfo)
    }
}

module.exports = {
    isExist,
    register
}