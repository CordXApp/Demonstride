import type { FastifyPluginAsync } from "fastify";
import type CordX from '@/client';

const SystemStats: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get('/stats', async (_request, _reply) => {
        const users = await fastify.cordx.db.prisma.userEntity.count();
        const orgs = await fastify.cordx.db.prisma.orgEntity.count();
        const domains = await fastify.cordx.db.prisma.entityDomains.count();
        const reports = await fastify.cordx.db.prisma.reports.count();
        const errors = await fastify.cordx.db.prisma.errors.count();

        const uuploads = await fastify.cordx.db.prisma.entityUploads.groupBy({
            by: ['type'],
            where: { type: 'USER' },
            _count: { _all: true }
        });

        const ouploads = await fastify.cordx.db.prisma.entityUploads.groupBy({
            by: ['type'],
            where: { type: 'ORG' },
            _count: { _all: true }
        });

        return _reply.send({
            users,
            orgs,
            domains,
            reports,
            errors,
            uuploads,
            ouploads
        })

    });
}

export default SystemStats;