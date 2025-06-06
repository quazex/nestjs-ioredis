export class RedisClusterTokens {
    public static getConfig(): string {
        return String('redis_cluster_module_config');
    }

    public static getConnection(): string {
        return String('redis_cluster_module_connection');
    }
}
