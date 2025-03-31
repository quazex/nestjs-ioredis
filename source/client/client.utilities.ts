export class RedisClientUtilities {
    private static getCommon(type: string, name = 'default'): string {
        const token = ['redis', 'client', 'module', name, type];
        return token.filter(Boolean).join('_');
    }

    public static getOptionsToken(name?: string): string {
        return this.getCommon('options', name);
    }

    public static getConnectionToken(name?: string): string {
        return this.getCommon('connection', name);
    }
}
