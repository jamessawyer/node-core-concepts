import { spawn } from 'node:child_process'
import { stdin, stdout, stderr } from 'node:process'

// 这里的 ./playground 是 playground.c 经过gcc编译后的可执行文件
// gcc playground.c -o playground
// spawn() 会打开一个子进程
spawn(
    './playground',
    ['some string', '-f', 34, '-u'],
    {
        env: {
            MODE: 'development'
        }
    }
)

subprocess.stdout.on('data', data => {
    console.log('data', data.toString('utf-8'))
})
subprocess.stderr.on('data', data => {
    console.log('获取来自C程序的stderr信息：', data.toString('utf-8'))
})

subprocess.stdin.write('来自Node的消息（写个C程序）')
subprocess.stdin.end()
