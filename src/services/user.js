/**
 * @description user service
 */

const { User } = require('../db/model/index')
const { formatUser } = require('./_format')

//获取用户信息
async function getUserInfo(userName, password) {
    const whereOpt = {
        userName
    }
    if (password) {
        Object.assign(whereOpt,{password})
    }
    const result = await User.findOne({
        attribute: ['id', 'userName', 'nickName', 'picture', 'city'],
        where:whereOpt
    })
    if (result == null) {
        //未找到
        return result
    }

    //格式化
    const formatRes=formatUser(result.dataValues)
    return formatRes
}

//注册用户
async function createUser({ userName,password,gender=3},nickName) {
    const result = await User.create({
        userName,
        password,
        nickName:nickName?nickName:userName,
        gender
    })
    return result.dataValues
}

module.exports = {
    getUserInfo, 
    createUser
}