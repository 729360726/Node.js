const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

//session数据
let SESSION_DATA = {}

//用于处理post data
const getPostData = (req) => {
    return new Promise((resolve, reject) => {

        if (req.method !== "POST") {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
}
//设置cookie的过期时间
const getCookieExpires = () => {
    const time = new Date()
    time.setTime(time.getTime() + (24 * 60 * 60 * 1000))
    return time.toGMTString()
}

const serverHandle = (req, res) => {
    //设置返回格式
    res.setHeader('Content-type', 'application/json')
    //获取path
    let url = req.url
    req.path = url.split('?')[0]
    //解析query
    req.query = querystring.parse(url.split("?")[1])
    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) return
        let arr = item.split('='),
            key = arr[0],
            val = arr[1]
        req.cookie[key] = val
    });

    //解析session
    let userid = req.cookie.userid
    let needSetCookie = false
    if (userid) {
        if (!SESSION_DATA[userid])
            SESSION_DATA[userid] = {}
    } else {
        needSetCookie = true
        userid = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userid] = {}
    }
    //一个userid对应一个人账号密码
    req.session = SESSION_DATA[userid]


    getPostData(req).then(postData => {
        req.body = postData

        //处理blog路由
        let blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userid};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        //处理user路由
        let userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userid};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(userData)
                )
            })
            return
        }

        res.writeHead(404, {
            'Content-type': 'text/plain'
        })
        res.write("404 Not Found\n")
        res.end()
    })

}
module.exports = serverHandle