import fs from 'fs/promises'

(async () => {
    const fd = await fs.open('./test.txt', 'w')

    const stream = fd.createWriteStream()

    // 表示可写流缓冲区的大小，默认是16kb (16384字节)
    console.log(stream.writableHighWaterMark)
    // 表示缓冲区写入数据的大小
    console.log('writableLength 1', stream.writableLength)
    
    // 假设缓冲区是16384字节，每次写入16384字节，可写流缓冲区就会触发drain事件
    const buff = Buffer.alloc(16383, 'a')
    // 如果可写缓冲区能够成功写入数据，这里会返回true, 如果缓冲区满了，这里会返回false，同时会触发 drain event
    console.log(stream.write(buff))
    console.log(stream.write(Buffer.alloc(1, 'a')))
    console.log('writableLength 2', stream.writableLength) // 16384


    // 当可写缓冲区被完全冲刷完时，触发drain事件
    stream.on('drain', () => {
        console.log(stream.write(Buffer.alloc(1, 'a')))
        console.log('writableLength 3', stream.writableLength)  // 1
        console.log('触发drain event')
    })
})()