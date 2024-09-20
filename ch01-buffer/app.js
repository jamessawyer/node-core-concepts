const { Buffer } = require('node:buffer')

// 4个字节(4 bytes) -> 32bits
const container = Buffer.alloc(4)
container[0] = 0xff
container[1] = 0x23
// container[2] = 0x00
container.writeInt8(-34, 2)
container[4] = 0x01

console.log('container', container)
console.log('container', container.toString('hex'))
console.log(container.readInt8(2)) // -34


const buff = Buffer.from([0x48, 0x69, 0x21])
console.log(buff.toString('utf-8')) // Hi!
// 或者写成下面方式
const buff2 = Buffer.from('486921', 'hex')
console.log(buff2.toString('utf-8')) // Hi!

// Buffer.from() 和 Buffer.concat() 都是安全的内存分配方法，它们不会使用 unsafe 前缀。

// 指定不同的编码格式
const buff3 = Buffer.from('Hi!', 'utf-8')
console.log(buff3) // <Buffer 48 69 21>

// 获取当前 Node.js 环境中缓冲池的大小
console.log(Buffer.poolSize)

// 这个方法会创建一个指定大小的缓冲区，如果内存中有足够的空间，它会从 Node.js 的缓冲池中分配内存。这个缓冲池是预先分配的，可以快速地分配和释放缓冲区，从而提高性能。
// 由于它是从缓冲池中分配的，所以返回的缓冲区可能包含一些旧数据。在使用之前，你可能需要使用 .fill(0) 方法来清空缓冲区，以确保数据的安全性。
// 它能分配的最大size是 Buffer.poolSize >>> 1 (即右移1位，即除以2)
Buffer.allocUnsafe(100)
// 这个方法也会创建一个指定大小的缓冲区，但它不会从缓冲池中分配内存。
// 相反，它会使用 new 操作符来分配一个新的 Buffer 实例，这意味着它会进行一次完整的垃圾回收周期，以确保分配的内存是干净的。
// 由于这种方式不依赖于缓冲池，所以它通常比 Buffer.allocUnsafe() 要慢，因为它涉及到更多的内存分配和回收操作。
// 但是，返回的缓冲区是完全干净的，不需要额外的清空操作。
Buffer.allocUnsafe(100)