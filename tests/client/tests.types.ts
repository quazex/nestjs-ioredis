export type TestingDocument = Record<string, unknown> & {
    id: string;
};

export interface TestingRedisService {
    write: (data: TestingDocument) => Promise<void>;
    read: (id: string) => Promise<TestingDocument | null>;
    ping: () => Promise<boolean>;
}
