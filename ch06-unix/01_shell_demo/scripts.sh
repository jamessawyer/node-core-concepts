
# 定义变量
myvar=10

myfunc() {
    # 打印变量
    echo $myvar
    x=100
    y=200

    echo $(($x + $y))
    # $1 $2 表示传入函数的参数
    echo $1 | tr ' ' '\n'
}

# 调用函数不需要加 `()`
# "hello world" 是函数第一个参数
myfunc "hello world"
