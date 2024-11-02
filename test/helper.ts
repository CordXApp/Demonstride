import Fastify from 'fastify';
import fp from 'fastify-plugin';
import type * as tap from 'tap';

import App from '../src/app';
import { initGraphql } from '../src/graphql';

export type Test = (typeof tap)['Test']['prototype'];

async function config() {
    return {}
}

async function build(t: Test) {
    const app = Fastify();

    void app.register(fp(App), await config());

    void initGraphql(app);

    await app.ready();

    t.teardown(async () => app.close());

    return app;
}

export { config, build };