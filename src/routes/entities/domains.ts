import type { FastifyPluginAsync } from 'fastify'

interface DomainParams {
    id: string
}

const FetchUser: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get<{ Params: DomainParams }>('/:id/domains', async (_request, _reply) => {
        const { id } = _request.params

        if (!id) {
            return _reply.code(400).send({
                status: '[Demonstride:user_fetch:missing_id_type]',
                message: 'Please provide a valid Entity ID',
                code: 400
            })
        }

        const domains = await fastify.cordx.db.domains.model.all(id)
        const count = await fastify.cordx.db.domains.model.count(id)

        if (!domains.success) {
            return _reply.code(500).send({
                status: '[Demonstride:user_fetch:failed]',
                message: domains.message,
                code: 500
            })
        }

        if (!count.success) {
            return _reply.code(500).send({
                status: '[Demonstride:user_fetch:failed]',
                message: count.message,
                code: 500
            })
        }

        return _reply.code(200).send({
            status: '[Demonstride:user_fetch:success]',
            total: `Entity has: ${count.data} domains`,
            domains: domains.data.length > 0 ? domains.data : 'No domains found'
        })
    })
}

export default FetchUser
