import dgram from 'node:dgram'

const client = dgram.createSocket('udp4')

// https://nodejs.cn/api/dgram.html#socketsendmsg-offset-length-port-address-callback
client.send('This a udp string message', 8000, '127.0.0.1', (error, bytes) => {
    if (error) {
        console.error(error)
        return
    }
    console.log(`send bytes: ${bytes}`)
    client.close()
})
