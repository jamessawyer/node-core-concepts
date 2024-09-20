import net from 'node:net'

// clients
const socket = net.createConnection({
    port: 8080,
    host: '127.0.0.1'
}, () => {
    socket.write('this is a message from simple-sender')
    // const buff = Buffer.alloc(2)
    // buff[0] = 21
    // buff[1] = 34
    // socket.write(buff)
})

