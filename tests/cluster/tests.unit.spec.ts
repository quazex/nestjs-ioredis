import { Faker, faker } from '@faker-js/faker';
import { describe, expect, jest, test } from '@jest/globals';
import { Injectable, Module, ValueProvider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { RedisClusterConfigFactory } from '../../source/cluster/cluster.interfaces';
import { RedisClusterModule } from '../../source/cluster/cluster.module';
import { RedisClusterConfig } from '../../source/cluster/cluster.types';

jest.mock('ioredis', () => ({
    Cluster: jest.fn(),
}));

describe('RedisCluster > Unit', () => {
    test('forRoot()', async() => {
        const tBuilder = Test.createTestingModule({
            imports: [
                RedisClusterModule.forRoot({
                    nodes: [{
                        host: faker.internet.domainName(),
                        port: faker.internet.port(),
                    }],
                    options: {
                        redisOptions: {
                            password: faker.internet.password(),
                            db: faker.number.int({ min: 0, max: 10 }),
                        },
                    },
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(RedisClusterModule);
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
                RedisClusterModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: (f: Faker) => ({
                        nodes: [{
                            host: f.internet.domainName(),
                            port: f.internet.port(),
                        }],
                        options: {
                            redisOptions: {
                                password: f.internet.password(),
                                db: f.number.int({ min: 0, max: 10 }),
                            },
                        },
                    }),
                    inject: [configToken],
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(RedisClusterModule);
        expect(oModule).toBeInstanceOf(RedisClusterModule);

        await tFixture.close();
    });

    test('forRootAsync with useExisting()', async() => {
        @Injectable()
        class RedisClusterConfigProvider implements RedisClusterConfigFactory {
            public createRedisClusterConfig(): RedisClusterConfig {
                return {
                    nodes: [{
                        host: faker.internet.domainName(),
                        port: faker.internet.port(),
                    }],
                    options: {
                        redisOptions: {
                            password: faker.internet.password(),
                            db: faker.number.int({ min: 0, max: 10 }),
                        },
                    },
                };
            }
        }

        @Module({
            providers: [RedisClusterConfigProvider],
            exports: [RedisClusterConfigProvider],
        })
        class ConfigModule {}

        const tBuilder = Test.createTestingModule({
            imports: [
                RedisClusterModule.forRootAsync({
                    imports: [ConfigModule],
                    useExisting: RedisClusterConfigProvider,
                }),
            ],
        });
        const tFixture = await tBuilder.compile();

        const oModule = tFixture.get(RedisClusterModule);
        expect(oModule).toBeInstanceOf(RedisClusterModule);

        await tFixture.close();
    });
});
