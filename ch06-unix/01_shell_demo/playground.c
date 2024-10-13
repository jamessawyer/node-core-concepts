#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

// node process.argv 实际类似下面c程序
// process.pid -> getpid()
// process.ppid -> getppid()
int main(int argc, char *argv[]) {
    for (int i = 0; i < argc; i++) {
        printf("argv number %d is: %s\n", i, argv[i]);
    }

    printf("Process ID: %d\n", getpid());
    printf("Parent Process ID: %d\n", getppid());

    // 获取环境变量
    printf("MODE env is: %s", getenv("MODE"));
    return 0;
}