import type {FastifyPluginAsync} from 'fastify'
import axios from 'axios'

/**
 * @swagger
 * /bucket:
 *   get:
 *     tags: ['Bucket']
 *     description: Get our bucket server statistics.
 *     responses:
 *       200:
 *         description: Server statistics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BucketStats'
 *       500:
 *         description: Failed to fetch bucket stats.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BucketStats:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Status message.
 *         uptime:
 *           type: string
 *           description: Uptime of the bucket server.
 *         nodes:
 *           type: string
 *           description: Number of nodes online.
 *         buckets:
 *           type: string
 *           description: Total number of buckets.
 *         objects:
 *           type: string
 *           description: Total number of objects stored.
 *         totalStorageUsed:
 *           type: string
 *           description: Total storage used.
 *         freeStorageSpace:
 *           type: string
 *           description: Free storage space available.
 *         totalRequests:
 *           type: string
 *           description: Total number of requests.
 *         totalErrors:
 *           type: string
 *           description: Total number of errors.
 *         networkReceived:
 *           type: string
 *           description: Total network traffic received.
 *         networkSent:
 *           type: string
 *           description: Total network traffic sent.
 *         code:
 *           type: integer
 *           description: HTTP status code.
 */

const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 3600))
    seconds %= 24 * 3600
    const hours = Math.floor(seconds / 3600)
    seconds %= 3600
    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)

    return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

const formatBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) {return '0 Byte'}
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

const Bucket: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get('/', async (_request, _reply) => {
        try {
            const uptime = 'minio_node_process_uptime_seconds'
            const nodes = 'minio_cluster_nodes_online_total'
            const buckets = 'minio_cluster_bucket_total'
            const objects = 'minio_cluster_usage_object_total'
            const totalStorage = 'minio_cluster_capacity_usable_total_bytes'
            const freeStorage = 'minio_cluster_capacity_usable_free_bytes'
            const totalRequests = 'minio_s3_requests_total'
            const totalErrors = 'minio_s3_requests_errors_total'
            const networkReceived = 'minio_s3_traffic_received_bytes'
            const networkSent = 'minio_s3_traffic_sent_bytes'

            const prometheusUrl = (process.env.PROMETHEUS_URL + 'api/v1/query') as string

            const uptimeResponse = await axios.get(prometheusUrl, {params: {query: uptime}})
            const nodesResponse = await axios.get(prometheusUrl, {params: {query: nodes}})
            const bucketsResponse = await axios.get(prometheusUrl, {params: {query: buckets}})
            const objectResponse = await axios.get(prometheusUrl, {params: {query: objects}})
            const totalStorageResponse = await axios.get(prometheusUrl, {params: {query: totalStorage}})
            const freeStorageResponse = await axios.get(prometheusUrl, {params: {query: freeStorage}})
            const totalRequestsResponse = await axios.get(prometheusUrl, {params: {query: totalRequests}})
            const totalErrorsResponse = await axios.get(prometheusUrl, {params: {query: totalErrors}})
            const networkReceivedResponse = await axios.get(prometheusUrl, {params: {query: networkReceived}})
            const networkSentResponse = await axios.get(prometheusUrl, {params: {query: networkSent}})

            const uptimeMetrics = uptimeResponse.data.data.result
            const uptimeTotal =
                uptimeMetrics.length > 0 ? formatUptime(parseFloat(uptimeMetrics[0].value[1])) : 'Unknown'

            const nodeMetrics = nodesResponse.data.data.result
            const nodesOnline = nodeMetrics.length > 0 ? nodeMetrics[0].value[1] : 'Unknown'

            const bucketsMetrics = bucketsResponse.data.data.result
            const totalBuckets = bucketsMetrics.length > 0 ? bucketsMetrics[0].value[1] : 'Unknown'

            const objectMetrics = objectResponse.data.data.result
            const objectsStored = objectMetrics.length > 0 ? objectMetrics[0].value[1] : 'Unknown'

            const totalStorageMetrics = totalStorageResponse.data.data.result
            const totalStorageValue = totalStorageMetrics.length > 0 ? parseFloat(totalStorageMetrics[0].value[1]) : 0

            const freeStorageMetrics = freeStorageResponse.data.data.result
            const freeStorageValue = freeStorageMetrics.length > 0 ? parseFloat(freeStorageMetrics[0].value[1]) : 0

            const totalStorageUsedValue = totalStorageValue - freeStorageValue

            const totalRequestsMetrics = totalRequestsResponse.data.data.result
            const totalRequestsValue = totalRequestsMetrics.length > 0 ? totalRequestsMetrics[0].value[1] : 'Unknown'

            const totalErrorsMetrics = totalErrorsResponse.data.data.result
            const totalErrorsValue = totalErrorsMetrics.length > 0 ? totalErrorsMetrics[0].value[1] : 'Unknown'

            const networkReceivedMetrics = networkReceivedResponse.data.data.result
            const networkReceivedValue =
                networkReceivedMetrics.length > 0
                    ? formatBytes(parseFloat(networkReceivedMetrics[0].value[1]))
                    : 'Unknown'

            const networkSentMetrics = networkSentResponse.data.data.result
            const networkSentValue =
                networkSentMetrics.length > 0 ? formatBytes(parseFloat(networkSentMetrics[0].value[1])) : 'Unknown'

            const diskUsage = `${formatBytes(totalStorageUsedValue)}/${formatBytes(totalStorageValue)}`

            return _reply.code(200).send({
                status: '[Demonstride:cordx_object_storage]',
                uptime: uptimeTotal,
                nodes: nodesOnline,
                buckets: totalBuckets,
                objects: objectsStored,
                diskUsage,
                totalRequests: totalRequestsValue,
                totalErrors: totalErrorsValue,
                networkReceived: networkReceivedValue,
                networkSent: networkSentValue,
                code: 200
            })
        } catch (err: unknown) {
            if (err instanceof Error) {
                fastify.log.error(err.stack)

                return _reply.code(500).send({
                    status: '[Demonstride:bucket_info_error]',
                    message: 'Failed to fetch bucket stats',
                    error: err.message,
                    code: 500
                })
            }

            return _reply.code(500).send({
                status: '[Demonstride:bucket_info_unknown_error]',
                message: 'Failed to fetch bucket stats',
                code: 500
            })
        }
    })
}

export default Bucket
