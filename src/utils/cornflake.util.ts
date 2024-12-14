import { CordXSnowflake } from '@cordxapp/snowflake'
import Logger from './logger.util'

interface CornflakeConfig {
    workerId: number
    processId: number
    epoch: number
    increment: number
    sequence: bigint
    debug: boolean
}

export default class Cornflake {
    private logs: Logger
    private cornflake: CordXSnowflake

    constructor(config: CornflakeConfig) {
        this.logs = new Logger('Cornflake')
        this.cornflake = new CordXSnowflake(config)
    }

    public create(): string {
        try {
            return this.cornflake.generate()
        } catch (error: any) {
            this.logs.error('[Demonstride:CornflakeError] failed to generate cornflake ID:')
            throw new Error(`[Demonstride:CornflakeError] failed to generate cornflake ID: ${error.message}`)
        }
    }

    public async decompose(
        id: string
    ): Promise<{ timestamp: number; workerId: number; processId: number; sequence: number }> {
        try {
            return this.cornflake.decompose(id)
        } catch (error: any) {
            this.logs.error('[Demonstride:CornflakeError] failed to decompose cornflake ID')
            throw new Error(`[Demonstride:CornflakeError] failed to decompose cornflake ID: ${error.message}`)
        }
    }
}
