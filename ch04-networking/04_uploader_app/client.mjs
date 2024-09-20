import net from 'node:net'
import { promises as fs } from 'node:fs'
import { basename } from 'path'
import { prefix, suffix } from './constant.mjs'

const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        // dir可能的值 [writeStream.clearLine()](https://nodejs.cn/api/tty.html#writestreamclearlinedir-callback)
        //   - -1 : to the left from cursor
        //   - 1  : to the right from cursor
        //   - 0  : the entire line
        process.stdout.clearLine(dir, () => {
            resolve()
        })
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve()
        })
    })
}

const socket = net.createConnection({
    host: '::1', // ipv6
    port: 5050
}, async () => {
    console.log('Connected to server')
    // const filePath = './text.txt'

    // 从命令行中读取文件名，并传递给后端
    const filePath = process.argv[2]
    const fileName = basename(filePath)

    // 发送文件名给后端
    socket.write(`${prefix}${fileName}${suffix}`)

    // 为了保证光标在最后一行
    console.log()

    const fileHandle = await fs.open(filePath, 'r')
    // 总的文件大小
    const { size: fileSize } = await fileHandle.stat()

    // 上传百分比
    let uploadedPercentage = 0
    // 已上传的字节数
    let bytesUploaded = 0

    // 可读流
    const fileReadStream = fileHandle.createReadStream()

    // 读取文件内容 写入到socket中
    fileReadStream.on('data', async (data) => {
        // 如果写入buffer写满了，就暂停写入
        if (!socket.write(data)) {
            fileReadStream.pause()
        }

        bytesUploaded += data.length
        uploadedPercentage = Math.floor(bytesUploaded / fileSize * 100)
        await moveCursor(0, -1)
        await clearLine(0)
        console.log(`Uploading... ${uploadedPercentage}%`)
    })

    socket.on('drain', () => {
        fileReadStream.resume()
    })

    fileReadStream.on('end', () => {
        console.log('the file was successfully uploaded')
        // 关闭socket
        socket.end()
    })
})

