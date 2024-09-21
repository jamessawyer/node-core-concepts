import http from 'node:http'

// 这里的agent类似于 net.createConnection() 用于创建TCP连接
// 通过agent 我们可以复用tcp连接，而不需要重新开启一个新的连接
// https://nodejs.cn/api/http.html#new-agentoptions
const agent = new http.Agent({
    keepAlive: true
})

// 这里的request 是一个Duplex stream
// https://nodejs.cn/api/http.html#httprequestoptions-callback
const request = http.request({
    agent,
    method: 'POST',
    port: 8080,
    host: '127.0.0.1',
    path: '/create-post',
    headers: {
        'Content-Type': 'application/json',
        // 可以指定内容长度
        // 'Content-Length': Buffer.byteLength(JSON.stringify({ message: 'hi there' }), 'utf-8')
    }
})

// `response` 事件只会触发一次
// 回调函数中的 `response` 参数是一个可读流 读取服务端返回的数据
request.on('response', response => {
    // console.log('response ', response)
    response.on('data', data => {
        console.log('data ', data.toString('utf-8'))
    })
})

// 写入数据到服务端
request.write(JSON.stringify({ message: 'hi there' }))
request.write(JSON.stringify({ message: 'How are you doing?' }))
request.write(JSON.stringify({ message: 'Hey you still there?' }))

// end() 方法表示请求结束
request.end(JSON.stringify({ message: 'This is the last message' }))
