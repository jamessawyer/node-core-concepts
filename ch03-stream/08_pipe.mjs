import { promises as fs} from 'node:fs'
import { pipeline } from 'node:stream'

// 🚀 耗时43.2ms
(async () => {
    console.time('copy')
    const readFd = await fs.open('test.txt', 'r')
    const writeFd = await fs.open('dest.txt', 'w')

    // readable stream 模式是non-flowing模式
    // 使用 on('data', () => {}) 或者 .pipe(ws) 后才会变为flowing模式
    const readStream = readFd.createReadStream()
    const writeStream = writeFd.createWriteStream()

    // pipe() 方法会自动处理好readable buffer满了 暂停写入的情况
    // 在实际使用中，最好使用 pipeline() 方法，而不是pipe()方法
    // 因为pipe()方法不容易处理错误
    // readStream.pipe(writeStream)

    // ✅ 自动clean up
    pipeline(readStream, writeStream, err => {
        if (err) {
            console.error(err)
        } else {
            console.log('success')
        }
    })

    readStream.on('end', () => {
            console.timeEnd('copy')
            console.log('done')
        })
})()
