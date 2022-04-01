/**
 * @description 微博@关系
 */

const { SuccessModel } = require('../Model/ResModel')
const { getAtRelationCount } = require('../services/at-relation')

//获取@我的微博数量
async function getAtMeCount(userId) {
    const count = await getAtRelationCount(userId) 
    return new SuccessModel({
        count
    })
}

module.exports = {
    getAtMeCount
}