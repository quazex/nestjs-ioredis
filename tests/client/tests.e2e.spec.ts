import { faker } from '@faker-js/faker';
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { TestingRedisClientFactory } from './tests.factory';
import { TestingDocument } from './tests.types';

describe('Redis > E2E', () => {
    const tModule = new TestingRedisClientFactory();

    beforeAll(tModule.init.bind(tModule));
    afterAll(tModule.close.bind(tModule));

    test('Check connection', async() => {
        const service = tModule.getService();
        const isHealth = await service.ping();

        expect(isHealth).toBe(true);
    });

    test('Check write/read operations', async() => {
        const service = tModule.getService();

        const document: TestingDocument = {
            id: faker.string.uuid(),
            name: faker.person.firstName(),
            updated_at: new Date(),
        };

        await service.write(document);
        const reply = await service.read(document.id);

        expect(reply).toBeDefined();
        expect(reply?.name).toBe(document.name);
    });
});
