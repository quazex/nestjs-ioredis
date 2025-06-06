export class RedisClientTokens {
    public static getOptions(): string {
        return String('redis_client_module_options');
    }

    public static getConnection(): string {
        return String('redis_client_module_connection');
    }
}
