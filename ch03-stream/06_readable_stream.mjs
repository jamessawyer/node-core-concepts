import fs from 'fs/promises'

// 拷贝大文件 这种方式效率很高
(async () => {
    // 将 test.txt 文件写入到 dest.txt 中
    const readFd = await fs.open('./test.txt', 'r')
    const writeFd = await fs.open('./dest.txt', 'w')
    const readStream = readFd.createReadStream({
        highWaterMark: 64 * 1024, // 64kb 可读缓冲区大小(这也是默认的值)
    })
    const writeStream = writeFd.createWriteStream()

    /**
     * 不要这样写，如果文件很大，会导致内存消耗量很大，耗时很长
     * 要像下面那样writable buffer满了，就暂停读取数据，drain事件触发后再恢复读取
     */
    // readStream.on('data', chunk => {
    //     writeStream.write(chunk)
    // })
    
    readStream.on('data', chunk => {
        // 写过数据，如果writable buffer 满了，这里会返回false，会触发drain事件
        if (!writeStream.write(chunk)) {
            // 如果writable buffer满了，就暂停读取数据
            readStream.pause()
        }
    })

    writeStream.on('drain', () => {
        // writable buffer被清空了，就可以继续读取数据了
        readStream.resume()
    })

    readStream.on('end', () => {
        // 读取结束，写入也结束了
        writeStream.end()
        readFd.close()
        writeFd.close()
    })
})()

