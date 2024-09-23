import net from 'node:net'

const socket = net.createConnection({
    port: 8080,
    host: '127.0.0.1'
}, () => {
    // 通过 wireshark 抓取实际发送请求的数据hex
    // 这里发送的数据，这里没有列举完整，实际数据可以通过wireshark抓取
    // host: '127.0.0.1',
    // port: 8080,
    // method: 'POST',
    // path: '/create-path',
    // headers: {
    //     'Content-Type': 'application/json',
    //     'name': 'Kevin Durant' // 自定义header
    // }
    // POST /create-post ....
    const head = Buffer.from('504f......', 'hex')
    // JSON.stringify({
    //     title: '这是文章的标题',
    //     body: '这是文章的主题部分'
    // })
    const body = Buffer.from('7b22.......', 'hex')

    socket.write(Buffer.concat([head, body]))
})

socket.on('data', data => {
    console.log('接收到的响应数据:')
    console.log('data ', data.toString('utf-8'))

    socket.end()
})

socket.on('end', () => {
    console.log('----- socket end -----')
})