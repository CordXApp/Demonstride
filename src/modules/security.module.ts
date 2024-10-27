import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import { SecurityClient } from '../types/modules/security';

export class SecurityModule implements SecurityClient {

    constructor() { }

    public get init() {

        const { ENCRYPTION_KEY } = process.env;

        if (!ENCRYPTION_KEY) {
            throw new Error('ENCRYPTION_KEY is not defined');
        }

        return {

            encrypt: async (data: string, key?: string): Promise<string> => {
                try {
                    if (!key) key = ENCRYPTION_KEY;
                    const iv = randomBytes(16);
                    const cipher = createCipheriv('aes-256-gcm', key, iv);
                    let encrypted = cipher.update(data, 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    const tag = cipher.getAuthTag()

                    return iv.toString('hex') + ':' + encrypted + ':' + tag.toString('hex');
                } catch (err: any) {
                    throw new Error(err.message);
                }
            }
        }
    }
}