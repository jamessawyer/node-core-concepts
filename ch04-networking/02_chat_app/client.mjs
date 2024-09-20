import net from 'node:net'
import readline from 'node:readline/promises'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        // dir可能的值 [writeStream.clearLine()](https://nodejs.cn/api/tty.html#writestreamclearlinedir-callback)
        //   - -1 : to the left from cursor
        //   - 1  : to the right from cursor
        //   - 0  : the entire line
        process.stdout.clearLine(dir, () => {
            resolve()
        })
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve()
        })
    })
}

let id
const socket = net.createConnection({
    host: '127.0.0.1',
    port: 3008,
}, async () => {
    console.log('Connected to server')

    const ask = async () => {
        const message = await rl.question(`Enter a message > `)
        // 将光标移动到上一行
        await moveCursor(0, -1)
        // 然后清除当前console行
        await clearLine(0)
        // 写给服务端
        socket.write(`${id}-message-${message}`)
    }

    ask()

    // 接收来自服务端的消息
    socket.on('data', async (data) => {
        // 空白行
        console.log()
        await moveCursor(0, -1)
        await clearLine(0)

        // id的格式 `id-${num}`
        if (data.toString('utf-8').substring(0, 2) === 'id') {
            // 当获取的是id时
            id = data.toString('utf-8').substring(3)
            console.log(`Your id is ${id}!\n`)
        } else {
            // 当获取的是message时
            console.log(data.toString('utf-8'))
        }
        ask()
    })
})

socket.on('close', () => {
    console.log('Connection closed')
})

socket.on('end', () => {
    console.log(`connection ended`)
    process.exit(1)
})
