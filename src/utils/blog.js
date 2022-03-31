/**
 * @description 微博数据相关的工具方法
 */

const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

//获取blog-list.ejs的文件内容
const BLOG_LIST_TPL = fs.readFileSync(
    path.join(__dirname, '..', 'views', 'widgets', 'blog-list.ejs')
).toString()

//根据blogList渲染出html字符串
function getBlogListStr(blogList=[].canReply=false) {
    return ejs.render(BLOG_LIST_TPL, {
        blogList,
        canReply
    })
}

module.exports = {
    getBlogListStr
}