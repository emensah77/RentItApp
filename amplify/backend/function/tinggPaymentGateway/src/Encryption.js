const crypto = require('crypto')

class Encryption {
    constructor(ivKey, secretKey, algorithm) {
        this.IVKey = ivKey
        this.secretKey = secretKey
        this.algorithm = algorithm
    }

    encrypt(payload) {
        let key = crypto
            .createHash('sha256')
            .update(this.secretKey)
            .digest('hex')
            .substring(0, 32)

        key = Buffer.from(key)

        // prepare the IV key
        let iv = crypto
            .createHash('sha256')
            .update(this.IVKey)
            .digest('hex')
            .substring(0, 16)

        iv = Buffer.from(iv)

        const cipher = crypto
            .createCipheriv(this.algorithm, Buffer.from(key), iv)

        let encrypted = cipher.update(payload)

        encrypted = Buffer
            .concat([encrypted, cipher.final()])

        let base64 = Buffer
            .from(encrypted, 'binary')
            .toString('base64')
        return Buffer
            .from(base64, 'binary')
            .toString('base64')
    }
}

module.exports = Encryption