import http from 'node:http'

const agent = new http.Agent({
    keepAlive: true
})

// 这里的request 是一个Duplex stream
// https://nodejs.cn/api/http.html#httprequestoptions-callback
const request = http.request({
    agent,
    host: '127.0.0.1',
    port: 8080,
    method: 'POST',
    path: '/create-path',
    headers: {
        'Content-Type': 'application/json',
        'name': 'Kevin Durant' // 自定义header
    }
})

// 监听后端的响应
request.on('response', response => {
    console.log('------- response status -------')
    console.log(response.statusCode)

    console.log('------- response headers -------')
    console.log(response.headers)

    console.log('------- response body -------')
    response.on('data', chunk => {
        console.log(chunk.toString('utf-8'))
    })

    response.on('end', () => {
        console.log('------- response end -------')
    })
})

// 给后端发送请求
request.end(JSON.stringify({
    title: '这是文章的标题',
    body: '这是文章的主题部分'
}))
