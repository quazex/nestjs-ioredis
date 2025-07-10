import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import { RedisClientConfig } from './client.types';

export interface RedisClientOptionsFactory {
    createRedisClientOptions(): Promise<RedisClientConfig> | RedisClientConfig;
}

export interface RedisClientAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<RedisClientOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<RedisClientConfig> | RedisClientConfig;
}
