const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const {
    login
} = require("../controller/user")
const handleUserRouter = (req, res) => {
    const method = req.method //GET POST

    //设置cookie的过期时间
    const getCookieExpires = () => {
        const time = new Date()
        time.setTime(time.getTime() + (24 * 60 * 60 * 1000))
        return time.toGMTString()
    }

    //登录
    if (method === "POST" && req.path === "/api/user/login") {
        const {
            username,
            password
        } = req.body
        let result = login(username, password)
        return result.then(data => {
            if (data.username) {
                req.session.username = data.username
                req.session.realname = data.realname

                return new SuccessModel()
            }

            return new ErrorModel('登录失败')
        })
    }

    //登录测试
    // if (method === "GET" && req.path === '/api/user/login-test') {
    //     if (req.session.username)
    //         return Promise.resolve(new SuccessModel({
    //             session: req.session
    //         }))
    //     return Promise.resolve(new ErrorModel('尚未登录'))
    // }
}
module.exports = handleUserRouter