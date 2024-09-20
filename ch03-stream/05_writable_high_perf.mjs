import fs from 'fs/promises'

// 🚀
// 时间: 900.1ms
// 内存: 50M
(async () => {
    console.time('writeMany')
    const fileHandle = await fs.open('./test.txt', 'w')
    const stream = fileHandle.createWriteStream()

    let i = 0

    const writeMany = () => {
        while (i < 1_000_000) {
            const buff = Buffer.from(` ${i} `, 'utf-8')

            if (i === 1_000_000 - 1) {
                // 将最后一个数据写入
                stream.write(Buffer.from(`${1_000_000 - 1}`, 'utf-8'))
                // end() 之后 会触发 `finish` 事件 并且再往writable buffer中写入数据会抛出错误
                stream.end()
                return
            }

            // 如果writable流缓冲区写入的数据满了，这里会返回false，会触发drain事件
            // 然后跳出循环
            if (!stream.write(buff)) {
                break
            }
            i++
        }
    }

    writeMany()

    // 如果writable缓冲区清空完成
    stream.on('drain', () => {
        // 这里的回调，表明writable缓冲区已被清空
        // console.log('drain event')
        // 然后就可以继续向writable buffer 中写入数据了 恢复循环
        writeMany()
    })

    stream.on('finish', () => {
        console.log('finish')
        fileHandle.close()
        console.timeEnd('writeMany')
    })

})()