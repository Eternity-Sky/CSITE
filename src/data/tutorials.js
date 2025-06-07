export const tutorials = [
  {
    id: 1,
    title: "C语言简介",
    content: "C语言是一种通用的编程语言，由Dennis Ritchie在1972年开发。它是最古老和最广泛使用的编程语言之一。",
    codeExample: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    category: "基础入门"
  },
  {
    id: 2,
    title: "变量和数据类型",
    content: "在C语言中，变量必须先声明后使用。基本数据类型包括int、float、double、char等。",
    codeExample: `int number = 10;
float price = 3.14;
char grade = 'A';`,
    category: "基础入门"
  },
  {
    id: 3,
    title: "控制结构",
    content: "C语言提供了if-else、switch、while、for等控制结构来实现程序流程控制。",
    codeExample: `if (score >= 60) {
    printf("及格\\n");
} else {
    printf("不及格\\n");
}`,
    category: "基础入门"
  }
]; 