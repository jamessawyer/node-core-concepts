import fs from 'fs/promises'

// 这里虽然耗时少，但是使用内存偏大，并不是使用stream的最佳实践
// 耗时 612ms
(async () => {
    console.time('writeMany')
    const fd = await fs.open('./test.txt', 'w')
    const ws = fd.createWriteStream()
    for (let i = 0; i < 1_000_000; i++) {
        const buff = Buffer.from(` ${i} `, 'utf-8')
        ws.write(buff, () => {})
    }
    console.timeEnd('writeMany')
})()