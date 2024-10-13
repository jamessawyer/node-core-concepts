import { spawn, exec } from 'node:child_process'

console.log('命令行所有参数', process.argv)
console.log('进程id', process.pid)
console.log('父进程id', process.ppid)

// spawn() 会打开一个子进程
const subprocess = spawn(
    'echo',
    ['hello world'],
    {
        // env: process.env, // 默认将环境变量传递给子进程
        // 一般变量用小写 环境变量一般用大写
        env: { MODE: 'development' }, // 也可以将指定环境变量传递给子进程
    }
)

subprocess.stdout.on('data', (data) => {
    console.log(data.toString('utf-8'))
})

exec(
    "echo 'something string' | tr ' ' '\n'",
    {
        shell: '/bin/zsh'
    },
    (error, stdout, stderr) => {
        if (error) {
            console.error(error)
            return
        }
    }
)