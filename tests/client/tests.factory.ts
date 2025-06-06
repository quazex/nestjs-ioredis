import { faker } from '@faker-js/faker';
import { FactoryProvider } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { Redis } from 'ioredis';
import { RedisClientModule } from '../../source/client/client.module';
import { RedisClientTokens } from '../../source/client/client.tokens';
import { TestingDocument, TestingRedisService } from './tests.types';

export class TestingRedisClientFactory {
    private _testing: TestingModule;
    private _container: StartedRedisContainer;

    private _token = faker.string.alpha({ length: 10 });

    public async init(): Promise<void> {
        const tContainer = new RedisContainer('redis:7.2.1');

        this._container = await tContainer.withReuse().start();

        const tProvider: FactoryProvider<TestingRedisService> = {
            provide: this._token,
            useFactory: (client: Redis) => ({
                onApplicationShutdown: async(): Promise<void> => {
                    await client.quit();
                },
                write: async(document): Promise<void> => {
                    const value = JSON.stringify(document);
                    await client.set(document.id, value);
                },
                read: async(id): Promise<TestingDocument | null> => {
                    const value = await client.get(id);
                    if (typeof value === 'string') {
                        return JSON.parse(value) as TestingDocument;
                    }
                    return null;
                },
                ping: async(): Promise<boolean> => {
                    const reply = await client.ping();
                    return reply === 'PONG';
                },
            }),
            inject: [
                RedisClientTokens.getConnection(),
            ],
        };

        const tModule = Test.createTestingModule({
            imports: [
                RedisClientModule.forRoot({
                    host: this._container.getHost(),
                    port: this._container.getPort(),
                    password: this._container.getPassword(),
                }),
            ],
            providers: [
                tProvider,
            ],
        });

        this._testing = await tModule.compile();
        this._testing = await this._testing.init();

        this._testing.enableShutdownHooks();
    }

    public async close(): Promise<void> {
        await this._testing.close();
        await this._container.stop();
    }

    public get service(): TestingRedisService {
        return this._testing.get<TestingRedisService>(this._token);
    }
}
