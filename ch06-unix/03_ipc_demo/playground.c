#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    // 类似于node中的 process.stdout.write('xxx') 写入数据
    fprintf(stdout, "Some text for stdout（C程序写给Node程序）");
    fprintf(stderr, "Some text for stderr（C程序写给Node程序）");

    // 获取 stdin
    int c = fgetc(stdin);
    while (c != EOF) {
        // 打印来自Node程序输入的字符
        fprintf(stdout, "%c", c);

        fflush(stdout);
        c = fgetc(stdin);
    }
    return 0;
}