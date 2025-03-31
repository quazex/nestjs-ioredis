import { FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
import { RedisClientAsyncOptions, RedisClientOptionsFactory } from './client.interfaces';
import { RedisClientUtilities } from './client.utilities';

export class RedisClientProviders {
    public static getOptions(options: RedisOptions & { name?: string }): ValueProvider<RedisOptions> {
        const optionsToken = RedisClientUtilities.getOptionsToken(options.name);
        return {
            provide: optionsToken,
            useValue: options,
        };
    }

    public static getAsyncOptions(options: RedisClientAsyncOptions): Provider<RedisOptions> {
        const optionsToken = RedisClientUtilities.getOptionsToken(options.name);
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

    public static getClient(name?: string): FactoryProvider<Redis> {
        const optionsToken = RedisClientUtilities.getOptionsToken(name);
        const connectionToken = RedisClientUtilities.getConnectionToken(name);
        return {
            provide: connectionToken,
            useFactory: (options: RedisOptions) => new Redis(options),
            inject: [optionsToken],
        };
    }
}
