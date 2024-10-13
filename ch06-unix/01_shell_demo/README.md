## bash中设置函数

在zsh或者bash中设置函数：

```bash
cur() {
    pwd
}
```
上面的函数将打印 `pwd` 命令，查看当前工作目录。查看 `cur` 函数的定义:

```bash
type cur

# cur is a shell function
```

删除上面的 `cur()` 函数：
```bash
unset -f cur

type cur
# cur not found
```

## 设置别名和取消别名
```bash
# 给pwd设置一个别名
alias cur='pwd'
```

取消别名：
```bash
unalias cur
```

## $PATH
打印所有的环境变量
```bash
echo $PATH | tr ':' '\n'

# 打印
/Users/xxx/.console-ninja/.bin
/Users/xxx/.pyenv/shims
/Users/xxx/.pyenv/bin
/Users/xxx/.nvm/versions/node/v18.12.1/bin
/usr/local/bin
/usr/bin
/bin
/usr/sbin
/sbin
/Library/Apple/usr/bin
/Users/xxx/.cargo/bin
/Users/xxx/.orbstack/bin
/Users/lucian/flutter/bin
```

添加 PATH:
```bash
PATH="$PATH:/Users/user_name/Downloads"
```
这样 `Downloads` 目录下的可执行文件(`.sh` 文件)就可以直接执行了，比如 `/Users/user_name/Downloads/customShell.sh` 可以直接执行：
```bash
customShell.sh
```

## 常用SHELL命令

```bash
# 查看当前进程id
# 打印 `69573`
echo $$ 

## 查看父进程ip
# 打印 `69569`
echo $PPID

# 查看当前使用的shell
# 打印 `/bin/zsh`
echo $SHELL

# 查看环境变量
# 可以看到很多环境变量
env

# 通过export添加环境变量
# 可以通过上面的env命令查看
export GAME="game"

# 查看环境变量
# 打印 export GAME="game"
declare -p GAME
# 或者 -- 打印 game
printenv GAME


# 移除环境变量
unset GAME
```