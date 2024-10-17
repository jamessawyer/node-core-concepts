import { spawn } from 'node:child_process'
import fs from 'node:fs'

/**
 * 运行如下命令
 * gcc number_formatter.c -o number_formatter
 * node app.mjs
 */

// 开启一个子进程 --> 调用C程序
// ['./output.txt', '$', ','] 是传给C程序的参数
const numberFormatter = spawn('./number_formatter', ['./output.txt', '$', ','])

// c程序的stdout
numberFormatter.stdout.on('data', (data) => {
    console.log('stdout: ', data.toString('utf-8'))
    // `` 会自动对data调用 toString('utf-8') 方法
    console.log(`stdout: ${data}`)
})

numberFormatter.stderr.on('data', err => {
    console.log(`stderr: ${err}`)
})

numberFormatter.on('close', code => {
    if (code === 0) {
        console.log('文件程度读取，子进程正常退出')
    } else {
        console.log('文件程度读取，子进程异常退出')
    }
})

const fileStream = fs.createReadStream('./src.txt')

// 将可读流写入到 C程序的 stdin 中
fileStream.pipe(numberFormatter.stdin)


// 手动写入
// numberFormatter.stdin.write('122 9000 229292')
// numberFormatter.stdin.write('13332 9020 29292')
