/**
 * @description 首页controller
 */
const xss=require('xss')
const { createBlogFailInfo } = require('../Model/ErrorInfo')
const { SuccessModel, ErrorModel } = require('../Model/ResModel')
const {createBlog, getFollowersBlogList}=require('../services/blog')
const {PAGE_SIZE,REG_FOR_AT_WHO}=require('../config/constant')
const { getUserInfo } = require('../services/user')
const { createAtRelation } = require('../services/at-relation')

async function create({ userId, content, image }) {
    // 分析并收集 content 中的 @ 用户
    // content 格式如 '哈喽 @李四 - lisi 你好 @王五 - wangwu '
    const atUserNameList = []
    content = content.replace(
        REG_FOR_AT_WHO,
        (matchStr, nickName, userName) => {
            // 目的不是 replace 而是获取 userName
            atUserNameList.push(userName)
            return matchStr // 替换不生效，预期
        }
    )

    // 根据 @ 用户名查询用户信息
    const atUserList = await Promise.all(
        atUserNameList.map(userName => getUserInfo(userName))
    )

    // 根据用户信息，获取用户 id
    const atUserIdList = atUserList.map(user => user.id)//存储的都是被@的用户

    try {
        //创建微博
        const blog = await createBlog({
            userId,
            content:xss(content),
            image
        })
         // 创建 @ 关系
         await Promise.all(atUserIdList.map(
            userId => createAtRelation(blog.id, userId)
        ))

        return new SuccessModel(blog)
    } catch (e) {
        console.error(e.message, e.stack)
        return new ErrorModel(createBlogFailInfo)
    }
}

//获取第一页数据
async function getHomeBlogList(userId,pageIndex=0){
    const result = await getFollowersBlogList({ userId, pageIndex, pageSize:PAGE_SIZE })
    const { count, blogList } = result
    
    //返回
    return new SuccessModel({
        isEmpty: blogList.length === 0,
        blogList,
        pageSize: PAGE_SIZE,
        pageIndex,
        count
    })
}

module.exports = {
    create,
    getHomeBlogList
}