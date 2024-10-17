#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// begin -> $
// divider -> ,
// 12345 -> $12,345
char* formatNumber(char* input, char begin, char divider) {
    int length = strlen(input);

    // 格式化后的数字的长度
    // [length] + [divider数量] + [1 for begin sign] + [1 for null terminator -> \0]
    int formattedLength = length + length / 3 + 2;

    char* formattedNumber = (char *)malloc(formattedLength * sizeof(char));

    int j = 0;
    // 确定第一个divider的位置
    int commaCount = length % 3;

    formattedNumber[0] = begin;
    j++;

    for (int i = 0; i < length; i++) {
        formattedNumber[j] = input[i];
        j++;

        if (commaCount > 0 && i < length - 1 && (i + 1) % 3 == commaCount) {
            formattedNumber[j++] = divider;
        } else if (commaCount == 0 && i < length - 1 && (i + 1) % 3 == 0) {
            formattedNumber[j++] = divider;
        }
    }

    // 最后的\0
    formattedNumber[j] = '\0';

    return formattedNumber;
}

int main(int argc, char *argv[]) {

    // FILE *outputFile = fopen("./output.txt", "w");
    // open file for writing
    FILE *outputFile = fopen(argv[1], "w");

    // 申请内存 存放数字
    char *number = (char *)malloc(100 * sizeof(char));
    int index = 0;

    // 每次从stdin读取一个字符
    int c = fgetc(stdin);

    // 只有c不等于EOF，就一直循环读取
    while (c != EOF) {

        // 如果不是空格
        if (c != ' ') {
            // 将c存放到number中
            number[index] = c;
            index++;
        }

        if (c == ' ') {
            if (index > 0) {
                // 表示number已经是一个完成的数字了
                number[index] = '\0';

                // 格式化数字
                char* formattedNumber = formatNumber(number, argv[2][0], argv[3][0]);

                // 将格式化好的数字写入到outputFile中
                fprintf(outputFile, " %s ", formattedNumber);
                // fflush(outputFile); // 🚨 不停的写入文件 会影响效率

                // 释放内存，再重新分配内存
                // 为了更好的性能 可以不用这一步 复用内存
                free(number);
                free(formattedNumber);
                number = (char *)malloc(100 * sizeof(char));

                // 重置索引
                index = 0;
            }
        }
        
        // fprintf(stdout, "%c", c);
        c = fgetc(stdin);
    }


    // 处理完成后，关闭文件
    fclose(outputFile);
    
    exit(0);
    // return 0;
}