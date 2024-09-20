import fs from 'node:fs/promises'

(async () => {
    console.time('readable')
    const readFd = await fs.open('./test.txt', 'r')
    const writeFd = await fs.open('./even-numbers.txt', 'w')

    const readStream = readFd.createReadStream({
        highWaterMark: 64 * 1024
    })
    const writeStream = writeFd.createWriteStream()

    // 将偶数写入到 even-numbers.txt 文件中

    // 这里的split用于保存因为字节长度被拆分为两半的数字
    // 这种情况只存在于数组的结尾和开头位置
    let split = ''

    readStream.on('data', chunk => {
        const numbers = chunk.toString('utf-8').split('  ')

        // 因为chunk流可能将一个数字拆分为2半，导致读取的数字不对

        // 如果数组的第1个数字 + 1 ！== 后面的第2个数字 说明数字存在被拆分的情况
        if (Number(numbers[0]) + 1 !== Number(numbers[1])) {
            if (split) {
                // 将其加起来
                numbers[0] = split.trim() + numbers[0].trim()
            }
        }

        if (Number(numbers[numbers.length - 2]) + 1 !== Number(numbers[numbers.length - 1])) {
            // 将这段chunk中的最后一个数字取出来
            split = numbers.pop()
        }
        numbers.forEach(num => {
            let n = Number(num)

            if (n % 2 === 0) {
                if (!writeStream.write(` ${n} `)) {
                    readStream.pause()
                }
            }
        })
    })

    // writable buffer 满了时 会触发 drain event
    writeStream.on('drain', () => {
        // callback 表示 drain event 完成，
        // 我们可以使用readStream继续读取数据到writable buffer中
        readStream.resume()
    })

    readStream.on('end', () => {
        writeStream.end()
        readFd.close()
        writeFd.close()
        console.timeEnd('readable')
    })
})()