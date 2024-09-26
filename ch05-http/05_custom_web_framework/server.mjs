import Butter from './Butter.mjs'

const PORT = 4040
const HOST = '127.0.0.1'

const server = new Butter()

server.route('get', '/', async (req, res) => {
    res.sendFile('./public/index.html', 'text/html')
})
server.route('get', '/styles.css', async (req, res) => {
    res.sendFile('./public/styles.css', 'text/css')
})
server.route('get', '/scripts.js', async (req, res) => {
    res.sendFile('./public/scripts.js', 'text/javascript')
})

server.route('post', '/login', async (req, res) => {
    res.status(403).json({ message: 'bad credentials' })
})

server.listen(PORT, HOST, () => {
    console.log('server is listening on: 127.0.0.1:4040')
})
