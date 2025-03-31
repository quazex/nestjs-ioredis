import { OnApplicationShutdown } from '@nestjs/common';

export type TestingDocument = Record<string, unknown> & {
    id: string;
};

export interface TestingRedisService extends OnApplicationShutdown {
    write: (data: TestingDocument) => Promise<void>;
    read: (id: string) => Promise<TestingDocument | null>;
    ping: () => Promise<boolean>;
}
