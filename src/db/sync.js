const seq = require('./seq')
require('./model/index')

seq.authenticate().then(() => {
    console.log('auth ok')
}).catch(() => {
    console.log('auth err')
})

//执行同步
seq.sync({ force: true }).then(() => {
    console.log('sync ok')
    process.exit()
})