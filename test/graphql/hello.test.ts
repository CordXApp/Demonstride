import { createMercuriusTestClient } from 'mercurius-integration-testing';
import { test } from 'tap';

import { app } from '../../src/app';

void test('hello query', async (t) => {
    t.plan(1)

    const testClient = createMercuriusTestClient(app as any);

    const response = await testClient.query(`query { hello }`);

    t.same(response, {
        data: {
            hello: 'Hello World'
        }
    })
})