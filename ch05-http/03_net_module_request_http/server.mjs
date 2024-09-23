import http from 'node:http'

const server = http.createServer()

// 监听客户端发送的请求
server.on('request', (request, response) => {
    console.log('------- request method -------')
    console.log(request.method)
    console.log('------- request url -------')
    console.log(request.url)
    console.log('------- request headers -------')
    console.log(request.headers)

    const name = request.headers['name']

    let data = ''

    request.on('data', chunk => {
        data += chunk.toString('utf-8')
    })

    // 读取结束
    request.on('end', () => {
        console.log('------- request body -------')
        const body = JSON.parse(data)
        console.log(body)

        // setHeader() 可以设置响应头
        // response.setHeader('Content-Type', 'application/json')
        // 返回数据给客户端
        response.writeHead(200, {
            'Content-Type': 'application/json'
        })
        response.end(JSON.stringify({ message: `Post with title ${body.title} was created by ${name}` }))
    })

})

server.listen(8080, '127.0.0.1', () => {
    console.log(`server is listening on: 127.0.0.1:8080`)
})