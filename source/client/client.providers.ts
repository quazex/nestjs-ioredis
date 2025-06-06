import { FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
import { RedisClientAsyncOptions, RedisClientOptionsFactory } from './client.interfaces';
import { RedisClientTokens } from './client.tokens';

export class RedisClientProviders {
    public static getOptions(options: RedisOptions): ValueProvider<RedisOptions> {
        const optionsToken = RedisClientTokens.getOptions();
        return {
            provide: optionsToken,
            useValue: options,
        };
    }

    public static getAsyncOptions(options: RedisClientAsyncOptions): Provider<RedisOptions> {
        const optionsToken = RedisClientTokens.getOptions();
        if (options.useFactory) {
            return {
                provide: optionsToken,
                useFactory: options.useFactory,
                inject: options.inject,
            };
        }
        if (options.useExisting) {
            return {
                provide: optionsToken,
                useFactory: async(factory: RedisClientOptionsFactory): Promise<RedisOptions> => {
                    const client = await factory.createRedisClientOptions();
                    return client;
                },
                inject: [options.useExisting],
            };
        }
        throw new Error('Must provide useFactory or useClass');
    }

    public static getClient(): FactoryProvider<Redis> {
        const optionsToken = RedisClientTokens.getOptions();
        const connectionToken = RedisClientTokens.getConnection();
        return {
            provide: connectionToken,
            useFactory: (options: RedisOptions) => new Redis(options),
            inject: [optionsToken],
        };
    }
}
