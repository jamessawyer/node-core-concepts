import { stdin, stdout, stderr, argv, exit } from 'node:process'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// `node cat.mjs myFile.txt` 读取文件名
const filePath = argv[2]

if (filePath) {
    const fileStream = fs.createReadStream(resolve(__dirname, filePath))
    fileStream.pipe(stdout)

    fileStream.on('end', () => {
        stdout.write('\n')
        // 0 - 表示没有错误 正常退出;其余数字表示存在错误
        exit(0)
    })
}

stdin.on('data', data => {
    stdout.write(data.toString('utf-8').toUpperCase())
})
