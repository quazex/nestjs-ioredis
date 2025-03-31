import { FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { RedisClusterAsyncConfig, RedisClusterConfigFactory } from './cluster.interfaces';
import { RedisClusterConfig } from './cluster.types';
import { RedisClusterUtilities } from './cluster.utilities';

export class RedisClusterProviders {
    public static getConfig(options: RedisClusterConfig & { name?: string }): ValueProvider<RedisClusterConfig> {
        const optionsToken = RedisClusterUtilities.getConfigToken(options.name);
        return {
            provide: optionsToken,
            useValue: options,
        };
    }

    public static getAsyncConfig(options: RedisClusterAsyncConfig): Provider<RedisClusterConfig> {
        const optionsToken = RedisClusterUtilities.getConfigToken(options.name);
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

    public static getCluster(name?: string): FactoryProvider<Cluster> {
        const configToken = RedisClusterUtilities.getConfigToken(name);
        const connectionToken = RedisClusterUtilities.getConnectionToken(name);
        return {
            provide: connectionToken,
            useFactory: (config: RedisClusterConfig) => new Cluster(config.nodes, config.options),
            inject: [configToken],
        };
    }
}
