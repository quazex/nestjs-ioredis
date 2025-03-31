import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface RedisClientOptionsFactory {
    createRedisClientOptions(): Promise<RedisOptions> | RedisOptions;
}

export interface RedisClientAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<RedisClientOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
}
