import type { FastifyPluginAsync } from 'fastify'
import { createHash, randomUUID } from 'node:crypto'
import OAuth2Client from 'discord-oauth2'

const CallBack: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get<{ Querystring: { code: string; state: string } }>('/callback', async (_request, _reply) => {
        const { code, state } = _request.query
        const auth = new OAuth2Client()

        if (!code || !state) {
            return _reply.code(400).send({
                status: '[Demonstride:oauth_callback:missing_code_or_state]',
                message: 'Please provide a valid code and state',
                code: 400
            })
        }

        let { redirect } = JSON.parse(decodeURIComponent(state))

        const token = await auth.tokenRequest({
            clientId: fastify.cordx.user!.id as string,
            clientSecret: process.env.NODE_ENV === 'production' ? process.env.PROD_SECRET : process.env.DEV_SECRET,
            grantType: 'authorization_code',
            redirectUri: process.env.NODE_ENV === 'production' ? process.env.PROD_REDIRECT : process.env.DEV_REDIRECT,
            scope: 'identify guilds',
            code: code
        })

        const authorized = await auth.getUser(token.access_token)

        if (!authorized) {
            return _reply.redirect(`/oatuh/login?redirect=${redirect}`)
        }

        const auth_code = createHash('sha256').update(`${randomUUID()}_${randomUUID()}`.replace(/-/g, '')).digest('hex')

        let user = await fastify.cordx.db.entities.users.fetch(authorized.id)

        const avatarUrl: string = authorized.avatar?.startsWith('a_')
            ? `https://cdn.discordapp.com/avatars/${authorized.id}/${authorized.avatar}.gif`
            : `https://cdn.discordapp.com/avatars/${authorized.id}/${authorized.avatar}.webp`
        const bannerUrl: string = authorized.banner?.startsWith('a_')
            ? `https://cdn.discordapp.com/banners/${authorized.id}/${authorized.banner}.gif`
            : `https://cdn.discordapp.com/banners/${authorized.id}/${authorized.banner}.webp`

        if (!user.success) {
            user = await fastify.cordx.db.entities.users.create({
                name: authorized.username as string,
                handle: authorized.global_name as string,
                userid: authorized.id,
                avatar: avatarUrl,
                banner: bannerUrl
            })
        }

        if (!user.success) {
            return _reply.code(500).send({
                status: '[Demonstride:oauth_error]',
                message: user.message,
                code: 500
            })
        }

        if (user.data.permissions.includes('BANNED_USER')) {
            return _reply.code(403).send({
                status: '[Demonstride:oauth_forbidden]',
                message: 'You are banned from using the CordX services!',
                code: 403
            })
        }

        if (!user.data.permissions.includes('BETA_TESTER')) {
            return _reply.code(403).send({
                status: '[Demonstride:oauth_forbidden]',
                message: 'This authorization process is currently limited to beta testers!',
                code: 403
            })
        }

        const encodedAuthCode = encodeURIComponent(auth_code)
        const encodedUser = encodeURIComponent(JSON.stringify(user.data))

        if (redirect.includes('localhost')) {
            redirect = `http://${redirect}/api/auth/validate?user_data=${encodedUser}&auth_code=${encodedAuthCode}`
        } else {
            redirect = `https://${redirect}/api/auth/validate?user_data=${encodedUser}&auth_code=${encodedAuthCode}`
        }

        return _reply.code(302).redirect(redirect)
    })
}

export default CallBack
