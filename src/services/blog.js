/**
 * @description 微博service
 */

const { Blog,User } = require('../db/model/index')
const {formatUser}=require('./_format')

//创建微博
async function createBlog({ userId, content, image }) {
    const result = await Blog.create({
        userId,
        content,
        image
    })
    return result.dataValues
}

//根据用户获取微博列表
async function getBlogListByUser({userName,pageIndex=0,pageSize=10}) {
    //拼接查询条件
    const whereOpts = {}
    if (userName) {
        whereOpts.userName=userName
    }

    //执行查询(联表查询)
    const result = await Blog.findAndCountAll({
        limit: pageSize,
        offset: pageSize * pageIndex,//分页操作
        order: [
            ['id','desc']
        ],
        include: [
            {
                model: User,
                attributes: ['userName', 'nickName', 'picture'],
                where:whereOpts
            }
        ]
    })

    //获取dataValues
    let blogList=result.rows.map(row=>row.dataValues)
    blogList = blogList.map(blogItem => {
        const user = blogItem.user.dataValues
        blogItem.user = user
        return blogItem
    })

    return {
        count: result.count,
        blogList
    }
}

module.exports = {
    createBlog,
    getBlogListByUser
}