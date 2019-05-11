const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const {
    loginCheck
} = require("../controller/user")
const handleUserRouter = (req, res) => {
    const method = req.method //GET POST

    //登录
    if (method === "POST" && req.path === "/api/user/login") {
        const {
            username,
            password
        } = req.body
        let result = loginCheck(username, password)
        return result.then(data => {
            if (data.username)
                new SuccessModel()
            new ErrorModel('登录失败')
        })
    }
}
module.exports = handleUserRouter