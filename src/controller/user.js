/**
 * @description user controller
 */

const {getUserInfo}=require('../services/user')
const {SuccessModel, ErrnoModel}=require('../Model/ResModel')
const {
    registerUserNameNotExistInfo
} = require('../Model/ErrorInfo')

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
module.exports = {
    isExist
}