#include <stdio.h>
#include <string.h>

// 获取字符串的长度
int length(char s[]) {
    char c = s[0];
    int length = 0;

    while (c != '\0') {
        length++;
        c = s[length];
    }
    return length;
}

// gcc app.c -o app
int main() {
    // 基本类型 int, long int, size_t, float, char
    // 4 bytes
    int a = 10;
    int b = 20;
    int c = a + b;

    // 4 bytes
    float foo = 2993.12;

    // 1 byte
    char my_char = 'g';

    // string
    // 以最后的 `\0` 表示字符串的结束
    char myStr[5]; // 手动定义字符串
    myStr[0] = 'T'; // 这里是单引号 即char类型
    myStr[1] = 'e';
    myStr[2] = 's';
    myStr[3] = 't';
    myStr[4] = '\0';
    printf("My string is: %s\n", myStr);
    printf("My string address: %p\n", myStr);
    // 等价于下面
    printf("My string address: %p\n", &myStr[0]);

    // 字符串的另一种定义方式
    char *myStr2 = "Test string";

    printf("myStr2字符串的长度是: %d\n", length(myStr2));
    // length()函数等价于 <string.h> 中的 strlen 方法 但它的返回类型是 size_t
    printf("myStr2字符串的长度是: %zu\n", strlen(myStr2));

    // 8 bytes
    // ULL -> unsigned long long
    size_t t = 19939399030202ULL;

    // 打印替换
    // %d  --> int
    // %f  --> float
    // %c  --> char
    // %s  --> char* (即string pointer)
    // %zu --> size_t  8 bytes
    // %p  --> void* 指针内存地址
    printf("my_char = %c\n", my_char);
    // printf("c = %d\n", c);

    fprintf(stdout, "c = %d\n", c);

    // 打印地址
    // &t -> t的内存地址
    // `*(&t)` -> t的值
    for (int i = 0; i < sizeof(size_t); i++) {
        printf("Bytes %d address: %p\n", i, (void *)((char *)&t + i));
    }

    // 0 - 表示正常返回
    // 其余数字 - 表示程序出现错误
    return 0;
}