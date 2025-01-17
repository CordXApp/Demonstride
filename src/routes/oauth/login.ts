import type {FastifyPluginAsync} from 'fastify'
import {createHash, randomUUID} from 'node:crypto'
import OAuth2Client from 'discord-oauth2'

const Login: FastifyPluginAsync = async (fastify): Promise<void> => {
    fastify.get<{ Querystring: { redirect: string } }>('/login', async (_request, _reply) => {
        let {redirect} = _request.query
        const auth = new OAuth2Client()

        const devMode = process.env.NODE_ENV === 'development' ? true : false

        if (redirect && (redirect.includes('https://') || redirect.includes('http://'))) {
            return _reply.code(400).send({
                status: '[Demonstride:invalid_redirect]',
                message: 'Please provide the redirect without a protocol',
                code: 400
            })
        }

        if (!redirect) {
            redirect = 'cordximg.host'
        }

        const state = JSON.stringify({
            csrf_token: createHash('sha256').update(`${randomUUID()}_${randomUUID()}`.replace(/-/g, '')).digest('hex'),
            date: new Date().toUTCString(),
            user_agent: _request.headers['user-agent'],
            redirect: redirect,
            ip: _request.ip
        })

        const url = auth.generateAuthUrl({
            clientId: devMode ? process.env.DEV_CLIENT_ID : process.env.PROD_CLIENT_ID,
            redirectUri: devMode ? process.env.DEV_REDIRECT : process.env.PROD_REDIRECT,
            scope: ['identify', 'guilds'],
            state: encodeURIComponent(state)
        })

        return _reply.redirect(url)
    })
}

export default Login
