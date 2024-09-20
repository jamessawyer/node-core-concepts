// https://nodejs.cn/api/dgram.html
import dgram from 'node:dgram'

const receiver = dgram.createSocket('udp4')

receiver.on('message', (msg, rinfo) => {
    console.log(`Received ${msg} from ${rinfo.address}:${rinfo.port}`)
})

receiver.bind({
    address: '127.0.0.1',
    port: 8000
})

receiver.on('listening', () => {
    console.log(`server listening ${receiver.address().address}:${receiver.address().port}`)
})
