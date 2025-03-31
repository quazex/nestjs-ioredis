export class RedisClusterUtilities {
    private static getCommon(type: string, name = 'default'): string {
        const token = ['redis', 'cluster', 'module', name, type];
        return token.filter(Boolean).join('_');
    }

    public static getConfigToken(name?: string): string {
        return this.getCommon('config', name);
    }

    public static getConnectionToken(name?: string): string {
        return this.getCommon('connection', name);
    }
}
