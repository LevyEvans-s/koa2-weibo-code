/**
 * @description 微博service
 */

const { Blog,User,UserRelation } = require('../db/model/index')
const {formatUser,formatBlog}=require('./_format')

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

//获取关注者的微博数据（首页）
async function getFollowersBlogList({ userId,pageIndex=0,pageSize=10}) {
    const result = await Blog.findAndCountAll({
        limit: pageSize,//每页多少条
        offset: pageSize * pageIndex,//跳过多少条
        order: [
            ['id','desc']
        ],
        //三表查询
        include: [
            {
                model: User,
                attributes: ['userName', 'nickName', 'picture']
            },
            {
                model: UserRelation,
                attributes: ['userId', 'followerId'],
                where:{userId}
            }
        ]
    })

    let blogList = result.rows.map(row => row.dataValues)
    
    //格式化
    blogList = formatBlog(blogList)
    blogList = blogList.map(blogItem => {
        blogItem.user = formatUser(blogItem.user.dataValues)
        return blogItem
    })
    return {
        count: result.count,
        blogList
    }
}

module.exports = {
    createBlog,
    getBlogListByUser,
    getFollowersBlogList
}