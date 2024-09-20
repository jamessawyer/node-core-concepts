// const fs = require('fs/promises')
import fs from 'fs/promises'


(async () => {
    const COMMANDS = {
        createFile: 'create a file',
        deleteFile: 'delete a file',
        renameFile: 'rename a file',
        appendFile: 'append a file'
    }

    // 创建文件
    const createFile = async (path) => {
        // 1. 先检查文件是否已经存在
        try {
            // 如果文件能成功打开，则表明文件已经存在了
            const existingFileHandle = await fs.open(path, 'r')
            console.log(`file ${path} already exists`)
            existingFileHandle?.close()
        } catch (err) {
            // 2. 不存在则创建 w-open file for writing
            const newFileHandle = await fs.open(path, 'w')
            console.log('a new file is created')

            // 打开后记得关闭
            newFileHandle.close()
        }
    }

    // 删除文件
    const deleteFile = async (path) => {
        try {
            await fs.unlink(path)
        } catch(e) {
            if (e.code === 'ENOENT') {
                console.log('文件不存在')
            } else {
                console.log('文件删除异常', e)
            }
        }
    }

    // 文件重命名
    const renameFile = async (oldPath, newPath) => {
        try {
            await fs.rename(oldPath, newPath)
        } catch(e) {
            if (e.code === 'ENOENT') {
                console.log('文件不存在或者目标文件已存在')
            } else {
                console.log('文件删除异常', e)
            }
        }
    }

    // WARNING: 由于事件存在可能触发2次的可能，导致数据添加2次
    // 添加内容到文件
    const appendFile = async (path, content) => {
        // 或者直接使用 fs.appendFile(path, content) 它底层也是调用的 fs.open('a')
        try {
            // 1. 先打开文件
            const fileHandle = await fs.open(path, 'a')
            // 2. 写入内容
            await fileHandle.write(content)
            fileHandle.close()
        } catch(err) {
            console.log('文件不存在或者写入异常')
        }
    }

    
    // 监控真个目录
    // const watcher = fs.watch('./')
    // for await (const event of watcher) {
    //     console.log('event', event)
    //     if (event.eventType === 'change' && event.filename === 'command.txt') {
    //         console.log('command file changed')
    //     }
    // }

    // 打开文件 r - 读模式， 程序结束后记得关闭打开的文件
    const commandFileHandler = await fs.open('./command.txt', 'r')

    commandFileHandler.on('change', async () => {
        // 1. 先找出文件内容的长度
        const { size } = await commandFileHandler.stat()
        // 用于装载读取的内容，根据文件尺寸定义对应的大小
        const buff = Buffer.alloc(size)

        // 从buff哪个位置开始填充读取到的内容
        const offset = 0
        // 读取的字节数
        const length = buff.byteLength
        // 从文件的那个位置开始读取内容
        const position = 0

        // 2. 通过 Buffer.alloc(size) 分配文件所需的字节空间，避免浪费
        await commandFileHandler.read(buff, offset, length, position)
        console.log('buff', buff.toString('utf-8'))
        const command = buff.toString('utf-8')

        // 命令1： 创建文件
        // create a file:
        // create a file <path>
        if (command.startsWith(COMMANDS.createFile)) {
            const filePath = command.substring(COMMANDS.createFile.length + 1)
            createFile(filePath)
        }

        // 命令2：删除文件
        // delete a file:
        // delete a file <path>
        if (command.startsWith(COMMANDS.deleteFile)) {
            const filePath = command.substring(COMMANDS.deleteFile.length + 1)
            deleteFile(filePath)
        }

        // 命令3：修改文件名字
        // rename a file:
        // rename a file <odlPath> to <newPath>
        if (command.startsWith(COMMANDS.renameFile)) {
            const fileSplit = ' to '
            const _idx = command.indexOf(fileSplit)
            const oldPath = command.substring(COMMANDS.renameFile.length + 1, _idx)
            const newPath = command.substring(_idx + fileSplit.length)
            // const [oldPath, newPath] = command.substring(COMMANDS.renameFile.length + 1).split(' ')
            renameFile(oldPath, newPath)
        }

        // 命令4：添加内容到文件
        // append a file:
        // append a file <path> this content: <content>
        if (command.startsWith(COMMANDS.appendFile)) {
            const split = ' this content: '
            const _idx = command.indexOf(split)
            const filePath = command.substring(COMMANDS.appendFile.length + 1, _idx)
            const content = command.substring(_idx + split.length)
            appendFile(filePath, content)
        }
    })
    
    // 监听文件变化
    const watcher = fs.watch('./command.txt')

    for await (const event of watcher) {
        console.log('event', event)
        if (event.eventType === 'change') {
            commandFileHandler.emit('change')
        }
    }
})()


// (async () => {
//     try {
//         const copy = await fs.copyFile('./file.txt', './copied-file.txt')
//     } catch(err) {
//         console.log('err', err)
//     }
// })()