## bash管道符 `|`

`|` 将一个输出流传给另一个命令

```bash
# 将stdout输出传给 tr程序，将字符转换为大写，
# tr进程只会收到stdout的数据，而不会收到 stderr 的数据
node playground.mjs | tr 'a-z' 'A-Z'
```

## 重定向 `>` & `<`
将输出重定向到文件

假设 `playground.mjs` 代码为：
```js
import { stdout, stderr } from 'node:process'

stdout.write('this is from stdout')
stderr.write('this is from stderr')
```
输入命令
```bash
# 1代表stdout
# 2代表stderr
node playground.mjs 1>output.txt 2>err.txt
```
因为 `>` 默认就是 `stdout`,因此上面的命令也可以写成 
```bash
node playground.mjs >output.txt 2>err.txt
```
可以看到stdout和stderr的内容分别写入到 `output.txt` & `err.txt` 文件中

> 从文件中读取数据到stdin

假设 `playground.mjs` 代码为：

```js
import { stdin } from 'node:process'

stdin.on('data', (data) => {
    console.log(data.toString('utf-8'))
})
```
输入命令
```bash
node playground.mjs 0<input.txt

# 0代表stdin
# 因此等价于
node playground.mjs <input.txt
```
可以看到terminal会打印 `input.txt` 文件的内容


## `/dev/null` 文件
将输出重定向到`/dev/null`文件，它不会生成文件
```bash
# 将stderr输出到 /dev/null 不生成文件
node playground.mjs 2 > /dev/null
```

## append to File `>>`
将输出追加到文件
```bash
# 将stderr输出追加到文件
node playground.mjs 2 >> err.txt
```