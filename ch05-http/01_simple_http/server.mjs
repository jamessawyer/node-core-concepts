import http from 'node:http'

const server = http.createServer()

// request  在服务端是一种 可读流
// response 在服务端是一种 可写流
server.on('request', (request, response) => {
    console.log('------- request method -------')
    console.log(request.method)
    console.log('------- request url -------')
    console.log(request.url)
    console.log('------- request headers -------')
    console.log(request.headers)

    console.log('------- request body -------')
    // chunk 是一种buffer
    request.on('data', chunk => {
        console.log(chunk.toString('utf-8'))
    })

    request.on('end', () => {
        response.end('hi')
    })
})

server.listen(8080, '127.0.0.1', () => {
    console.log(`server is listening on: 127.0.0.1:8080`)
})