import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisClusterAsyncConfig } from './cluster.interfaces';
import { RedisClusterProviders } from './cluster.providers';
import { RedisClusterConfig } from './cluster.types';

@Global()
@Module({})
export class RedisClusterModule {
    public static forRoot({ name, ...options }: RedisClusterConfig & { name?: string }): DynamicModule {
        const optionsProvider = RedisClusterProviders.getConfig(options);
        const clusterProvider = RedisClusterProviders.getCluster(name);

        const dynamicModule: DynamicModule = {
            module: RedisClusterModule,
            providers: [
                optionsProvider,
                clusterProvider,
            ],
            exports: [
                clusterProvider,
            ],
        };
        return dynamicModule;
    }


    public static forRootAsync(asyncOptions: RedisClusterAsyncConfig): DynamicModule {
        const optionsProvider = RedisClusterProviders.getAsyncConfig(asyncOptions);
        const clusterProvider = RedisClusterProviders.getCluster(asyncOptions.name);

        const dynamicModule: DynamicModule = {
            module: RedisClusterModule,
            imports: asyncOptions.imports,
            providers: [
                optionsProvider,
                clusterProvider,
            ],
            exports: [
                clusterProvider,
            ],
        };

        return dynamicModule;
    }
}
