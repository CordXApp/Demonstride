import type {FastifyPluginAsync} from 'fastify'

const health: FastifyPluginAsync = async (fastify): Promise<void> => {
    /**
     * @swagger
     * /health:
     *   get:
     *     description: Check the health of the API.
     *     responses:
     *       200:
     *        description: The API is healthy and running.
     */
    fastify.get('/health', async (_request, _reply) => {
        const memoryUsage = process.memoryUsage()
        const uptime = process.uptime()

        const healthStatus = {
            status: 'OK',
            message: 'Demonstride is healthy and running.',
            process: {
                memoryUsage: {
                    rss: memoryUsage.rss,
                    heapTotal: memoryUsage.heapTotal,
                    heapUsed: memoryUsage.heapUsed,
                    external: memoryUsage.external
                },
                system: {
                    database: fastify.db.isConnected(),
                    uptime: `${Math.floor(uptime / 60)} minutes ${Math.floor(uptime % 60)} seconds`,
                    nodeVersion: process.version,
                    platform: process.platform,
                    pid: process.pid
                }
            }
        }

        _reply.send(healthStatus)
    })
}

export default health
