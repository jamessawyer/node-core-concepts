#include <stdio.h>
#include <stdlib.h>

int main() {

    // malloc
    int* allocatedMemory = malloc(12); // 12 bytes

    // int -> 4bytes 因此这里循环3次
    for (int i = 0; i < 3; i++) {
        allocatedMemory[i] = 192039932;
    }

    for (int i = 0; i < 3; i++) {
        printf("Number is: %d\n", allocatedMemory[i]);
    }

    // type casting to char类型
    char* charMemory = (char*) allocatedMemory;
    // char -> 1 byte
    for (int i = 0; i < 12; i++) {
        printf("Char is: %c\n", charMemory[i]);
    }

    return 0;
}