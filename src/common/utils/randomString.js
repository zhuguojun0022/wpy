/**
 * param flag 是否是任意长度
 * param min 任意长度最小值
 * param max 任意长度最大值
 */
export const randomStr = (flag, min, max) => {
    let str = ''
    let index = ''
    let range = min
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b',
        'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ]
    // min,max范围内随机的一个数
    if (flag) {
        range = Math.floor(Math.random() * (max - min + 1) + min)
    }
    for (let i = 0; i < range; i++) {
        index = Math.round(Math.random() * (arr.length - 1))
        str += arr[index]
    }
    return str
}
