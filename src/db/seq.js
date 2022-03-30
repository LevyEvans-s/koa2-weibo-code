const Sequelize = require('sequelize')
const conf = {
    host: 'localhost',
    dialect:'mysql'
}

conf.pool = {
    max: 5,
    min: 0,
    idle:10000
}

const seq=new Sequelize('koa2_weibo_db','root','Mysql05111017',conf)
module.exports=seq