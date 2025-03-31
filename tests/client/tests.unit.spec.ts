import { Faker, faker } from '@faker-js/faker';
import { describe, expect, jest, test } from '@jest/globals';
import { Injectable, Module, ValueProvider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { RedisOptions } from 'ioredis';
import { RedisClientOptionsFactory } from '../../source/client/client.interfaces';
import { RedisClientModule } from '../../source/client/client.module';

jest.mock('ioredis', () => ({
    Redis: jest.fn(),
}));

describe('RedisClient > Unit', () => {
    test('forRoot()', async() => {
        const tBuilder = Test.createTestingModule({
            imports: [
                RedisClientModule.forRoot({
                    host: faker.internet.domainName(),
                    port: faker.internet.port(),
                    password: faker.internet.password(),
                    db: faker.number.int({ min: 0, max: 10 }),
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(RedisClientModule);
        expect(oModule).toBeDefined();

        await tFixture.close();
    });

    test('forRootAsync with useFactory()', async() => {
        const configToken = faker.word.adjective();
        const provider: ValueProvider<Faker> = {
            provide: configToken,
            useValue: faker,
        };

        @Module({
            providers: [provider],
            exports: [provider],
        })
        class ConfigModule {}

        const tBuilder = Test.createTestingModule({
            imports: [
                RedisClientModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (f: Faker) => ({
                        host: f.internet.domainName(),
                        port: f.internet.port(),
                        password: f.internet.password(),
                        db: f.number.int({ min: 0, max: 10 }),
                    }),
                    inject: [configToken],
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(RedisClientModule);
        expect(oModule).toBeInstanceOf(RedisClientModule);

        await tFixture.close();
    });

    test('forRootAsync with useExisting()', async() => {
        @Injectable()
        class RedisClientConfig implements RedisClientOptionsFactory {
            public createRedisClientOptions(): RedisOptions {
                return {
                    host: faker.internet.domainName(),
                    port: faker.internet.port(),
                    password: faker.internet.password(),
                    db: faker.number.int({ min: 0, max: 10 }),
                };
            }
        }

        @Module({
            providers: [RedisClientConfig],
            exports: [RedisClientConfig],
        })
        class ConfigModule {}

        const tBuilder = Test.createTestingModule({
            imports: [
                RedisClientModule.forRootAsync({
                    imports: [ConfigModule],
                    useExisting: RedisClientConfig,
                    name: faker.string.alpha({ length: 10 }),
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(RedisClientModule);
        expect(oModule).toBeInstanceOf(RedisClientModule);

        await tFixture.close();
    });
});
