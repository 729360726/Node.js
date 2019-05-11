const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require("../controller/blog")
const {
    SuccessModel,
    ErrorModel
} = require('../model/resModel')
const handleBlogRouter = (req, res) => {
    const method = req.method //GET POST
    let id = req.query.id

    //获取博客列表
    if (method === "GET" && req.path === "/api/blog/list") {
        let author = req.query.author || '',
            keyword = req.query.keyword || '',
            result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    //获取博客详情
    if (method === "GET" && req.path === "/api/blog/detail") {
        let result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    //新建一篇博客
    if (method === "POST" && req.path === "/api/blog/new") {
        req.body.author = 'zhangsan'
        let result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    //更新一篇博客
    if (method === "POST" && req.path === "/api/blog/update") {
        let result = updateBlog(id, req.body)
        return result.then(val => {
            if (val)
                return new SuccessModel()
            else
                return new ErrorModel('更新博客失败')
        })
    }

    //删除一篇博客
    if (method === "POST" && req.path === "/api/blog/delete") {
        const author = 'zhangsan'
        let result = delBlog(id, author)
        return result.then(val => {
            if (val)
                return new SuccessModel()
            else
                return new ErrorModel('删除博客失败')
        })
    }
}
module.exports = handleBlogRouter