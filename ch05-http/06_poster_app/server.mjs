import Butter from './Butter.mjs'

// session
// [{ userId: 1, token: x12dds23 }]
const SESSIONS = []

const USERS = [
    {id: 1, name: 'Liam Brown', username: 'liam23', password: 'string'},
    {id: 2, name: 'Meredith Green', username: 'merit.sky', password: 'string'},
    {id: 3, name: 'Ben Adams', username: 'ben.poet', password: 'string'},
]

const POSTS = [
    {
        id: 1,
        title: 'This is a post title',
        // https://cn.lipsum.com/
        body: 'Lorem Ipsum，也称乱数假文或者哑元文本， 是印刷及排版领域所常用的虚拟文字。由于曾经一台匿名的打印机刻意打乱了一盒印刷字体从而造出一本字体样品书，Lorem Ipsum从西元15世纪起就被作为此领域的标准文本使用。它不仅延续了五个世纪，还通过了电子排版的挑战，其雏形却依然保存至今。在1960年代，”Leatraset”公司发布了印刷着Lorem Ipsum段落的纸张，从而广泛普及了它的使用。最近，计算机桌面出版软件”Aldus PageMaker”也通过同样的方式使Lorem Ipsum落入大众的视野。',
        userId: 1,
    },
]

const PORT = 8000
const HOST = '127.0.0.1'


const server = new Butter()

// ------ 中间件 ------ //
// 中间件A
// For Authentication
server.beforeEach((req, res, next) => {
    console.log('aaa')
    const routesToAuthenticate = [
        'GET /api/user',
        'PUT /api/user',
        'POST /api/posts',
        'DELETE /api/logout'
    ]

    if (routesToAuthenticate.includes(req.method + ' ' + req.url)) {
        if (req.headers.cookie) {
            // 读取cookie
            const token = req.headers.cookie?.split('=')?.[1]
            const userId = SESSIONS.find(session => session.token === token)?.userId
            if (userId) {
                // 将userId挂载到req上
                req.userId = userId
                return next()
            }
        }

        return res.status(401).json({
            error: '请先登录'
        })
    } else {
        next()
    }
})

// 中间件B
// Parsing body JSON.parse()
const parseJSON = (req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
        // 适用于小于highWaterMark的情况
        const body = []
        req.on('data', chunk => {
            body.push(chunk)
        })
        req.on('end', () => {
            // 将解析的body转换为对象 挂载到req上
            req.body = JSON.parse(Buffer.concat(body).toString())
            return next()
        })
    } else {
        next()
    }
}
server.beforeEach(parseJSON)

// 中间件C
// 需要 index.html 文件的路由
server.beforeEach((req, res, next) => {
    const routes = [
        '/',
        '/login',
        '/profile',
        '/new-post'
    ]
    if (routes.includes(req.url) && req.method === 'GET') {
        res.status(200).sendFile('./public/index.html', 'text/html')
    } else {
        next()
    }
})

// ------ File Routes ------ //
// 
// server.route('get', '/', (req, res) => {
//     res.sendFile('./public/index.html', 'text/html')
// })

// 因为前端是单页应用，浏览器刷新时，也需要返回index.html
// server.route('get', '/login', (req, res) => {
//     res.sendFile('./public/index.html', 'text/html')
// })
// server.route('get', '/profile', (req, res) => {
//     res.sendFile('./public/index.html', 'text/html')
// })


server.route('get', '/styles.css', (req, res) => {
    res.sendFile('./public/styles.css', 'text/css')
})

server.route('get', '/scripts.js', (req, res) => {
    res.sendFile('./public/scripts.js', 'text/javascript')
})

// ------ JSON Routes ------ //

// 获取文章列表
server.route('get', '/api/posts', (req, res) => {
    const posts = POSTS.map(post => ({
        ...post,
        author: USERS.find(user => user.id === post.userId)?.name
    }))
    res.status(200).json(posts)
})

// 新增文章列表
server.route('post', '/api/posts', (req, res) => {
    const title = req.body.title
    const body = req.body.body

    const userId = req.userId

    const post = {id: POSTS.length + 1, title, body, userId}

    POSTS.unshift(post)
    res.status(201).json(post)
})

// 登录并返回token给客户端
server.route('post', '/api/login', (req, res) => {
    // 中间件已经将body挂载到req上了
    const body = req.body
    console.log('body xxx', body)
    const user = USERS.find(user => (user.username === body.username && user.password === body.password))
    if (!user) {
        return res.status(401).json({
            error: '用户或密码错误'
        })
    }

    const token = Math.random().toString(36).slice(2)
    SESSIONS.push({userId: user.id, token})
    console.log('SESSIONS', SESSIONS)

    // 设置cookie 发送给客户端
    res.setHeader('Set-Cookie', `token=${token}; Path=/;`)

    res.status(200).json({
        message: '登录成功'
    })

})
// server.route('post', '/api/login', (req, res) => {
//     let body = ''
//     // 读取请求body
//     req.on('data', chunk => {
//         body += chunk.toString('utf-8')
//     })

//     req.on('end', () => {
//         body = JSON.parse(body)
//         console.log('body', body)
//         const user = USERS.find(user => (user.username === body.username && user.password === body.password))
//         if (!user) {
//             return res.status(401).json({
//                 error: '用户或密码错误'
//             })
//         }

//         const token = Math.random().toString(36).slice(2)
//         SESSIONS.push({userId: user.id, token})
//         console.log('SESSIONS', SESSIONS)

//         // 设置cookie 发送给客户端
//         res.setHeader('Set-Cookie', `token=${token}; Path=/;`)

//         res.status(200).json({
//             message: '登录成功'
//         })

//     })
// })

// 退出登录 删除session
server.route('delete', '/api/logout', (req, res) => {
    // 移除session object
    const sessionIdx = SESSIONS.find(session => session.userId === req.userId)
    if (sessionIdx > -1) {
        SESSIONS.splice(sessionIdx, 1)
    }
    // 移除cookie
    res.setHeader('Set-Cookie', 'token=deleted; Path=/;')
    res.status(200).json({
        message: '退出成功'
    })
})

// 获取用户信息
server.route('get', '/api/user', (req, res) => {
    // 中间件中挂载的userId
    const user = USERS.find(user => user.id === req.userId)
    console.log('user', user)
    res.status(200).json({ username: user.username, name: user.name })
})

// 更新用户信息
server.route('put', '/api/user', (req, res) => {
    const userId = req.userId
    const {username, name, password} = req.body
    // 当前登录用户
    const user = USERS.find(user => user.id === userId)

    user.username = username
    user.name = name
    if (password) {
        // 只有提供了密码才更新
        user.password = password
    }


    res.status(200).json({
        username: user.username,
        name: user.name,
        passwordStatus: password ? '已更新' : '未更新'
    })
})

server.listen(PORT, HOST, () => {
    console.log('Server has started on port ' + PORT)
})
