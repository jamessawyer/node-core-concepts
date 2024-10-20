import cluster from 'node:cluster'
import { availableParallelism } from 'node:os'
import cpeak from 'cpeak'


// 机器的逻辑核数(availableParallelism需要Node v18.14.0+)
// https://nodejs.cn/api/os.html#osavailableparallelism
const cpus = availableParallelism()
// 本机是8核
// 因此会有1个父进程，8个子进程
// 父进程一般不会处理业务逻辑，它负责调度子进程去处理
// 父进程如果退出了，子进程也会全部退出

/**
 * 父子进程间通信可以通过 send() 和 on('message')
 * 父进程 -> 子进程  子进程worker.send() + 父进程 cluster.on('message')
 * 子进程 -> 父进程  父进程worker.on('message') + 子进程 process.send()
 */
if (cluster.isPrimary) {
    let requestCount = 0
    console.log('主进程启动，主进程pid: ', process.pid)

    setInterval(() => {
        console.log(`总的requestCount: ${requestCount}`)
    }, 5000)

    for (let i = 0; i < cpus; i++) {
        const worker = cluster.fork()
        worker.send('Send some data')
        console.log('The worker %d is running', worker.process.pid)
    }

    cluster.on('message', (worker, message) => {
        if (message.action && message.action === 'request') {
            requestCount++
            console.log('requestCount: ', requestCount)
        }
    })

    // 监听子进程 fork 事件
    cluster.on('fork', (worker) => {})

    cluster.on('listening', (worker, address) => {})

    // 监听子进程退出事件
    cluster.on('exit', (worker, code, signal) => {
        console.log(`The worker ${worker.process.pid} ${signal || code} died, 重启一个新的...` )
        // 一般如果子进程正常退出就不需要重启了，这里只是演示用
        cluster.fork()
    })
} else {
    console.log('子进程启动')
    const server = new cpeak()
    const PORT = 4000

    // `message` 事件 只有在子进程与父进程通信时才会触发
    // 通过 cluster 或者child_process.fork()
    process.on('message', (message) => {
        `Worker ${process.pid} 接收来自父进程的消息：${message}`
    })



    server.route('get', '/', (req, res) => {
        process.send({ action: 'request' }) // 向父进程发送消息
        res.end('Hello World')
    })

    server.route('get', '/heavy', (req, res) => {
        for (let i = 0; i < 1000000000; i++) {}
        res.end('Heavy Work Done')
    })

    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
}

console.log('0-------')