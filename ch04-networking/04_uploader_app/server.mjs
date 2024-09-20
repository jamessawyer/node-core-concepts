import net from 'node:net'
import { promises as fs } from 'node:fs'
import { prefix, suffix } from './constant.mjs'

const server = net.createServer(() => {
})

server.on('connection', (socket) => {
    console.log('New connection')

    let fileHandle
    let fileWriteStream
    socket.on('data', async (data) => {
        if (!fileHandle) {
            socket.pause() // 等待 fs.open() 打开之前 停止接收客户端发送过来的数据

            // 获取client发送的文件名
            const suffixIdx = data.toString('utf-8').indexOf(suffix)
            // const fileName = data.toString('utf-8').substring(prefix.length, suffixIdx)
            // data 是一个buffer, subarray() 可以从buffer中截取数据
            const fileName = data.subarray(prefix.length, suffixIdx).toString('utf-8')
            console.log('fileName', fileName)

            fileHandle = await fs.open(`storage/${fileName}`, 'w')
            fileWriteStream = fileHandle.createWriteStream()

            // .subarray(suffixIdx + suffix.length) 是为了将开始写入的内容去掉
            fileWriteStream.write(data.subarray(suffixIdx + suffix.length))
            socket.resume()
        } else {
            // 写入数据 如果writable buffer 写满了 就清空之后再写入
            if (!fileWriteStream.write(data)) {
                socket.pause()
            }
        }

        fileWriteStream.on('drain', () => {
            // writable buffer清空后，再开始写入
            socket.resume()
        })
    })

    // 当客户端调用socket.end()时，触发此事件
    socket.on('end', () => {
        console.log('client connection closed')
        fileHandle?.close()
        fileHandle = null
        fileWriteStream = null
    })
})

// `::1` 表示IPv6 loopback地址，类似于 127.0.0.1
server.listen(5050, '::1', () => {
    console.log('Uploader server open on', server.address())
})
