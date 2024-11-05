import type { FastifyPluginAsync } from "fastify";
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import OAuth2Client from 'discord-oauth2';

const CallBack: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {

    fastify.get<{ Querystring: { code: any, state: any } }>('/', async (_request, _reply) => {

        const { code, state } = _request.query;
        const auth = new OAuth2Client();

        if (!code || !state) return _reply.code(400).send({
            status: '[Demonstride:oauth_callback:missing_code_or_state]',
            message: 'Please provide a valid code and state',
            code: 400
        });

        let redirect = JSON.parse(decodeURIComponent(state));

        const token = await auth.tokenRequest({
            clientId: fastify.cordx.user!.id as string,
            clientSecret: process.env.NODE_ENV === 'production' ? process.env.PROD_SECRET : process.env.DEV_SECRET,
            grantType: 'authorization_code',
            redirectUri: process.env.NODE_ENV === 'production' ? process.env.PROD_REDIRECT : process.env.DEV_REDIRECT,
            scope: 'identify guilds',
            code: code
        });

        const authorized = await auth.getUser(token.access_token);

        if (!authorized) return _reply.redirect(`/oatuh/login?redirect=${redirect}`);

        const auth_code = createHash('sha256').update(`${randomUUID()}_${randomUUID()}`.replace(/-/g, "")).digest('hex');

        let user = await fastify.cordx.db.prisma.userEntity.findUnique({ where: { userid: authorized.id } });

        let avatarUrl: string = authorized.avatar?.startsWith('a_') ? `https://cdn.discordapp.com/avatars/${authorized.id}/${authorized.avatar}.gif` : `https://cdn.discordapp.com/avatars/${authorized.id}/${authorized.avatar}.png`;
        let bannerUrl: string = authorized.banner?.startsWith('a_') ? `https://cdn.discordapp.com/banners/${authorized.id}/${authorized.banner}.gif` : `https://cdn.discordapp.com/banners/${authorized.id}/${authorized.banner}.png`;


    });
}

export default CallBack;