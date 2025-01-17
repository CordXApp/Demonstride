import type {FastifyPluginAsync} from 'fastify'

const SystemStats: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get('/stats', async (_request, _reply) => {
        const users = await fastify.db.entities.users.count()
        const orgs = await fastify.db.entities.orgs.count()
        const bots = await fastify.db.entities.bots.count()

        const partners = await fastify.db.prisma.partners.count()
        const uploads = await fastify.db.prisma.uploads.count()
        const domains = await fastify.db.prisma.domains.count()
        const reports = await fastify.db.prisma.reports.count()
        const errors = await fastify.db.prisma.errors.count()

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
