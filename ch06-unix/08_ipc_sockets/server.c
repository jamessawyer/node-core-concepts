#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/un.h>

// 定义一个常量
#define SOCKET_PATH "/tmp/node_c_socket"


void printHex(const char* data, size_t length) {
    for (size_t i = 0; i < length; i++) {
        printf("%02X ", (unsigned char)data[i]);
    }
    printf("\n");
}

int main() {
    // 创建一个socket
    int serverSocket = socket(AF_UNIX, SOCK_STREAM, 0);

    if (serverSocket == -1) {
        fprintf(stderr, "socket连接失败\n");
        exit(1);
    }

    // 设置服务器地址
    struct sockaddr_un serverAddr;
    serverAddr.sun_family = AF_UNIX;
    strcpy(serverAddr.sun_path, SOCKET_PATH);

    // unlink socket路径 确保它没有被占用
    unlink(SOCKET_PATH);

    // 绑定服务器地址
    if (bind(serverSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr)) == -1) {
        fprintf(stderr, "bind失败\n");
        close(serverSocket);
        exit(1);
    }

    // 监听到来的请求
    if (listen(serverSocket, 5) == -1) {
        fprintf(stderr, "listen失败\n");
        close(serverSocket);
        exit(1);
    }

    printf("Server is listening... \n");

    while (1) {
        // 接受连接
        int clientSocket = accept(serverSocket, NULL, NULL);

        // 接受数据
        if (clientSocket == -1) {
            fprintf(stderr, "Socket accept失败11\n");
            close(serverSocket);
            exit(1);
        }

        // 从客户端读取数据
        char buffer[100];
        ssize_t bytesRead = read(clientSocket, buffer, sizeof(buffer));

        if (bytesRead > 0) {
            // 打印数据
            printHex(buffer, bytesRead);
            fflush(stdout); // 将数据通过stdout输出到客户端
        }
    }

    close(serverSocket);

    exit(0);
}