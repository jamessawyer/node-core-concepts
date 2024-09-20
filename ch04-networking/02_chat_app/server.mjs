import net from 'node:net'

const server = net.createServer()
const clients = []

server.on('connection', (socket) => { // socket: net.Socket -> Duplex Stream
    
    console.log('a connection to the server')

    const clientId = clients.length + 1

    // 用户进入chat room
    clients.forEach(client => {
        client.socket.write(`User ${clientId} joined!`)
    })

    socket.write(`id-${clientId}`)

    // 接收来自客户端的消息
    socket.on('data', (data) => {
        // 这里接收到的消息格式是 `${id}-message-${message}`
        const dataString = data.toString('utf-8')
        const id = dataString.substring(0, dataString.indexOf('-'))
        // 9 是 `-message-` 的长度
        const message = dataString.substring(dataString.indexOf('-message-') + 9)
        // console.log(data.toString('utf-8'))
        // 将消息转发给每个连接的client
        clients.map((client) => {
            client.socket.write(`> User ${id}: ${message}`)
        })
    })

    // 用户离开chat room
    socket.on('end', () => {
        clients.forEach(client => {
            client.socket.write(`User ${clientId} left!`)
        })
    })

    clients.push({
        id: clientId.toString(),
        socket
    })
})

server.listen(3008, '127.0.0.1', () => {
    console.log(`Opened server on ${JSON.stringify(server.address(), null, 2)}`)
})

