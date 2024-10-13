import { stdin, stdout, stderr } from 'node:process'

// 标准输入 -- 双工流
stdin.on('data', (chunk) => {
    console.log(`Got this data from standard in: ${chunk.toString('utf-8')}`)

    // 上面的console.log()等价于下面的 stdout.write()
    // stdout.write(`Got this data from standard in: ${chunk.toString('utf-8')}\n`)
})

// 标准输出 -- 双工流
stdout.write('this is some text from stdout')

// 标准错误 -- 双工流
stderr.write('this is some text from stderr')

// 这3种流可以用数字表示
// stdin - 0
// stdout - 1
// stderr - 2
// node playground.mjs 1>output.txt 2>error.txt
// 上面命令行的输出会被重定向到output.txt（1-stdout）和error.txt（2-stderr）文件中