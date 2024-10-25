import type { FastifyPluginAsync } from "fastify";
import { version } from "../../package.json";

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {

    fastify.get('/', async (_request, _reply) => ({
        status: 'OK',
        message: 'Welcome to Demonstride, the new and improved CordX API.',
        version: `${version}`,
        code: 200
    }));
}

export default root;