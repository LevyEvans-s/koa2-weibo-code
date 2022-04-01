/**
 * @description 首页controller
 */
const xss=require('xss')
const { createBlogFailInfo } = require('../Model/ErrorInfo')
const { SuccessModel, ErrorModel } = require('../Model/ResModel')
const {createBlog, getFollowersBlogList}=require('../services/blog')
const {PAGE_SIZE}=require('../config/constant')

//创建微博
async function create({ userId, content, image }) {
    try {
        const blog = createBlog({
            userId,
            content:xss(content),
            image
        })
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