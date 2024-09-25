import http from 'node:http'
import { promises as fs } from 'node:fs'
import { pipeline } from 'node:stream/promises'

const server = http.createServer()

server.on('request', async (request, response) => {
    // 如果请求的是根路由
    if (request.url === '/' && request.method === 'GET') {
        // 返回public下的index.html文件
        // 先要设置一下返回的 Content-Type
        response.setHeader('Content-Type', 'text/html')

        const fd = await fs.open('./public/index.html', 'r')
        const rs = fd.createReadStream()

        // 将文件流通过管道发送给客户端
        await pipeline(
            rs,
            response
        )
        // rs.pipe(response)
    }

    // html中的css
    if (request.url === '/styles.css' && request.method === 'GET') {
        response.setHeader('Content-Type', 'text/css')

        const fd = await fs.open('./public/styles.css', 'r')
        const rs = fd.createReadStream()

        // rs.pipe(response)

        await pipeline(
            rs,
            response
        )
    }

    // html中的js
    if (request.url === '/scripts.js' && request.method === 'GET') {
        response.setHeader('Content-Type', 'text/javascript')

        const fd = await fs.open('./public/scripts.js', 'r')
        const rs = fd.createReadStream()

        // rs.pipe(response)
        await pipeline(
            rs,
            response
        )
    }

    // 返回json 登录
    if (request.url === '/login' && request.method === 'POST') {
        response.setHeader('Content-Type', 'application/json')

        response.statusCode = 200

        const body = {
            message: '登录成功'
        }

        response.end(JSON.stringify(body))
    }

    // 修改
    if (request.url === '/user' && request.method === 'PUT') {
        response.setHeader('Content-Type', 'application/json')

        response.statusCode = 401

        const body = {
            message: '请先登录'
        }

        response.end(JSON.stringify(body))
    }

    // 上传文件 存储到storage文件夹 假设只上传一个PNG图片
    // POSTMAN 中body选择 binary 类型 选择一张png图片进行上传
    if (request.url === '/upload' && request.method === 'POST') {
        const fd = await fs.open('./storage/image.png', 'w')
        const ws = fd.createWriteStream()

        // 写入数据
        request.pipe(ws)

        request.on('end', () => {
            response.statusCode = 200
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({
                message: '图片上传成功'
            }))
        })
    }
})

server.listen(9000, '127.0.0.1', () => {
    console.log(`Server is listening on 127.0.0.1:9000`)
})
