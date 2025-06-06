import { FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { RedisClusterAsyncConfig, RedisClusterConfigFactory } from './cluster.interfaces';
import { RedisClusterTokens } from './cluster.tokens';
import { RedisClusterConfig } from './cluster.types';

export class RedisClusterProviders {
    public static getConfig(options: RedisClusterConfig): ValueProvider<RedisClusterConfig> {
        const optionsToken = RedisClusterTokens.getConfig();
        return {
            provide: optionsToken,
            useValue: options,
        };
    }

    public static getAsyncConfig(options: RedisClusterAsyncConfig): Provider<RedisClusterConfig> {
        const optionsToken = RedisClusterTokens.getConfig();
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
                useFactory: async(factory: RedisClusterConfigFactory): Promise<RedisClusterConfig> => {
                    const cluster = await factory.createRedisClusterConfig();
                    return cluster;
                },
                inject: [options.useExisting],
            };
        }
        throw new Error('Must provide useFactory or useClass');
    }

    public static getCluster(): FactoryProvider<Cluster> {
        const configToken = RedisClusterTokens.getConfig();
        const connectionToken = RedisClusterTokens.getConnection();
        return {
            provide: connectionToken,
            useFactory: (config: RedisClusterConfig) => new Cluster(config.nodes, config.options),
            inject: [configToken],
        };
    }
}
