import dns from 'node:dns/promises'

(async () => {
    // 查询域名 www.baidu.com 的IP
    // https://nodejs.cn/api/dns.html#dnspromiseslookuphostname-options
    const result = await dns.lookup('www.baidu.com')
    // { address: '183.2.172.42', family: 4 }
    console.log('result', result)
})()