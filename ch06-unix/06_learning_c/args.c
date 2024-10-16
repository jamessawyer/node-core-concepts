#include <stdio.h>

// argc -> argument count 参数的个数
int main(int argc, char *argv[]) {

    for (int i = 0; i < argc; i++) {
        printf("argv number %d is: %s\n", i, argv[i]);
    }

    return 0;
}

// gcc args.c -o args && ./args one two three -foo -bar

// 运行结果
// argv number 0 is: ./args
// argv number 1 is: one
// argv number 2 is: two
// argv number 3 is: three
// argv number 4 is: -foo
// argv number 5 is: -bar