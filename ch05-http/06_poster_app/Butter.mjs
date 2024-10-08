import http from 'node:http'
import fs from 'node:fs/promises'

export default class Butter {
    constructor() {
        this.server = http.createServer()

        /**
         * 根据请求的method + url 进行映射
         * {
         *    'get/': cb,
         *    'post/upload': cb
         * } 
         */
        this.routes = {}
        this.middlewares = []

        this.server.on('request', (req, res) => {
            // send a file back to client
            res.sendFile = async (path, mime) => {
                const fileHandle = await fs.open(path, 'r')
                const rs = fileHandle.createReadStream()
                res.setHeader('Content-Type', mime)

                rs.pipe(res)
            }

            console.log('req.url', req.url)
            console.log('req.method.toLowerCase()', req.method.toLowerCase())
            console.log('this.routes', this.routes)

            res.status = (code) => {
                res.statusCode = code
                return res // for method chaining
            }

            // 发送json数据给客户端（注意：这里只适用于小的数据量，小于highWaterMark）
            res.json = (body) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(body))
            }

            

            // 执行中间件 (递归)
            // 注意这里要用箭头函数 里面使用了this.routes
            const runMiddleware = (req, res, middlewares, index) => {
                if (index === middlewares.length) {
                    // 如果不存在该资源
                    if (!this.routes[req.method.toLowerCase() + req.url]) {
                        return res
                            .status(404)
                            .json({ error: `Cannot ${req.method} ${req.url}`})
                    }

                    return this.routes[req.method.toLowerCase() + req.url](req, res)
                }
                return middlewares[index](req, res, () => runMiddleware(req, res, middlewares, index + 1))
            }

            runMiddleware(req, res, this.middlewares, 0)
        })
    }

    route(method, path, cb) {
        console.log('method', method)
        console.log('path', path)
        this.routes[method + path] = cb
    }

    beforeEach(cb) {
        this.middlewares.push(cb)
    }

    listen(port, host, cb) {
        this.server.listen(port, host, () => {
            cb()
        })
    }
}