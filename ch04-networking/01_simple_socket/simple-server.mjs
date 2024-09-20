import net from 'node:net'

// socket 是一个 Duplex Stream
// net.createServer 会创建一个 TCP server
const server = net.createServer((socket) => {
    socket.on('data', data => {
        console.log(data.toString('utf-8'))
    })
})

// TCP Server
server.listen(8080, '127.0.0.1')