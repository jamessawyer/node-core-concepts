import net from 'node:net'

// 创建一个客户端 这里传入的是 Path, 用于ipc通信
// ipc通信要比网络通信更快
// 这里的 '/tmp/node_c_socket' 类似于网络通信的端口，它是和C程序通信的一个媒介
const client = net.createConnection({ path: '/tmp/node_c_socket' })

client.on('connect', () => {
    console.log('Connected to the C Server')
})

const b = Buffer.alloc(8)
b[0] = 0x12
b[1] = 0x54
b[2] = 0xfa
client.end(b)

client.on('data', data => {
    console.log('Received data from C Server: ', data.toString('utf-8'))
})

client.on('end', () => {
    console.log('C Server disconnected')
})

client.on('error', err => {
    console.log('Error: ', err)
})