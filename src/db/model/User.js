const seq = require('../seq')
const { STRING, DECIMAL } = require('../types')

const User = seq.define('users', {
    userName: {
        type: STRING,
        allowNull: false,
        unique: true,
        comment:'用户名唯一'
    },
    password: {
        type: STRING,
        allowNull: false,
    },
    nickName: {
        type: STRING,
        allowNull: false,
        comment:"昵称"
    },
    gender: {
        type: DECIMAL,
        allowNull: false,
        defaultValue: 3,
        comment:'性别(1 male,2 female,3 secret)'
    },
    picture: {
        type: STRING,
        comment:'头像 (图片地址)'
    },
    city: {
        type: STRING,
        comment:"城市"
    }
})

module.exports=User