const {
    exec
} = require('../db/mysql')
let getList = (author, keyword) => {
    let sql = `select *from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc`
    return exec(sql)
}
let getDetail = (id) => {
    let sql = `select *from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}
let newBlog = (blogData = {}) => {
    let title = blogData.title,
        content = blogData.content,
        author = blogData.author,
        createtime = Date.now()
    const sql = `
    insert blogs (title,content,createtime,author)
    value('${title}','${content}','${createtime}','${author}')
    `
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}
let updateBlog = (id, blogData = {}) => {
    let title = blogData.title,
        content = blogData.content
    const sql = `
        update blogs set title='${title}',content='${content}' where id=${id}
        `
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0)
            return true
        return false
    })
}
let delBlog =(id,author) => {
    const sql = `
        delete from blogs where id=${id} and author='${author}'
        `
        return exec(sql).then(deleteData => {
            if (deleteData.affectedRows > 0)
                return true
            return false
        })
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}