import type { FastifyPluginAsync } from 'fastify'

const SystemStats: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get('/stats', async (_request, _reply) => {
        const users = await fastify.cordx.db.entities.users.count()
        const orgs = await fastify.cordx.db.entities.orgs.count()
        const bots = await fastify.cordx.db.entities.bots.count()

        const partners = await fastify.cordx.db.prisma.partners.count()
        const uploads = await fastify.cordx.db.prisma.uploads.count()
        const domains = await fastify.cordx.db.prisma.domains.count()
        const reports = await fastify.cordx.db.prisma.reports.count()
        const errors = await fastify.cordx.db.prisma.errors.count()

        return _reply.send({
            users: users ?? 'No users available',
            orgs: orgs ?? 'No orgs available',
            bots: bots ?? 'No bots available',
            partners: partners ?? 'No partners available',
            uploads: uploads ?? 'No uploads available',
            domains: domains ?? 'No domains available',
            reports: reports ?? 'No reports available',
            errors: errors ?? 'No errors available'
        })
    })
}

export default SystemStats
