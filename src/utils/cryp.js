/**
 * @description 加密方法
 */
const crypto = require('crypto')
const {CRYPTO_SECRET_KEY}=require('../config/secretKey')


function _md5(str) {
    const md5 = crypto.createHash('md5')
    return md5.update(str).digest('hex')
}

/**
 * 
 * @param {String} content  明文
 */
function doCrypto(content) {
    const str=`password=${content}&key=${CRYPTO_SECRET_KEY}`
    return _md5(str)
}

module.exports = doCrypto