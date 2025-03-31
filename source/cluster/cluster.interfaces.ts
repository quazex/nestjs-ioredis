import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import { RedisClusterConfig } from './cluster.types';

export interface RedisClusterConfigFactory {
    createRedisClusterConfig(): Promise<RedisClusterConfig> | RedisClusterConfig;
}

export interface RedisClusterAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<RedisClusterConfigFactory>;
    useFactory?: (...args: any[]) => Promise<RedisClusterConfig> | RedisClusterConfig;
}
