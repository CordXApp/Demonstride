import closeWithGrace from 'close-with-grace'
import * as dotenv from 'dotenv'
import Fastify from 'fastify'

import { initGraphql } from './graphql';
import { initSwagger } from './swagger';
import { ClientOptions } from 'discord.js';
import CordX from './client';

import app from './app'

dotenv.config()

const discordOptions: ClientOptions = { intents: ["GuildMembers", "MessageContent"] }
const discordClient = new CordX(discordOptions)

const isProduction = process.env.NODE_ENV === 'production'
const server = Fastify({
    logger: !isProduction,
})

void server.register(app)

void initGraphql(server)

void initSwagger(server)

void discordClient.authenticate(process.env.TOKEN as string);

server.decorate('cordx', discordClient);

const closeListeners = closeWithGrace({ delay: 500 }, async (opts: any) => {
    if (opts.err) {
        server.log.error(opts.err)
    }

    await server.close()
    await discordClient.destroy();
})

server.addHook('onClose', (_instance, done) => {
    closeListeners.uninstall()
    done()
})

void server.listen({
    port: Number(process.env.PORT ?? 4995),
    host: process.env.SERVER_HOSTNAME ?? '127.0.0.1',
})

void server.ready((err) => {
    if (err) {
        server.log.error(err)
        process.exit(1)
    }

    server.log.info(
        'All routes loaded! Check your console for the route details.',
    )

    console.log(server.printRoutes())

    server.log.info(
        `Server listening on port ${Number(process.env.PORT ?? 4995)}`,
    )
})

declare module 'fastify' {
    interface FastifyInstance {
        cordx: CordX;
    }
}

export { server as app }