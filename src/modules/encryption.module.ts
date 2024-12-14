import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto'
import { EncryptionClient } from '../types/index'
import Logger from '@/utils/logger.util'

export class SecurityModule implements EncryptionClient {
    private logs: Logger

    constructor() {
        this.logs = new Logger('Demonstride:EncryptionModule')
    }

    public get init() {
        const { ENCRYPTION_KEY } = process.env

        if (!ENCRYPTION_KEY) {
            this.logs.error('Encryption key not found in environment variables')
            throw new Error('Encryption key not found in environment variables')
        }

        return {
            encrypt: async (data: string, key?: string): Promise<string> => {
                try {
                    if (!key) {
                        key = ENCRYPTION_KEY
                    }

                    const iv = randomBytes(16)
                    const cipher = createCipheriv('aes-256-gcm', key, iv)

                    this.logs.info(`Encrypting data with key: ${key}`)

                    let encrypted = cipher.update(data, 'utf8', 'hex')
                    encrypted += cipher.final('hex')

                    this.logs.info(`Generating authentication tag for data`)

                    const tag = cipher.getAuthTag()

                    this.logs.ready(`Data encrypted successfully with key: ${key}`)

                    return iv.toString('hex') + ':' + encrypted + ':' + tag.toString('hex')
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        this.logs.error(`Encryption failed: ${err.message}`)
                    }

                    this.logs.error(`Encryption failed, please try again later!`)

                    return ''
                }
            },

            decrypt: async (data: string, key?: string): Promise<string> => {
                try {
                    if (!key) {
                        key = ENCRYPTION_KEY
                    }

                    this.logs.info(`Decrypting data with key: ${key}`)

                    const parts: string[] = data.split(':')
                    const iv = Buffer.from(parts.shift() as string, 'hex')
                    const tag = Buffer.from(parts.pop() as string, 'hex')
                    const decipher = createDecipheriv('aes-256-gcm', key, iv)

                    decipher.setAuthTag(tag)

                    let decrypted = decipher.update(parts.join(':'), 'hex', 'utf8')
                    decrypted += decipher.final('utf8')

                    this.logs.ready(`Data decrypted successfully with key: ${key}`)

                    return decrypted
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        this.logs.error(`Decryption failed: ${err.message}`)
                    }

                    return ''
                }
            },

            partial: async (data: string): Promise<string> => {
                try {
                    const parts: string[] = data.split(':')
                    return parts[0]
                } catch (err: unknown) {
                    if (err instanceof Error) {
                        this.logs.error(`Partial decryption failed: ${err.message}`)
                    }

                    return ''
                }
            }
        }
    }
}
