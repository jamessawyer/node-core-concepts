import fs from 'node:fs'

// fs callback要比 fs/promises 要快，但是占用内存更多（空间换时间）
// 耗时4.773s 对比promises版本27s左右，差不多快乐5倍多
(() => {
    console.time('writeMany')
    fs.open('./test.txt', 'w', (err, fd) => {
        if (err) console.error('err', err)
        for (let i = 0; i < 1_000_000; i++) {
            fs.writeFileSync(fd, ` ${i} `)
            // 或者下面异步版本
            // fs.writeFile(fd, ` ${i} `, () => {})
        }
        console.timeEnd('writeMany')
    })
})()