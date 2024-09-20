import fs from 'fs/promises'

// 本电脑耗时差不多27s
(async () => {
    console.time('writeMany')
    const fileHandle = await fs.open('./test.txt', 'w')
    for (let i = 0; i < 1_000_000; i++) {
        await fileHandle.write(` ${i} `)
    }
    console.timeEnd('writeMany')
    fileHandle.close()
})()
