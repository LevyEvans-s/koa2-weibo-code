/**
 * @description 首页controller
 */
const xss=require('xss')
const { createBlogFailInfo } = require('../Model/ErrorInfo')
const { SuccessModel, ErrorModel } = require('../Model/ResModel')
const {createBlog}=require('../services/blog')

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

module.exports = {
    create
}